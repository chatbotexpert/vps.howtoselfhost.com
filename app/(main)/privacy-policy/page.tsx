import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="April 2026">
      <p>
        At howtoselfhost.com, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by us and how we use it.
      </p>
      <h2>1. Information We Collect</h2>
      <p>
        We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we are collecting it and how it will be used:
      </p>
      <ul>
        <li><strong>Account Information:</strong> Name, Email, Address, and payment details for invoicing.</li>
        <li><strong>Service Usage Data:</strong> Logs related to server metrics (CPU/RAM usage graphs) necessary for the operation of the customer panel.</li>
      </ul>
      <h2>2. Data Retention and Security</h2>
      <p>
        We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we will protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
      </p>
      <h2>3. Third-Party Access</h2>
      <p>
        We don't share any personally identifying information publicly or with third-parties, except when required to by law. 
      </p>
    </LegalPageLayout>
  );
}
