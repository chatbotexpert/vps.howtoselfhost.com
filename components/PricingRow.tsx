import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PricingRowProps {
  id: string;
  name: string;
  description: string;
  price: number | string;
  period: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  popular?: boolean;
}

export function PricingRow({
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
}: PricingRowProps) {
  return (
    <div className={`group flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 border-b border-divider last:border-b-0 transition-colors duration-200 ${popular ? 'bg-accent/5' : 'hover:bg-background/40'}`}>
      
      {/* Col 1: Name */}
      <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold font-sans text-foreground">{name}</h3>
          {popular && (
            <span className="px-2 py-0.5 bg-accent text-white dark:text-background text-[10px] font-bold font-mono uppercase tracking-wider rounded">
              Popular
            </span>
          )}
        </div>
        <p className="text-sm text-muted mt-1">{description}</p>
      </div>

      {/* Col 2: Specs (Monospace) */}
      <div className="w-full lg:w-2/4 grid grid-cols-2 gap-y-2 gap-x-4 mb-4 lg:mb-0 font-mono text-sm text-muted">
        <div className="flex items-center gap-2">
          <span className="opacity-70">CPU</span> <span className="text-foreground font-semibold">{cpu}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="opacity-70">RAM</span> <span className="text-foreground font-semibold">{ram}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="opacity-70">DISK</span> <span className="text-foreground font-semibold">{storage}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="opacity-70">NET</span> <span className="text-foreground font-semibold">{bandwidth}</span>
        </div>
      </div>

      {/* Col 3: Price */}
      <div className="w-full lg:w-1/6 flex items-baseline gap-1 mb-4 lg:mb-0">
        <span className="text-2xl font-bold text-foreground font-mono">${typeof price === "number" ? price.toFixed(2) : price}</span>
        <span className="text-muted text-sm font-mono">/{period}</span>
      </div>

      {/* Col 4: Action */}
      <div className="w-full lg:w-auto">
        <Link 
          href={`/order?plan=${id}`}
          className={`flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm font-bold uppercase rounded-xl transition-all duration-200 ${
            popular 
              ? 'bg-accent hover:opacity-90 text-white dark:text-background shadow-md shadow-accent/20' 
              : 'bg-surface hover:bg-background border border-divider text-foreground hover:border-accent/40'
          }`}
        >
          Select
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
