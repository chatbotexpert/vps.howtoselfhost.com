"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface StripeCheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onBack: () => void;
}

export default function StripeCheckoutForm({
  amount,
  onSuccess,
  onBack,
}: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // We handle redirection manually or rely on Stripe's default if needed
      },
      redirect: "if_required", // Prevent automatic redirect so we can move to step 4
    });

    if (error) {
      setErrorMessage(error.message ?? "An unknown error occurred.");
      setIsProcessing(false);
    } else {
      // Payment succeeded!
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-divider rounded-lg p-8 max-w-3xl mx-auto">
      <PaymentElement className="mb-6" />
      
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}

      <div className="mt-8 flex justify-between items-end">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="text-[13px] font-medium text-muted hover:text-foreground disabled:opacity-50"
        >
          &larr; Back
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="bg-accent hover:opacity-90 text-white dark:text-background px-8 py-3 rounded-xl font-mono uppercase font-bold shadow-md shadow-accent/20 transition-all duration-300 disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
}
