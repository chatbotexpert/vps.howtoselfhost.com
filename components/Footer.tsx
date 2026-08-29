import Link from "next/link";
import { Terminal, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-divider bg-background mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-200">
                <Terminal className="w-4 h-4 text-accent" />
              </div>
              <span className="font-mono text-base font-bold text-foreground">
                howtoselfhost<span className="text-accent">.com</span>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed">
              Raw, unmetered Cloud VPS for developers. Deploy in seconds with full root access and complete control.
            </p>
          </div>
          
          <div>
            <h3 className="text-foreground font-semibold text-sm mb-4">Products</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted hover:text-foreground text-sm transition-colors duration-200 relative group inline-block">
                  Cloud VPS
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted hover:text-foreground text-sm transition-colors duration-200 relative group inline-block">
                  Pricing
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>

            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold text-sm mb-4">Company & Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms-and-conditions" className="text-muted hover:text-foreground text-sm transition-colors duration-200 relative group inline-block">
                  Terms & Conditions
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-muted hover:text-foreground text-sm transition-colors duration-200 relative group inline-block">
                  Privacy Policy
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-muted hover:text-foreground text-sm transition-colors duration-200 relative group inline-block">
                  Refund Policy
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold text-sm mb-4">Customer Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/login" className="text-muted hover:text-foreground text-sm transition-colors duration-200 relative group inline-block">
                  Customer Login
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/support" className="flex items-center gap-1.5 text-muted hover:text-foreground text-sm transition-colors duration-200 relative group inline-block">
                  <span className="flex items-center gap-1.5">Help / FAQ <ExternalLink className="w-3 h-3" /></span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-divider mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted text-sm">
            &copy; {currentYear} howtoselfhost.com — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
