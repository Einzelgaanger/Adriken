import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, listings } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are Adriken's AI matching engine. Given a user's natural language request and a list of available listings (services, products, properties, vehicles, etc.), rank and return the best matches.

SEARCH EVERYWHERE: Match the user's query against ALL of the following for each listing:
- business_name (company or business name)
- provider_name (the person's name)
- bio (provider's bio — may mention specialties, company name, what they do)
- title, description, skills, services, location, experience
- goods: each listing may have a "goods" array of items (e.g. properties, vehicles, products). For each good use: name, price, description, location. If the user searches for a specific item, price range, or location (e.g. "3BR Westlands", "car under 1M", "apartment in Kilimani"), match against these goods.

So if the user searches for a company name, a person's name, something in a bio, an offering, or a specific good/location/price — look in every field above and match when relevant.

RANKING (keep these priorities; do not ignore them):
1. Relevance to the query (matches in business name, provider name, or bio can score as high as matches in title/services)
2. Location — when the user mentions a place or "near me", strongly favor listings with matching or nearby location
3. Skills and services fit
4. Experience level and ratings
5. Availability
6. A "jack of all trades" who partially fulfills should still get opportunities

For each match, provide:
- id: the listing ID
- matchScore: 0-100 score
- matchReason: a brief, friendly explanation of why this is a good match (e.g. "Company name match" or "Offers exactly what you described" or "Near you and does X")

Return a JSON array of matches sorted by matchScore descending. Include ALL listings that have ANY relevance (score > 20). Return tool call with the matches.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `User is looking for: "${query}"\n\nAvailable listings:\n${JSON.stringify(listings, null, 2)}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_matches",
              description: "Return ranked listing matches",
              parameters: {
                type: "object",
                properties: {
                  matches: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        matchScore: { type: "number" },
                        matchReason: { type: "string" },
                      },
                      required: ["id", "matchScore", "matchReason"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["matches"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_matches" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      return new Response(JSON.stringify({ error: "AI matching error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ matches: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("match-listings error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
