import { Link } from 'react-router-dom'

function PolicyLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="page-container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Bebas Neue', cursive" }}>{title}</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: January 1, 2026</p>
      <div className="card p-8 prose prose-sm max-w-none text-gray-700 space-y-6">{children}</div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
      <div className="text-gray-600 leading-relaxed">{children}</div>
    </div>
  )
}

export function ShippingPage() {
  return (
    <PolicyLayout title="Shipping Policy">
      <Section title="Free Shipping">
        <p>All orders over ₽5,000 qualify for free standard shipping throughout Russia. Orders below this threshold incur a flat shipping fee of ₽299.</p>
      </Section>
      <Section title="Delivery Timeframes">
        <p><strong>Standard Delivery:</strong> 3-5 business days</p>
        <p><strong>Express Delivery:</strong> 1-2 business days (+₽599)</p>
        <p><strong>Same-Day Delivery (Kursk only):</strong> Order before 12:00 PM (+₽999)</p>
        <p className="mt-2">Remote areas may experience longer delivery times of 7-14 business days.</p>
      </Section>
      <Section title="Order Processing">
        <p>Orders are processed Monday through Saturday. Orders placed on Sunday or public holidays will be processed the next business day. You will receive a confirmation email with tracking information once your order has shipped.</p>
      </Section>
      <Section title="International Shipping">
        <p>Currently, we only ship within Russia. We plan to expand to international shipping in the future.</p>
      </Section>
      <Section title="Damaged or Lost Shipments">
        <p>If your order arrives damaged or is lost in transit, please contact us immediately at support@jdtechstores.ru. We will resolve the issue with a replacement or full refund.</p>
      </Section>
    </PolicyLayout>
  )
}

export function ReturnsPage() {
  return (
    <PolicyLayout title="Returns & Refund Policy">
      <Section title="30-Day Return Window">
        <p>We accept returns within 30 days of purchase for most items. Products must be in their original condition, unused, and in original packaging.</p>
      </Section>
      <Section title="How to Return">
        <p>1. Log into your account and navigate to "My Orders"</p>
        <p>2. Select the item you want to return and click "Initiate Return"</p>
        <p>3. Choose your reason for return and submit</p>
        <p>4. We'll send you a prepaid return label within 24 hours</p>
        <p>5. Pack the item securely and drop it off at any post office</p>
      </Section>
      <Section title="Non-Returnable Items">
        <p>Software (once opened), consumables (printer cartridges, etc.), and custom-ordered items cannot be returned unless defective.</p>
      </Section>
      <Section title="Refund Timeline">
        <p>Once we receive your return, we'll inspect it within 2 business days. Approved refunds are processed within 3-5 business days and will appear in your original payment method within 7-10 banking days.</p>
      </Section>
      <Section title="Defective Products">
        <p>If you receive a defective product, contact us within 7 days for a priority replacement or full refund. We may request photos of the defect.</p>
      </Section>
    </PolicyLayout>
  )
}

export function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy">
      <Section title="Information We Collect">
        <p>We collect information you provide when creating an account, making purchases, or contacting support. This includes name, email address, phone number, delivery address, and payment information (processed securely via our payment provider).</p>
      </Section>
      <Section title="How We Use Your Information">
        <p>Your information is used to process orders, send confirmations and updates, improve our services, personalize your experience, and respond to support requests. We do not sell your personal data to third parties.</p>
      </Section>
      <Section title="Data Security">
        <p>We implement industry-standard security measures including SSL encryption, secure data storage, and regular security audits. Access to your data is restricted to authorized personnel only.</p>
      </Section>
      <Section title="Cookies">
        <p>We use essential cookies for authentication and cart functionality, and optional analytics cookies to understand how you use our site. You can manage cookie preferences in your browser settings.</p>
      </Section>
      <Section title="Your Rights">
        <p>You have the right to access, correct, or delete your personal data. You can also opt out of marketing communications at any time. Contact privacy@jdtechstores.ru for data-related requests.</p>
      </Section>
      <Section title="Contact">
        <p>For privacy concerns: <a href="mailto:privacy@jdtechstores.ru" className="text-primary">privacy@jdtechstores.ru</a></p>
      </Section>
    </PolicyLayout>
  )
}

export function TermsPage() {
  return (
    <PolicyLayout title="Terms & Conditions">
      <Section title="Acceptance of Terms">
        <p>By accessing or using JD TechStores, you agree to these terms and conditions. If you disagree with any part, please discontinue use of our platform.</p>
      </Section>
      <Section title="Account Responsibilities">
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of any unauthorized use.</p>
      </Section>
      <Section title="Product Descriptions">
        <p>We make every effort to ensure product descriptions, images, and prices are accurate. We reserve the right to correct any errors and to refuse or cancel orders where incorrect pricing has been displayed.</p>
      </Section>
      <Section title="Pricing & Payment">
        <p>All prices are in Russian Rubles (₽) and include VAT (18%). We reserve the right to change prices at any time. Payment is due at the time of order placement.</p>
      </Section>
      <Section title="Intellectual Property">
        <p>All content on this website, including text, graphics, logos, and images, is the property of JD TechStores and is protected by applicable intellectual property laws.</p>
      </Section>
      <Section title="Limitation of Liability">
        <p>JD TechStores shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform or products purchased through it.</p>
      </Section>
      <Section title="Governing Law">
        <p>These terms are governed by the laws of the Russian Federation. Any disputes shall be resolved in the courts of Kursk, Russia.</p>
      </Section>
      <Section title="Contact">
        <p>Questions about these terms: <a href="mailto:legal@jdtechstores.ru" className="text-primary">legal@jdtechstores.ru</a></p>
      </Section>
    </PolicyLayout>
  )
}
