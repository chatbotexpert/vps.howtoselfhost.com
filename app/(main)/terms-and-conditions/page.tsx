import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function TermsAndConditions() {
  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="April 2026">
      <p>
        These terms and conditions outline the rules and regulations for the use of howtoselfhost.com's Website and Hosting Services.
      </p>
      <h2>1. Introduction</h2>
      <p>
        By accessing this website and utilizing our VPS hosting services, we assume you accept these terms and conditions. Do not continue to use howtoselfhost.com if you do not agree to take all of the terms and conditions stated on this page.
      </p>
      <h2>2. Acceptable Use Policy (AUP)</h2>
      <p>
        You must not use our servers for any disruptive or illegal activities, including but not limited to:
      </p>
      <ul>
        <li>Sending unsolicited bulk email (SPAM).</li>
        <li>Hosting malicious software, viruses, or worms.</li>
        <li>Launching DDoS attacks.</li>
        <li>Hosting illegal content or content that infringes upon copyright laws.</li>
      </ul>
      <p>
        We reserve the right to suspend or terminate services immediately for violations of this Acceptable Use Policy.
      </p>
      <h2>3. Billing and Subscriptions</h2>
      <p>
        Our services are billed on a prepaid basis. If you fail to pay your invoice by the due date, your server may be suspended. Data will be retained for up to 7 days post-suspension before permanent deletion unless otherwise stated.
      </p>
    </LegalPageLayout>
  );
}
