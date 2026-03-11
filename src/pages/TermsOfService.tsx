import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LegalPageLayout, legalSectionVariants } from "@/components/LegalPageLayout";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <LegalPageLayout title="Terms of Service" lastUpdated="March 11, 2026">
      <motion.section variants={legalSectionVariants}>
        <h2>1. Definitions & Interpretation</h2>
        <ul>
          <li><strong>"Platform"</strong> means the Adriken website, applications, and all related services.</li>
          <li><strong>"User"</strong> means any person who accesses or uses the Platform (whether registered or not).</li>
          <li><strong>"Content"</strong> means any text, images, videos, listings, reviews, or other materials posted on the Platform.</li>
          <li><strong>"Services"</strong> means the marketplace, search, matching, and connection services provided by Adriken.</li>
        </ul>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>2. Acceptance of Terms</h2>
        <p>
          By accessing or using Adriken, you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms or the Privacy Policy, you must not use the Platform. We may update these Terms from time to time; your continued use after changes constitutes acceptance of the revised Terms. We will notify you of material changes via email or a prominent notice on the Platform.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>3. Eligibility</h2>
        <p>
          You must be at least 18 years of age and have the legal capacity to enter into a binding contract under the laws of your country (including Kenya) to use the Platform. By using the Platform, you represent and warrant that you meet these requirements. If you are using the Platform on behalf of a business, you represent that you have authority to bind that entity to these Terms. We reserve the right to suspend or terminate accounts that we reasonably believe do not meet these eligibility requirements.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>4. Account Registration & Security</h2>
        <p>
          You may need to create an account to access certain features. You agree to:
        </p>
        <ul>
          <li>Provide accurate, current, and complete information during registration and keep it updated.</li>
          <li>Maintain the security and confidentiality of your password and account; you are responsible for all activities under your account.</li>
          <li>Notify us promptly of any unauthorised access or breach of security.</li>
          <li>Not create multiple accounts for abusive or fraudulent purposes, or transfer or sell your account to another person without our consent.</li>
        </ul>
        <p>
          We may require you to verify your identity or contact details. We reserve the right to refuse registration, suspend, or terminate accounts that violate these Terms or that we deem harmful to the Platform or other users.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>5. Use of the Platform</h2>
        <p>
          You may use the Platform only for lawful purposes and in accordance with these Terms. You must not use the Platform in any way that violates applicable laws, infringes the rights of others, or is harmful, fraudulent, or misleading. You are responsible for your conduct and any Content you submit. We grant you a limited, non-exclusive, non-transferable, revocable licence to access and use the Platform for personal or internal business use, subject to these Terms.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>6. Content You Post & Licence</h2>
        <p>
          You retain ownership of Content you post (e.g. listings, photos, videos, descriptions). By posting Content, you grant Adriken a worldwide, non-exclusive, royalty-free, sublicensable, and transferable licence to use, reproduce, distribute, display, and create derivative works of that Content in connection with operating, promoting, and improving the Platform (including in marketing and on other channels). This licence continues for a reasonable period after you remove Content to allow us to fulfil our legal and operational obligations. You represent and warrant that you own or have the necessary rights to post the Content and to grant this licence, and that your Content does not infringe any third-party rights or violate any law.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>7. Content Standards & Moderation</h2>
        <p>
          You must not post Content that:
        </p>
        <ul>
          <li>Is illegal, harmful, threatening, abusive, harassing, defamatory, obscene, or otherwise objectionable.</li>
          <li>Promotes discrimination, violence, or illegal activity.</li>
          <li>Infringes intellectual property, privacy, or other rights of any person.</li>
          <li>Is false, misleading, or fraudulent (e.g. fake credentials, fake reviews).</li>
          <li>Contains malware, spam, or unauthorised advertising.</li>
        </ul>
        <p>
          We may remove, edit, or refuse to display Content that we reasonably believe violates these Terms or our policies, or that is harmful to the Platform or users. We are not obligated to monitor all Content but may do so. Repeat violations may result in suspension or termination of your account.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>8. Transactions Between Users</h2>
        <p>
          Adriken is a platform that connects people seeking services, goods, places, or connections with providers and other users. We do not employ, endorse, or guarantee any user or listing. Any agreement, transaction, or contract is solely between users. We are not a party to any such transaction and are not responsible for the quality, safety, legality, or delivery of any services or goods, or for the conduct of any user. You use the Platform and interact with other users at your own risk. You are responsible for your own due diligence, negotiations, payments (where applicable), and compliance with applicable laws (e.g. tax, consumer protection).
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>9. Prohibited Activities</h2>
        <p>You must not:</p>
        <ul>
          <li>Harass, bully, discriminate against, or abuse other users or our staff.</li>
          <li>Post false certifications, credentials, or reviews, or impersonate any person or entity.</li>
          <li>Scrape, crawl, or use automated means to access the Platform without our prior written consent.</li>
          <li>Attempt to circumvent security measures, access other users' accounts, or interfere with the Platform's operation.</li>
          <li>Use the Platform for money laundering, fraud, or any illegal purpose.</li>
          <li>Resell or commercially exploit the Platform or data derived from it without our permission.</li>
          <li>Use the Platform to send unsolicited commercial messages or spam.</li>
        </ul>
        <p>
          We may take any action we deem appropriate in response to prohibited activities, including removing Content, suspending or terminating accounts, and reporting to authorities.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>10. Fees & Payments</h2>
        <p>
          Currently, use of the Platform may be free for basic features. We may introduce fees for certain features or subscriptions in the future. If we do, we will notify you in advance and you may choose whether to use paid features. Any fees will be displayed before you commit. Refund policies (if any) will be stated at the point of purchase or in separate payment terms.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>11. Intellectual Property</h2>
        <p>
          The Adriken name, logo, design, and all content and technology we provide (other than Content you post) are owned by or licensed to Adriken and are protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works of our brand or platform without our prior written permission. You may not use our trademarks in a way that suggests endorsement or affiliation unless we agree in writing.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>12. Disclaimer of Warranties</h2>
        <p>
          THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS. WE DISCLAIM ALL LIABILITY FOR THE ACTIONS OF USERS AND FOR THE QUALITY OF ANY SERVICES OR GOODS OBTAINED THROUGH THE PLATFORM. YOUR USE OF THE PLATFORM IS AT YOUR SOLE RISK.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>13. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW (INCLUDING THE LAWS OF KENYA), ADRIKEN AND ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE PLATFORM OR THESE TERMS, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY. OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE PLATFORM SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS BEFORE THE CLAIM, OR (B) ONE HUNDRED US DOLLARS (USD 100). SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES; IN SUCH CASES, THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU TO THAT EXTENT.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>14. Indemnity</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Adriken and its affiliates, officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising out of or related to (a) your use of the Platform, (b) your Content or conduct, (c) your violation of these Terms or any law, or (d) any dispute between you and another user. We reserve the right to assume the exclusive defence and control of any matter subject to indemnification by you, at your expense.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>15. Termination</h2>
        <p>
          We may suspend or terminate your account or access to the Platform at any time, with or without notice, for any reason, including if we believe you have violated these Terms or our policies. You may delete your account at any time through your account settings or by contacting us. Upon termination, your right to use the Platform ceases immediately. Provisions that by their nature should survive (including disclaimers, limitation of liability, indemnity, and governing law) will survive termination.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>16. Governing Law & Dispute Resolution</h2>
        <p>
          These Terms are governed by the laws of the Republic of Kenya, without regard to its conflict-of-laws principles. Any dispute arising out of or relating to these Terms or the Platform shall first be attempted to be resolved by good-faith negotiation. If that fails, the dispute shall be resolved by binding arbitration in Nairobi, Kenya, in accordance with the Arbitration Act (Cap 49) or such rules as we agree. The language of the arbitration shall be English. You waive any right to participate in a class action or representative proceeding. Nothing in this section prevents either party from seeking injunctive or other equitable relief in any court of competent jurisdiction.
        </p>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>17. General</h2>
        <ul>
          <li><strong>Entire agreement:</strong> These Terms, together with the Privacy Policy and any other policies we publish, constitute the entire agreement between you and Adriken regarding the Platform.</li>
          <li><strong>Severability:</strong> If any provision is held invalid or unenforceable, the remaining provisions remain in effect.</li>
          <li><strong>Waiver:</strong> Our failure to enforce any right or provision does not waive that right or provision.</li>
          <li><strong>Assignment:</strong> You may not assign these Terms without our consent; we may assign our rights and obligations without restriction.</li>
        </ul>
      </motion.section>

      <motion.section variants={legalSectionVariants}>
        <h2>18. Contact</h2>
        <p>
          For questions about these Terms, contact us at <strong>legal@adriken.com</strong>. For general support, use the contact options available on the Platform.
        </p>
      </motion.section>
    </LegalPageLayout>
    <Footer />
  </div>
);

export default TermsOfService;
