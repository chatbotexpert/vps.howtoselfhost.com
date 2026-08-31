import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed.", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    // Find the order that has this payment intent
    const order = await db.order.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id },
      include: { vpsInstance: true, user: true },
    });

    if (order) {
      // Mark the order as paid
      await db.order.update({
        where: { id: order.id },
        data: { status: "paid" },
      });
      
      console.log(`Order ${order.id} paid successfully! PaymentIntent: ${paymentIntent.id}`);

      // Trigger Contabo Provisioning
      try {
        const { createContaboInstance } = await import("@/lib/contabo");
        const contaboResponse = await createContaboInstance({
          imageId: "placeholder_image_id", // We'll need a mapping in production
          productId: "placeholder_product_id", 
          regionId: "placeholder_region_id",
          rootPassword: order.vpsInstance?.sshPassword || "DefaultRootPass!123",
        });

        if (order.vpsInstance) {
          await db.vpsInstance.update({
            where: { id: order.vpsInstance.id },
            data: { contaboId: contaboResponse.instanceId },
          });
        }
      } catch (err) {
        console.error("Failed to provision Contabo instance for order", order.id, err);
      }

      // Send Order Confirmation Email
      try {
        const { sendOrderConfirmationEmail } = await import("@/lib/emails");
        if (order.user.email) {
          await sendOrderConfirmationEmail(order.user.email, order);
        }
      } catch (err) {
        console.error("Failed to send order confirmation email", err);
      }
      
    } else {
      console.error(`Order not found for PaymentIntent ${paymentIntent.id}`);
    }
  }

  return new NextResponse("Webhook received", { status: 200 });
}
