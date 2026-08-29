import Link from "next/link";
import { ArrowRight, Shield, Zap, Server } from "lucide-react";
import { PricingRow } from "@/components/PricingRow";
import { AppHoverReveal } from "@/components/AppHoverReveal";
import { db } from "@/lib/db";

export const revalidate = 0;

export default async function Home() {
  const plans = await db.vpsPlan.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <>
      {/* Hero Section - Asymmetrical Brutalism */}
      <section className="relative flex flex-col justify-center overflow-hidden border-b border-divider bg-background min-h-[90vh]">
        
        {/* Soft Ambient Top Glow */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[100%] md:w-[70%] h-[40vw] md:h-[25vw] bg-accent/[0.06] dark:bg-accent/[0.08] blur-[120px] rounded-full pointer-events-none z-0" />

        {/* Massive Text-as-Design Watermark */}
        <div className="absolute top-10 right-4 lg:right-10 text-[18vw] font-mono font-bold text-watermark pointer-events-none select-none whitespace-nowrap z-0 tracking-tighter">
          VPS
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Column: Huge typography */}
          <div className="w-full lg:w-3/5 text-left pt-20 pb-10 lg:py-0">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold font-sans text-foreground leading-[0.95] tracking-tight mb-8">
              High-Performance<br/>
              Cloud Servers
            </h1>
            <p className="text-xl sm:text-2xl text-muted max-w-xl mb-12 leading-snug font-sans font-medium">
              No oversold nodes. Pure dedicated compute with full root access, NVMe storage, and unmetered bandwidth.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-3 bg-accent hover:opacity-90 text-white dark:text-background px-10 py-5 font-mono text-lg font-bold uppercase rounded-xl transition-all duration-300 shadow-lg shadow-accent/20 group"
            >
              Deploy Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>


          {/* Right Column: Borderless Stats List */}
          <div className="w-full lg:w-2/5 flex flex-col justify-center">
             <ul className="flex flex-col gap-10">
               <li className="flex flex-col border-l-2 border-accent pl-6 py-2">
                 <span className="text-4xl sm:text-5xl font-extrabold text-foreground font-sans tracking-tight leading-none mb-2">99.99%</span>
                 <span className="text-xs sm:text-sm text-muted font-mono uppercase tracking-widest">Guaranteed Uptime</span>
               </li>
               <li className="flex flex-col border-l-2 border-accent pl-6 py-2">
                 <span className="text-4xl sm:text-5xl font-extrabold text-foreground font-sans tracking-tight leading-none mb-2">Instant</span>
                 <span className="text-xs sm:text-sm text-muted font-mono uppercase tracking-widest">Easy Onboarding</span>
               </li>
               <li className="flex flex-col border-l-2 border-accent pl-6 py-2">
                 <span className="text-4xl sm:text-5xl font-extrabold text-foreground font-sans tracking-tight leading-none mb-2">24/7</span>
                 <span className="text-xs sm:text-sm text-muted font-mono uppercase tracking-widest">Live Chat Support</span>
               </li>
             </ul>
          </div>
          
        </div>
      </section>

      {/* Pricing Section - Horizontal Rows */}
      <section className="py-32 relative z-10 bg-background border-b border-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-bold font-sans text-foreground tracking-tight mb-6">
              Simple Pricing
            </h2>
            <p className="text-xl text-muted font-sans max-w-2xl">
              Pay for compute, not marketing. Flat rates with no hidden renewal traps.
            </p>
          </div>
          
          <div className="flex flex-col border-t border-divider">
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
        </div>
      </section>

      {/* One-Click App Installs Container - Hover Reveal */}
      <AppHoverReveal />

      {/* Features Section - Newspaper Grid */}
      <section className="bg-background border-y border-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-24 border-b border-divider">
             <h2 className="text-4xl md:text-6xl font-bold font-sans text-foreground tracking-tight max-w-3xl">
               Built for heavy workloads.
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-divider">
            
            <div className="p-12 pl-0 md:pl-8 flex flex-col items-start first:pl-0">
              <div className="flex items-center gap-4 mb-6">
                 <Zap className="h-6 w-6 text-foreground" />
                 <h3 className="text-2xl font-bold font-sans text-foreground tracking-tight">Lightning Fast NVMe</h3>
              </div>
              <p className="text-muted font-mono text-sm leading-relaxed">
                We don't use spinning drives. Pure NVMe setup for high IOPS and database heavy tasks.
              </p>
            </div>
            
            <div className="p-12 md:pl-12 flex flex-col items-start">
              <div className="flex items-center gap-4 mb-6">
                 <Shield className="h-6 w-6 text-foreground" />
                 <h3 className="text-2xl font-bold font-sans text-foreground tracking-tight">DDoS Protection</h3>
              </div>
              <p className="text-muted font-mono text-sm leading-relaxed">
                Our network drops Layer 3/4 attacks instantly at the edge. Keep your applications online.
              </p>
            </div>

            <div className="p-12 md:pl-12 flex flex-col items-start">
              <div className="flex items-center gap-4 mb-6">
                 <Server className="h-6 w-6 text-foreground" />
                 <h3 className="text-2xl font-bold font-sans text-foreground tracking-tight">Root Access</h3>
              </div>
              <p className="text-muted font-mono text-sm leading-relaxed">
                Full root control. Install any OS or control panel. We don't get in your way.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
