import { Link } from "react-router-dom";
import { CONTACT_EMAIL } from "../data/products";
import LegalLayout, { LegalSection } from "../components/LegalLayout";

const SECTIONS: LegalSection[] = [
  {
    id: "agreement",
    title: "This agreement",
    body: (
      <>
        <p>
          These Terms of Service are an agreement between you and VendSource Distribution ("VendSource",
          "we", "us") covering our website, the quotes and orders you place with us, the equipment we
          supply, the management and reseller portals, and the support we provide.
        </p>
        <p>
          By placing an order, creating a portal account or otherwise using our services, you agree to
          these terms. If you are agreeing on behalf of a company, you confirm you are authorised to bind
          it, and "you" means that company.
        </p>
        <p>
          Our <Link to="/privacy">Privacy Policy</Link> explains how we handle personal data and forms
          part of this agreement.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility and accounts",
    body: (
      <>
        <p>
          We sell commercial refrigeration and vending equipment to businesses. You must be at least 18
          and able to enter a binding contract. We may decline or cancel an order, or limit quantities,
          at our discretion — including where we cannot verify the business details given.
        </p>
        <p>
          You are responsible for the accuracy of the information in your account and for everything
          done under your credentials. Keep them confidential, and tell us promptly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> if you suspect unauthorised access.
        </p>
      </>
    ),
  },
  {
    id: "orders",
    title: "Quotes, orders and pricing",
    body: (
      <>
        <p>
          A quote is an invitation to order, not an offer we are bound by. Unless it says otherwise, a
          quote is valid for 30 days. A contract forms only when we accept your order and confirm it in
          writing.
        </p>
        <p>
          Prices are quoted per unit in the currency shown and exclude taxes, duties, freight,
          installation, and any site works, unless expressly stated. Volume and bulk pricing applies only
          on the terms of the specific quote it appears on.
        </p>
        <p>
          Listings, photographs, 3D renders and specifications are provided to help you choose. We work
          to keep them accurate, but manufacturers revise components and finishes, and colours vary
          between screens. Minor variations are not a defect. Where a specification is material to your
          decision, confirm it with us in writing before ordering.
        </p>
        <p>
          <strong>Pricing errors.</strong> If an item is listed at an obviously incorrect price, we may
          cancel the order even after confirmation, and will refund anything you have paid.
        </p>
      </>
    ),
  },
  {
    id: "payment",
    title: "Payment",
    body: (
      <>
        <p>
          Payment is due as set out on the invoice or quote. Card payments are handled by our payment
          provider on its own hosted page; we do not receive or store your full card number. For
          approved trade accounts, invoices are payable within the agreed terms.
        </p>
        <p>
          Overdue amounts may attract interest at the rate permitted by law, and we may suspend
          deliveries, portal access or support while an account is in arrears. You are responsible for
          reasonable costs of recovering an undisputed overdue amount.
        </p>
        <p>
          We remain the owner of the goods until we have received payment in full, even where risk has
          already passed to you.
        </p>
      </>
    ),
  },
  {
    id: "delivery",
    title: "Delivery, risk and inspection",
    body: (
      <>
        <p>
          Delivery dates are estimates. These are heavy, containerised goods and lead times move with
          manufacturing and freight schedules. We are not liable for delay caused by events outside our
          reasonable control, but we will keep you informed and, where a delay becomes unreasonable, you
          may cancel the undelivered part of the order for a refund.
        </p>
        <p>
          Risk of loss or damage passes to you on delivery to the address you gave us. You must ensure
          the site is accessible for a freight vehicle and that someone authorised is present to receive
          and sign for the goods.
        </p>
        <p>
          <strong>Inspect on arrival.</strong> Note any visible damage on the carrier's paperwork,
          photograph it, and tell us within 3 business days of delivery. Concealed damage must be
          reported within 7 days. Claims made later are very difficult to pursue with carriers and may be
          refused.
        </p>
      </>
    ),
  },
  {
    id: "installation",
    title: "Site requirements and installation",
    body: (
      <>
        <p>
          Unless installation is expressly included in your order, you are responsible for siting,
          levelling, powering and connecting the machine. You must provide a suitable dedicated power
          supply, adequate ventilation clearance, a level load-bearing floor, and a stable network
          connection for telemetry and payment features to work.
        </p>
        <p>
          You are responsible for compliance with local rules that apply to your deployment — planning
          and premises permissions, electrical and food-safety requirements, accessibility, and any
          signage or notices required where a machine records images or processes payments in your venue.
        </p>
      </>
    ),
  },
  {
    id: "returns",
    title: "Cancellations, returns and refunds",
    body: (
      <>
        <p>
          You may cancel an order at no cost before it is dispatched or, for made-to-order and
          custom-branded units, before production begins. After that, cancellation may attract charges
          for costs already incurred.
        </p>
        <p>
          Because this is commercial equipment, we do not offer change-of-mind returns as a matter of
          course. Where we agree to accept one, the unit must be unused, in its original packaging and
          returned at your cost, and a restocking fee may apply.
        </p>
        <p>
          None of this limits your rights in respect of goods that are faulty, not as described, or
          otherwise not of the quality the law requires.
        </p>
      </>
    ),
  },
  {
    id: "warranty",
    title: "Warranty",
    body: (
      <>
        <p>
          Machines are covered by the manufacturer-backed warranty stated on the product page and your
          invoice, running from the delivery date. It covers defects in materials and workmanship in
          normal commercial use, and is fulfilled at our option by repair, replacement parts, or
          replacement of the unit.
        </p>
        <p>The warranty does not cover:</p>
        <ul>
          <li>consumable and wear items, cosmetic marks, and normal deterioration in service;</li>
          <li>
            damage from accident, misuse, vandalism, liquid ingress, pests, power surges, or an unsuitable
            power supply or environment;
          </li>
          <li>
            faults caused by unauthorised repair or modification, or by installation that ignored the
            site requirements above;
          </li>
          <li>
            problems arising from your network, from third-party payment terminals, or from software we
            did not supply.
          </li>
        </ul>
        <p>
          To make a claim, contact us with the serial number and a description of the fault. We may ask
          for photographs, portal telemetry or diagnostic access before dispatching parts or a
          technician.
        </p>
      </>
    ),
  },
  {
    id: "software",
    title: "Software and portal licence",
    body: (
      <>
        <p>
          Software embedded in the machines and access to the management portal are licensed, not sold. We
          grant you a non-exclusive, non-transferable licence to use them to operate the machines you
          have bought from us, for as long as this agreement is in force.
        </p>
        <p>
          You may not copy, reverse-engineer, decompile, resell or sublicense the software, remove or
          obscure proprietary notices, use it to operate equipment you did not buy from us, or attempt to
          access parts of the portal that are not yours.
        </p>
        <p>
          We may update software and portal features, including to address security issues. Some updates
          are necessary for continued safe operation and may be applied automatically. We may change or
          discontinue non-essential portal features with reasonable notice.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>When using our site, portals or support channels, you agree not to:</p>
        <ul>
          <li>break the law, infringe anyone's rights, or misrepresent who you are;</li>
          <li>
            probe, scan, overload or interfere with our systems, or try to gain unauthorised access to
            any account or data;
          </li>
          <li>scrape or bulk-extract content, pricing or portal data by automated means;</li>
          <li>upload malicious code, or content that is unlawful or abusive.</li>
        </ul>
        <p>
          We may suspend or terminate access for a breach of this section, and where the breach is
          serious we may do so without prior notice.
        </p>
      </>
    ),
  },
  {
    id: "reseller",
    title: "Reseller and referral programme",
    body: (
      <>
        <p>
          If we approve you as a reseller, you receive a referral code and access to the reseller portal.
          Commission is earned on qualifying orders that complete and are paid for in full, at the rate
          and on the terms set out when you join.
        </p>
        <p>
          Commission is reversed on any order that is cancelled, refunded, charged back, or found to have
          been attributed by fraudulent or misleading means. Self-referrals do not qualify.
        </p>
        <p>
          You must describe our products accurately, must not make performance, revenue or warranty
          promises we have not published, and must not bid on our brand names in paid search or present
          yourself as VendSource. Either of us may end participation at any time; commission properly
          earned before termination remains payable.
        </p>
      </>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party services",
    body: (
      <p>
        Payment terminals, network connectivity and some integrations are provided by third parties under
        their own terms. We are not responsible for those services, their availability, their fees, or
        their handling of data. Choosing a payment provider and complying with its rules — including card
        scheme requirements — is your responsibility as the operator.
      </p>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: (
      <p>
        The site, our name and logo, product photography, renders, copy and portal software are owned by
        us or our licensors and are protected by intellectual property laws. You may use our product
        images and descriptions to resell machines you bought from us; otherwise, nothing here transfers
        any ownership or grants any licence to our brand.
      </p>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    body: (
      <>
        <p>
          Except for the warranty above and any rights you have under law that cannot be excluded, our
          services and the software are provided "as is". We do not warrant that the site or portals will
          be uninterrupted or error-free, that telemetry will be complete, or that AI recognition and
          weight sensing will be accurate in every transaction.
        </p>
        <p>
          <strong>We make no representation about the commercial results of operating a machine.</strong>{" "}
          Any revenue, footfall, shrinkage or payback figure we discuss is illustrative, depends entirely
          on your site and pricing, and is not a forecast or guarantee.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <>
        <p>
          To the extent permitted by law, neither party is liable for indirect or consequential loss, or
          for lost profits, lost revenue, lost sales, spoiled or lost stock, business interruption, or
          loss of data, however caused.
        </p>
        <p>
          Our total liability arising out of or relating to this agreement is limited to the amount you
          paid us for the equipment or service that the claim relates to.
        </p>
        <p>
          Nothing in this agreement excludes or limits liability that cannot lawfully be excluded —
          including for death or personal injury caused by negligence, or for fraud.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    body: (
      <p>
        You agree to indemnify us against claims, losses and reasonable costs arising from your breach of
        this agreement, from your operation of a machine in your venue, or from your failure to meet the
        legal and notice obligations that apply to you as the operator.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    body: (
      <>
        <p>
          This agreement is governed by the laws of the jurisdiction in which VendSource Distribution is
          established, and the courts of that jurisdiction have exclusive jurisdiction, without affecting
          any mandatory protection available to you where you live.
        </p>
        <p>
          Before starting proceedings, please contact us so we can try to resolve the matter directly —
          most disputes are settled quickly once the right person sees them.
        </p>
      </>
    ),
  },
  {
    id: "general",
    title: "Changes and general terms",
    body: (
      <>
        <p>
          We may update these terms as our products and obligations change; the date at the top of this
          page shows when. Changes are not retroactive and do not alter the terms of an order we have
          already confirmed. Continuing to use our services after a change means you accept the updated
          terms.
        </p>
        <p>
          If a provision is found unenforceable, the rest continues in force. A delay in enforcing a right
          is not a waiver of it. You may not assign this agreement without our written consent; we may
          assign it in connection with a merger or sale of the business. Together with your order
          confirmation and our Privacy Policy, these terms are the entire agreement between us.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about these terms can go to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or
        through our <Link to="/contact">contact page</Link>.
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <LegalLayout
      title="Terms of Service"
      description="The terms governing quotes, orders, delivery, warranty, portal software and the reseller programme at VendSource Distribution."
      updated="6 August 2026"
      intro={
        <>
          <p>
            These terms cover buying and operating equipment supplied by VendSource Distribution, and
            using our website and portals. They are written to be read, so please do read them — in
            particular the sections on delivery inspection, warranty, and limitation of liability, which
            affect what you can claim and by when.
          </p>
          <p>
            If anything here conflicts with a signed supply agreement between us, that agreement wins for
            the matters it covers.
          </p>
        </>
      }
      sections={SECTIONS}
    />
  );
}
