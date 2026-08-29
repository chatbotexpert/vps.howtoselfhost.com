import { Mail, MessageSquare, LifeBuoy } from "lucide-react";

export const metadata = {
  title: "Support | VPS Hosting",
  description: "Get help with your VPS hosting.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen relative flex-1 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="pt-32 pb-24 border-b border-divider relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[200px] bg-accent/5 dark:bg-accent/10 blur-[80px] rounded-full pointer-events-none -z-10" />
           <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight mb-8">
             System <span className="text-accent">Support.</span>
           </h1>
           <p className="text-2xl text-muted max-w-2xl font-light leading-relaxed font-sans">
             Reach our expert team anytime. We handle real infrastructure issues, not scripted responses.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-divider border-b border-divider">
          
          {/* Email Support */}
          <div className="p-12 pl-0 md:pl-8 flex flex-col items-start first:pl-0 group">
            <div className="flex items-center gap-4 mb-6">
               <Mail className="h-6 w-6 text-foreground group-hover:text-accent transition-colors" />
               <h3 className="text-2xl font-bold font-sans text-foreground tracking-tight">Email Us</h3>
            </div>
            <p className="text-muted font-mono text-sm leading-relaxed mb-8">
              Open a ticket. Average resolution time under 15 minutes.
            </p>
            <a href="mailto:support@howtoselfhost.com" className="mt-auto font-mono font-bold text-accent hover:underline uppercase text-sm tracking-wider">
              support@howtoselfhost.com
            </a>
          </div>

          {/* Live Chat */}
          <div className="p-12 md:pl-12 flex flex-col items-start group">
            <div className="flex items-center gap-4 mb-6">
               <MessageSquare className="h-6 w-6 text-foreground group-hover:text-accent transition-colors" />
               <h3 className="text-2xl font-bold font-sans text-foreground tracking-tight">Live Chat</h3>
            </div>
            <p className="text-muted font-mono text-sm leading-relaxed mb-8">
              Real-time debugging and infrastructure support over secure channels.
            </p>
            <button className="mt-auto font-mono font-bold text-accent hover:underline uppercase text-sm tracking-wider">
              Start a Chat
            </button>
          </div>

          {/* Documentation */}
          <div className="p-12 md:pl-12 flex flex-col items-start group">
            <div className="flex items-center gap-4 mb-6">
               <LifeBuoy className="h-6 w-6 text-foreground group-hover:text-accent transition-colors" />
               <h3 className="text-2xl font-bold font-sans text-foreground tracking-tight">Knowledge Base</h3>
            </div>
            <p className="text-muted font-mono text-sm leading-relaxed mb-8">
              API references, architecture blueprints, and deep-dive technical docs.
            </p>
            <a href="#" className="mt-auto font-mono font-bold text-accent hover:underline uppercase text-sm tracking-wider">
              Browse Articles
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
