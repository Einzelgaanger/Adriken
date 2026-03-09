import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-3xl prose prose-neutral dark:prose-invert">
        <h1 className="font-display text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">Last updated: March 9, 2026</p>

        <h2>1. Introduction</h2>
        <p>Adriken ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and share your personal data in compliance with the <strong>Kenya Data Protection Act 2019 (DPA)</strong> and the <strong>EU General Data Protection Regulation (GDPR)</strong>.</p>

        <h2>2. Data Controller</h2>
        <p>Adriken operates as the data controller. For inquiries, contact us at <strong>privacy@adriken.com</strong>.</p>

        <h2>3. Data We Collect</h2>
        <ul>
          <li><strong>Account data:</strong> Name, email address, password (hashed)</li>
          <li><strong>Profile data (optional):</strong> Phone, WhatsApp, social media handles, bio, avatar, location, certifications, portfolio images/videos</li>
          <li><strong>Location data:</strong> Approximate or precise location when you enable live location (with your explicit consent)</li>
          <li><strong>Listing data:</strong> Titles, descriptions, pricing, availability</li>
          <li><strong>Usage data:</strong> Pages visited, search queries, timestamps</li>
          <li><strong>Device data:</strong> Browser type, IP address, device identifiers</li>
        </ul>

        <h2>4. Legal Basis for Processing</h2>
        <ul>
          <li><strong>Consent:</strong> For location data, marketing communications, and optional profile data</li>
          <li><strong>Contract:</strong> To provide the platform services you signed up for</li>
          <li><strong>Legitimate interest:</strong> Analytics, fraud prevention, platform security</li>
          <li><strong>Legal obligation:</strong> Compliance with applicable laws</li>
        </ul>

        <h2>5. How We Use Your Data</h2>
        <ul>
          <li>Providing and improving our marketplace services</li>
          <li>Matching service seekers with providers using AI</li>
          <li>Displaying your profile and contact information to potential clients (only data you choose to share)</li>
          <li>Sending transactional emails (password resets, booking confirmations)</li>
          <li>Ensuring platform security and preventing fraud</li>
        </ul>

        <h2>6. Data Sharing</h2>
        <p>We do not sell your personal data. We share data only with:</p>
        <ul>
          <li>Other users (profile information you choose to make public)</li>
          <li>Service providers who help us operate the platform (hosting, AI processing)</li>
          <li>Law enforcement when legally required</li>
        </ul>

        <h2>7. Data Retention</h2>
        <p>We retain your data for as long as your account is active. Upon deletion request, we remove personal data within 30 days, except where retention is required by law.</p>

        <h2>8. Your Rights</h2>
        <p>Under the Kenya DPA and GDPR, you have the right to:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of your personal data</li>
          <li><strong>Rectification:</strong> Correct inaccurate data</li>
          <li><strong>Erasure:</strong> Request deletion of your data</li>
          <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
          <li><strong>Object:</strong> Object to processing based on legitimate interest</li>
          <li><strong>Withdraw consent:</strong> At any time, without affecting prior processing</li>
        </ul>
        <p>To exercise these rights, email <strong>privacy@adriken.com</strong>.</p>

        <h2>9. Data Security</h2>
        <p>We implement industry-standard security measures including encryption in transit (TLS), encryption at rest, secure authentication, row-level security policies, and regular security audits.</p>

        <h2>10. International Transfers</h2>
        <p>Your data may be processed outside Kenya or the EEA. We ensure adequate safeguards are in place as required by the DPA and GDPR.</p>

        <h2>11. Cookies</h2>
        <p>We use essential cookies for authentication and session management. We use analytics cookies only with your consent. You can manage cookies through your browser settings or our cookie banner.</p>

        <h2>12. Children</h2>
        <p>Adriken is not intended for children under 18. We do not knowingly collect data from minors.</p>

        <h2>13. Changes</h2>
        <p>We may update this policy. Significant changes will be communicated via email or in-app notification.</p>

        <h2>14. Contact</h2>
        <p>Data Protection Officer: <strong>privacy@adriken.com</strong></p>
        <p>Office of the Data Protection Commissioner (Kenya): <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer" className="text-primary">www.odpc.go.ke</a></p>
      </div>
    </div>
    <Footer />
  </div>
);

export default PrivacyPolicy;
