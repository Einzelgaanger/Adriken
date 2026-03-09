import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-3xl prose prose-neutral dark:prose-invert">
        <h1 className="font-display text-3xl font-bold text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground text-sm">Last updated: March 9, 2026</p>

        <h2>1. Acceptance</h2>
        <p>By using Adriken, you agree to these Terms of Service. If you do not agree, do not use the platform.</p>

        <h2>2. Eligibility</h2>
        <p>You must be at least 18 years old and legally capable of entering into contracts under Kenyan law.</p>

        <h2>3. Account Responsibilities</h2>
        <ul>
          <li>You are responsible for maintaining the security of your account credentials.</li>
          <li>You must provide accurate and truthful information.</li>
          <li>You must not create accounts for fraudulent purposes.</li>
        </ul>

        <h2>4. Listings & Content</h2>
        <ul>
          <li>You retain ownership of content you post (listings, images, videos, certifications).</li>
          <li>By posting, you grant Adriken a license to display your content on the platform.</li>
          <li>You must not post illegal, fraudulent, or misleading content.</li>
          <li>We reserve the right to remove content that violates these terms.</li>
        </ul>

        <h2>5. Transactions</h2>
        <p>Adriken facilitates connections between service providers and seekers. We are not a party to any transaction or contract between users. Users are solely responsible for the quality, legality, and safety of their services and products.</p>

        <h2>6. Prohibited Activities</h2>
        <ul>
          <li>Harassment, discrimination, or abuse of other users</li>
          <li>Posting false certifications or credentials</li>
          <li>Scraping or automated access to the platform</li>
          <li>Attempting to bypass security measures</li>
          <li>Using the platform for money laundering or illegal activities</li>
        </ul>

        <h2>7. Liability</h2>
        <p>Adriken is provided "as is". We are not liable for disputes between users, quality of services, or losses arising from platform use, to the maximum extent permitted by Kenyan law.</p>

        <h2>8. Intellectual Property</h2>
        <p>The Adriken brand, logo, and platform design are our property. You may not use them without written permission.</p>

        <h2>9. Termination</h2>
        <p>We may suspend or terminate accounts that violate these terms. You may delete your account at any time by contacting support.</p>

        <h2>10. Governing Law</h2>
        <p>These terms are governed by the laws of Kenya. Disputes shall be resolved through arbitration in Nairobi, Kenya.</p>

        <h2>11. Changes</h2>
        <p>We may update these terms. Continued use after changes constitutes acceptance.</p>

        <h2>12. Contact</h2>
        <p>For questions, email <strong>legal@adriken.com</strong>.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default TermsOfService;
