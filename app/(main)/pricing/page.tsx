import { PricingRow } from "@/components/PricingRow";
import { db } from "@/lib/db";
import { Server } from "lucide-react";

export const revalidate = 0;

export default async function PricingPage() {
  const plans = await db.vpsPlan.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[200px] bg-accent/5 dark:bg-accent/10 blur-[80px] rounded-full pointer-events-none -z-10" />
        <h1 className="text-4xl md:text-6xl font-bold font-sans text-foreground tracking-tight mb-5">
          Simple, Transparent <span className="text-accent">Pricing</span>
        </h1>
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto font-sans leading-relaxed">
          No marketing gimmicks. Flat monthly rates for raw, unmetered server power.
        </p>
      </div>

      <div className="flex flex-col border-t border-divider max-w-5xl mx-auto bg-surface rounded-2xl border border-divider shadow-sm overflow-hidden">
        {plans.map((plan) => (
          <PricingRow
            key={plan.id}
            id={plan.slug}
            name={plan.name}
            description={plan.description}
            price={plan.price}
            period={plan.period}
            cpu={plan.cpu}
            ram={plan.ram}
            storage={plan.storage}
            bandwidth={plan.bandwidth}
            popular={plan.popular}
          />
        ))}
      </div>

      {plans.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-32">
          <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mb-6 border border-divider shadow-sm">
            <Server className="w-7 h-7 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Nodes at Maximum Capacity</h3>
          <p className="text-base text-muted max-w-md mx-auto leading-relaxed">
            All our current hardware is fully deployed. We are racking new servers right now. Check back soon or contact support for priority allocation.
          </p>
        </div>
      )}
    </div>
  );
}
