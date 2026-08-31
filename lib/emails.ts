import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");
// For testing without a verified domain, use Resend's default "onboarding@resend.dev"
// Ensure you only send emails to the address you verified your Resend account with.
const FROM_EMAIL = "onboarding@resend.dev"; 

export async function sendWelcomeEmail(to: string, password: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Welcome to HowToSelfHost - Your Account Credentials",
      html: `
        <h1>Welcome to HowToSelfHost!</h1>
        <p>Your account has been successfully created.</p>
        <p>Here are your temporary login details to access the Customer Dashboard:</p>
        <ul>
          <li><strong>Email:</strong> ${to}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>Please log in and change your password as soon as possible.</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

export async function sendOrderConfirmationEmail(to: string, orderDetails: any) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Order Confirmation - HowToSelfHost",
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order has been received and payment is successful.</p>
        <p>We are now provisioning your VPS server. This usually takes a few minutes.</p>
        <p>We will send you another email with your server IP and credentials once it is ready.</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
}

export async function sendServerReadyEmail(to: string, ip: string, sshUser: string, sshPassword?: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Your Server is Ready - HowToSelfHost",
      html: `
        <h1>Your VPS is provisioned and ready!</h1>
        <p>Here are your server connection details:</p>
        <ul>
          <li><strong>IP Address:</strong> ${ip}</li>
          <li><strong>SSH User:</strong> ${sshUser}</li>
          ${sshPassword ? `<li><strong>SSH Password:</strong> ${sshPassword}</li>` : ""}
        </ul>
        <p>You can also manage your server from the Customer Dashboard.</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send server ready email:", error);
  }
}
