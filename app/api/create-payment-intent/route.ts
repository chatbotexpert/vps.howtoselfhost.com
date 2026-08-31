import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20", // Use the latest API version or your desired one
});

export async function POST(req: Request) {
  try {
    const { amount, orderId, currency = "usd" } = await req.json();

    if (!amount || amount <= 0 || !orderId) {
      return NextResponse.json({ error: "Invalid amount or orderId" }, { status: 400 });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderId,
      },
    });

    // Save the stripe payment intent ID to the order
    await db.order.update({
      where: { id: orderId },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
