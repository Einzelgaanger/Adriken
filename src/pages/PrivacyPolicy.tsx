import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LegalPageLayout, legalSectionVariants } from "@/components/LegalPageLayout";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <LegalPageLayout title="Privacy Policy" lastUpdated="March 11, 2026">
      <motion.section variants={legalSectionVariants}>
        <h2>1. Introduction</h2>
        <p>
          Adriken ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, disclose, and safeguard your personal data when you use our website, mobile applications, and related services (collectively, the "Platform"). We comply with the <strong>Kenya Data Protection Act 2019 (DPA)</strong>, its regulations, and the <strong>EU General Data Protection Regulation (GDPR)</strong> where applicable. By using the Platform, you consent to the practices described in this policy. If you do not agree, please do not use our services.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>2. Definitions</h2>
        <ul>
          <li><strong>Personal Data</strong> means any information relating to an identified or identifiable natural person.</li>
          <li><strong>Processing</strong> means any operation performed on personal data (e.g. collection, storage, use, disclosure).</li>
          <li><strong>Data Subject</strong> means you, the individual to whom the personal data relates.</li>
          <li><strong>Data Controller</strong> means Adriken, which determines the purposes and means of processing.</li>
          <li><strong>Data Processor</strong> means a third party that processes personal data on our behalf.</li>
        </ul>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>3. Data Controller & Contact</h2>
        <p>
          Adriken is the data controller for personal data processed through the Platform. For any privacy-related requests, complaints, or questions, contact our Data Protection Officer at <strong>privacy@adriken.com</strong>. We aim to respond within 30 days. You may also lodge a complaint with the Office of the Data Protection Commissioner (Kenya): <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer">www.odpc.go.ke</a>. EU residents may contact their local supervisory authority.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>4. Data We Collect</h2>
        <h3>4.1 Account & Registration Data</h3>
        <ul>
          <li>Name, email address, and password (stored in hashed form).</li>
          <li>Account creation date and authentication identifiers.</li>
        </ul>
        <h3>4.2 Profile Data (Optional)</h3>
        <ul>
          <li>Phone number, WhatsApp number, social media handles.</li>
          <li>Profile photo (avatar), bio, skills, certifications, portfolio images or videos.</li>
          <li>Business name, service categories, pricing, availability, and service area (e.g. city, neighbourhood).</li>
        </ul>
        <h3>4.3 Location Data</h3>
        <ul>
          <li>Approximate location (e.g. city or region) when you set your service area or search.</li>
          <li>Precise or live location only when you explicitly enable it (e.g. "show my location to others") and grant permission in your device or browser. You may withdraw this at any time.</li>
        </ul>
        <h3>4.4 Listing & Transactional Data</h3>
        <ul>
          <li>Listings you create: titles, descriptions, media, pricing, availability.</li>
          <li>Messages, enquiries, or bookings made through the Platform (where applicable).</li>
        </ul>
        <h3>4.5 Usage & Technical Data</h3>
        <ul>
          <li>Pages visited, search queries, clicks, time spent, and referral sources.</li>
          <li>Device type, browser type, IP address, operating system, and unique device or advertising identifiers where relevant for security or analytics (with consent where required).</li>
        </ul>
        <h3>4.6 Cookies & Similar Technologies</h3>
        <p>
          We use essential cookies for authentication, session management, and security. We may use analytics or functional cookies only with your consent, which you can manage via our cookie banner or browser settings. See Section 12 for more detail.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>5. Legal Basis for Processing</h2>
        <p>We process personal data only where we have a valid legal basis:</p>
        <ul>
          <li><strong>Consent:</strong> For optional profile data, precise/live location, marketing communications, and non-essential cookies. You may withdraw consent at any time without affecting the lawfulness of processing before withdrawal.</li>
          <li><strong>Contract:</strong> To create and manage your account, provide search and matching services, display your profile to other users (as per your settings), and communicate about the service.</li>
          <li><strong>Legitimate interests:</strong> To improve the Platform, run analytics (in anonymised or pseudonymised form where possible), prevent fraud and abuse, ensure security, and enforce our terms, where our interests are not overridden by your rights.</li>
          <li><strong>Legal obligation:</strong> To comply with applicable laws (e.g. tax, anti-money laundering, responding to lawful requests from authorities).</li>
        </ul>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>6. How We Use Your Data</h2>
        <ul>
          <li>To provide, maintain, and improve the Platform (search, matching, discovery of services, goods, and people).</li>
          <li>To use AI and algorithms to rank and personalise results (e.g. by location, relevance, and your preferences).</li>
          <li>To display your profile and contact details to other users only to the extent you have chosen to make them visible.</li>
          <li>To send transactional communications (e.g. password reset, account verification, booking or enquiry notifications).</li>
          <li>To send marketing communications only with your consent; you can opt out at any time.</li>
          <li>To detect, prevent, and address fraud, abuse, and security issues.</li>
          <li>To comply with legal obligations and protect our and others' rights.</li>
        </ul>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>7. Data Sharing & Recipients</h2>
        <p>We do not sell your personal data. We may share data only in the following circumstances:</p>
        <ul>
          <li><strong>Other users:</strong> Profile and listing information you choose to make public (e.g. name, photo, bio, services, contact details) is visible to other users as per your settings.</li>
          <li><strong>Service providers (processors):</strong> We use trusted providers for hosting, databases, analytics, email delivery, and AI processing. They act on our instructions and are bound by data protection agreements.</li>
          <li><strong>Legal & regulatory:</strong> We may disclose data when required by law, court order, or government request, or to protect the rights, property, or safety of Adriken, our users, or the public.</li>
          <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction, subject to this policy.</li>
        </ul>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>8. Data Retention</h2>
        <p>
          We retain your personal data only for as long as necessary to fulfil the purposes set out in this policy. Account and profile data are retained while your account is active. If you delete your account, we will delete or anonymise your personal data within 30 days, except where we are required to retain it by law (e.g. tax, legal claims) or for legitimate purposes (e.g. fraud prevention) for a limited further period. Aggregated or anonymised data may be retained indefinitely.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>9. Your Rights</h2>
        <p>Under the Kenya DPA and the GDPR (where applicable), you have the right to:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong>Erasure:</strong> Request deletion of your data, subject to legal exceptions.</li>
          <li><strong>Restriction:</strong> Request that we limit processing in certain circumstances.</li>
          <li><strong>Data portability:</strong> Receive your data in a structured, machine-readable format and, where feasible, have it transmitted to another controller.</li>
          <li><strong>Object:</strong> Object to processing based on legitimate interests or for direct marketing.</li>
          <li><strong>Withdraw consent:</strong> Where processing is based on consent, withdraw it at any time.</li>
        </ul>
        <p>
          To exercise any of these rights, email <strong>privacy@adriken.com</strong>. We will respond within the timeframe required by applicable law (e.g. 30 days under the Kenya DPA). You also have the right to lodge a complaint with a supervisory authority.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>10. Data Security</h2>
        <p>
          We implement appropriate technical and organisational measures to protect your personal data, including: encryption in transit (TLS/SSL), encryption at rest where applicable, secure authentication (e.g. secure password hashing), access controls and role-based permissions, and row-level security where relevant. We regularly review and update our security practices and require our processors to maintain similar standards. Despite our efforts, no system can be fully secure; you are responsible for keeping your login credentials safe.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>11. International Transfers</h2>
        <p>
          Your data may be processed in or transferred to countries outside Kenya or the European Economic Area (EEA). Where we do so, we ensure appropriate safeguards are in place as required by the Kenya DPA and the GDPR, such as standard contractual clauses, adequacy decisions, or your explicit consent. You may request details of the safeguards we use by contacting <strong>privacy@adriken.com</strong>.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>12. Cookies & Similar Technologies</h2>
        <p>
          We use essential cookies (and similar technologies) necessary for the operation of the Platform, including session management and authentication. These do not require consent. We may use analytics or functional cookies only with your consent, which you can give or withdraw via our cookie banner or your browser settings. You can also block or delete cookies via your browser; note that blocking essential cookies may affect the functionality of the Platform. For more information, see our cookie notice or contact us.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>13. Children</h2>
        <p>
          The Platform is not intended for individuals under 18 years of age. We do not knowingly collect personal data from minors. If you become aware that a child has provided us with personal data, please contact us at <strong>privacy@adriken.com</strong> and we will take steps to delete such information.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>14. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices, the law, or the Platform. We will post the updated policy on this page and update the "Last updated" date. Material changes will be communicated by email or a prominent notice on the Platform where appropriate. Your continued use of the Platform after the effective date of changes constitutes acceptance of the updated policy. We encourage you to review this policy periodically.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>15. Contact</h2>
        <p>
          Data Protection Officer / Privacy enquiries: <strong>privacy@adriken.com</strong>. For general support, use the contact options available on the Platform. Office of the Data Protection Commissioner (Kenya): <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer">www.odpc.go.ke</a>.
        </p>
      </motion.section>
    </LegalPageLayout>
    <Footer />
  </div>
);

export default PrivacyPolicy;
