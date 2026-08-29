import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function RefundPolicy() {
  return (
    <LegalPageLayout title="Refund Policy" lastUpdated="April 2026">
      <p>
        Thank you for choosing howtoselfhost.com. We want to ensure that you have a rewarding experience while exploring, evaluating, and purchasing our VPS hosting solutions.
      </p>
      <h2>1. The 14-Day Guarantee</h2>
      <p>
        If you are not entirely satisfied with your purchase, we&apos;re here to help. You have exactly 14 calendar days to return a service from the date you received it.
      </p>
      <p>
        To be eligible for a return/refund:
      </p>
      <ul>
        <li>You must submit a formal ticket from the client dashboard.</li>
        <li>The VPS must not have been used for mass mailing, DDoS, or suspended due to AUP violations within that period.</li>
        <li>Custom solutions, setup fees, or domain name registrations are strictly non-refundable.</li>
      </ul>
      <h2>2. Refund Processing</h2>
      <p>
        Once we receive your refund request, our team will inspect your server logs to ensure no AUP violations occurred. We will immediately notify you on the status of your refund. If your return is approved, we will initiate a refund to your credit card (or original method of payment). You will receive the credit within a certain amount of days, depending on your card issuer's policies.
      </p>
    </LegalPageLayout>
  );
}
