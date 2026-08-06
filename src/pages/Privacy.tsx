import { Link } from "react-router-dom";
import { CONTACT_EMAIL } from "../data/products";
import LegalLayout, { LegalSection } from "../components/LegalLayout";

const SECTIONS: LegalSection[] = [
  {
    id: "scope",
    title: "What this policy covers",
    body: (
      <>
        <p>
          This policy explains how VendSource Distribution collects, uses and shares personal data when
          you visit our website, request a quote, place an order, contact our support team, join our
          reseller programme, or operate a machine you purchased from us.
        </p>
        <p>
          It does not cover the practices of businesses we do not control. If you buy a drink from a
          cooler that another operator has installed in their venue, that operator decides what happens
          to the data their machine collects, and their own notice governs it. Likewise, payment
          terminals fitted to our machines are operated by the payment providers who supply them.
        </p>
      </>
    ),
  },
  {
    id: "collect",
    title: "Personal data we collect",
    body: (
      <>
        <p>
          We try to collect only what we actually need. What we hold depends on how you deal with us.
        </p>
        <h3>Data you give us</h3>
        <ul>
          <li>
            <strong>Contact and business details</strong> — name, business name, email address, phone
            number, delivery and billing addresses, and your role at the business.
          </li>
          <li>
            <strong>Order details</strong> — the machines and accessories you buy, quantities, quoted
            pricing, purchase orders and delivery instructions.
          </li>
          <li>
            <strong>Enquiry content</strong> — what you write in a quote request, support ticket or
            email, including any site photographs or floor plans you choose to send us.
          </li>
          <li>
            <strong>Reseller programme details</strong> — the account credentials, referral code and
            payout information we need to track and pay commissions.
          </li>
        </ul>
        <h3>Data we collect automatically</h3>
        <ul>
          <li>
            <strong>Device and usage data</strong> — IP address, browser and operating system, pages
            viewed, referring page and the approximate region your request came from.
          </li>
          <li>
            <strong>Referral attribution</strong> — if you arrive through a reseller's link, we record
            that code so the referral is credited correctly.
          </li>
        </ul>
        <h3>Data from other sources</h3>
        <p>
          Our payment processor confirms whether a transaction succeeded and gives us the last four
          digits and card brand. Shipping carriers give us delivery status. We may verify business
          registration or tax details against public records for trade accounts.
        </p>
        <p>
          <strong>We never receive your full card number.</strong> Card details are entered on our
          payment provider's own hosted page and are not stored on our systems.
        </p>
      </>
    ),
  },
  {
    id: "machine-data",
    title: "Data from the machines themselves",
    body: (
      <>
        <p>
          Our coolers use load-cell shelves and in-cabinet cameras to work out which items a customer
          took, and report inventory and temperature telemetry to the management portal.
        </p>
        <p>
          Where a machine is deployed by an operator who bought it from us, that operator controls this
          data and is responsible for telling customers what the machine does. We process it only on
          their instructions — for example when they ask us to diagnose a fault. If we help with a
          support case, we look at the minimum needed to resolve it.
        </p>
        <p>
          Vision data is used to recognise products, not to identify people. We do not run facial
          recognition, and we do not use machine footage to build profiles of individual shoppers or to
          advertise to them.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use personal data",
    body: (
      <>
        <p>We use personal data to:</p>
        <ul>
          <li>quote, process, invoice and deliver orders, and arrange installation;</li>
          <li>provide warranty service, technical support and spare parts;</li>
          <li>operate the management portal and reseller portal, including logins and commissions;</li>
          <li>
            send service messages about an order, a shipment, a security issue or a change to these
            documents;
          </li>
          <li>
            send marketing about products and volume pricing, where you have asked for it or where we
            are otherwise permitted to — you can opt out at any time;
          </li>
          <li>detect and prevent fraud, abuse and misuse of our systems;</li>
          <li>
            understand which parts of the site are useful, in aggregate, so we can improve them; and
          </li>
          <li>meet our legal, tax and accounting obligations, and enforce our terms.</li>
        </ul>
        <p>
          We do not sell personal data, and we do not share it with third parties for their own
          advertising.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    body: (
      <>
        <p>
          We use a small number of cookies and equivalent browser storage. Some are strictly necessary —
          they keep your cart contents, keep you signed in to a portal, and protect forms against abuse.
          Others help us count visits and measure which pages lead to enquiries.
        </p>
        <p>
          One cookie stores a reseller referral code when you arrive through a partner link, so that a
          later order is attributed correctly.
        </p>
        <p>
          You can clear or block cookies in your browser settings. Strictly necessary cookies cannot be
          switched off without breaking the cart and portal sign-in.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "When we share personal data",
    body: (
      <>
        <p>We share personal data only in these situations:</p>
        <ul>
          <li>
            <strong>Service providers</strong> who work on our behalf — hosting and database providers,
            payment processing, email delivery, freight and installation partners, and accounting
            services. They may use the data only to perform work for us.
          </li>
          <li>
            <strong>Manufacturers</strong>, where a warranty claim or a spare part requires it. We send
            the machine serial number and the fault details, plus a delivery address where a part has to
            ship directly.
          </li>
          <li>
            <strong>Resellers</strong>, limited to confirming that a referral converted and its
            commission value. Resellers do not receive your contact details from us unless you ask us to
            introduce you.
          </li>
          <li>
            <strong>Professional advisers, acquirers and authorities</strong> — where we take legal or
            accounting advice, in connection with a merger or sale of the business, or where we are
            legally required to disclose. We do not hand over data to authorities without a valid legal
            basis, and we tell you where we are permitted to.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep data",
    body: (
      <>
        <p>
          We keep personal data for as long as we need it for the purpose we collected it, then delete
          or anonymise it. In practice:
        </p>
        <ul>
          <li>
            <strong>Order and invoice records</strong> are kept for the period our tax and accounting
            obligations require, which is typically several years after the transaction.
          </li>
          <li>
            <strong>Warranty and support records</strong> are kept for the life of the warranty plus a
            reasonable period afterwards, so a recurring fault can be traced.
          </li>
          <li>
            <strong>Quote requests that do not lead to an order</strong> are deleted or anonymised once
            the enquiry is clearly closed.
          </li>
          <li>
            <strong>Marketing contact details</strong> are removed promptly once you unsubscribe, apart
            from the minimal record needed to honour your opt-out.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <>
        <p>
          Traffic to this site and to both portals is encrypted in transit. Access to customer records is
          restricted to staff who need it for their work, portal accounts are protected by
          per-account credentials, and payment card data never reaches our systems.
        </p>
        <p>
          No system is perfectly secure. If a breach affects your personal data and the law requires it,
          we will notify you and the relevant regulator without undue delay. Please tell us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> if you believe your account has been
          compromised.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights and choices",
    body: (
      <>
        <p>
          Depending on where you live, you may have the right to access the personal data we hold about
          you, correct it, delete it, restrict or object to how we use it, receive a portable copy, and
          withdraw a consent you previously gave. You also have the right not to be discriminated
          against for exercising these rights.
        </p>
        <p>
          To make a request, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We may need
          to verify your identity before acting, and we will respond within the period the applicable
          law allows. Marketing emails can also be stopped using the unsubscribe link in any message.
        </p>
        <p>
          If you are not satisfied with our response, you may complain to your local data protection
          authority.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    body: (
      <p>
        We work with manufacturers, freight partners and technology providers in more than one country,
        so your data may be processed outside the country where you live. Where we transfer personal
        data across borders we use an approved transfer mechanism, such as standard contractual clauses,
        and require recipients to protect the data to the standard described in this policy.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        We sell commercial equipment to businesses. Our site and portals are not directed at children,
        and we do not knowingly collect personal data from anyone under 16. If you believe a child has
        given us personal data, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy as our products and obligations change. When we do, we revise the date
        at the top of this page. If a change materially affects how we use personal data we already
        hold, we will give you additional notice — by email or a notice on the site — before it takes
        effect.
      </p>
    ),
  },
  {
    id: "contact",
    title: "How to contact us",
    body: (
      <>
        <p>
          Questions about this policy, or about the personal data we hold, should go to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You can also reach us through our{" "}
          <Link to="/contact">contact page</Link>.
        </p>
        <p>
          Our <Link to="/terms">Terms of Service</Link> govern purchases and use of our portals, and
          should be read alongside this policy.
        </p>
      </>
    ),
  },
];

export default function Privacy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="How VendSource Distribution collects, uses, shares and protects personal data across our website, orders, support, machine telemetry and reseller programme."
      updated="6 August 2026"
      intro={
        <>
          <p>
            VendSource Distribution supplies smart vending coolers to businesses. Running that business
            means handling some personal data — who ordered a machine, where it ships, who to call when
            a compressor fails. This policy sets out what we collect, why, who we share it with and what
            you can ask us to do about it.
          </p>
          <p>
            We have written it in plain language rather than in the densest form a lawyer could manage.
            Where a term has a specific legal meaning, we mean that meaning.
          </p>
        </>
      }
      sections={SECTIONS}
    />
  );
}
