import Link from "next/link";
import { Check } from "lucide-react";

interface PricingCardProps {
  id: string;
  name: string;
  description: string;
  price: string | number;
  period: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  popular?: boolean;
}

export function PricingCard({
  id,
  name,
  description,
  price,
  period,
  cpu,
  ram,
  storage,
  bandwidth,
  popular = false,
}: PricingCardProps) {
  return (
    <article 
      className={`group flex flex-col rounded-3xl bg-surface border transition-all duration-300 relative overflow-hidden p-8 ${
        popular 
          ? 'border-accent shadow-xl shadow-accent/10 -translate-y-2' 
          : 'border-divider hover:border-accent/40 shadow-sm hover:shadow-md'
      }`}
    >
      {popular && (
        <span className="absolute top-0 right-0 px-4 py-1.5 bg-accent text-white dark:text-background text-xs font-bold rounded-bl-2xl uppercase tracking-wider font-mono">
          Most Popular
        </span>
      )}

      <div className="flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">{name}</h3>
        <p className="text-sm text-muted mb-6 min-h-[40px] font-normal leading-relaxed">{description}</p>

        <div className="mb-6 flex items-baseline">
          <span className="text-4xl font-extrabold text-foreground font-mono">
            ${typeof price === "number" ? price.toFixed(2) : price}
          </span>
          <span className="text-muted ml-1.5 font-mono text-sm">/{period}</span>
        </div>

        <Link
          href={`/order?plan=${id}`}
          className={`text-center py-3 px-4 rounded-xl font-semibold transition-all duration-200 mb-8 ${
            popular 
              ? 'bg-accent hover:opacity-90 text-white dark:text-background shadow-md shadow-accent/20' 
              : 'bg-background hover:bg-surface border border-divider text-foreground hover:border-accent/50'
          }`}
        >
          Select {name}
        </Link>

        <div className="space-y-4 flex-1 pt-4 border-t border-divider">
          <div className="flex items-center gap-3">
            <div className="bg-accent/15 p-1 rounded-md flex-shrink-0">
              <Check className="h-4 w-4 text-accent" />
            </div>
            <span className="text-sm text-muted"><strong className="text-foreground">{cpu}</strong> vCPU Cores</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-accent/15 p-1 rounded-md flex-shrink-0">
              <Check className="h-4 w-4 text-accent" />
            </div>
            <span className="text-sm text-muted"><strong className="text-foreground">{ram}</strong> RAM</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-accent/15 p-1 rounded-md flex-shrink-0">
              <Check className="h-4 w-4 text-accent" />
            </div>
            <span className="text-sm text-muted"><strong className="text-foreground">{storage}</strong> NVMe Storage</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-accent/15 p-1 rounded-md flex-shrink-0">
              <Check className="h-4 w-4 text-accent" />
            </div>
            <span className="text-sm text-muted"><strong className="text-foreground">{bandwidth}</strong> Traffic</span>
          </div>
        </div>
      </div>
    </article>
  );
}
