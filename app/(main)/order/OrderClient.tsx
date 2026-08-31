"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Server, Globe, ArrowRight, CreditCard, Shield, Monitor, HardDrive, Network, MapPin, Eye, EyeOff, RefreshCcw, Lock, ShieldCheck } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "./StripeCheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

// VPS_PLANS will be generated dynamically from dbPlans
const REGIONS = [
  { id: "eu", name: "European Union", latency: "Standard latency", price: 0 },
  { id: "us", name: "United States", latency: "Standard latency", price: 2.10 },
  { id: "asia", name: "Asia", latency: "Standard latency", price: 4.00 },
];

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const OS_IMAGES = [
  { id: "ubuntu", name: "Ubuntu", price: 0, category: ["popular", "os"], icon: "https://cdn.simpleicons.org/ubuntu/E95420" },
  { id: "custom", name: "Custom Images", price: 0, category: ["popular"], icon: "https://cdn.simpleicons.org/iso/000000" },
  { id: "windows", name: "Windows Server", price: 16.00, category: ["popular", "os"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg" },
  { id: "cpanel", name: "cPanel", price: 43.50, category: ["popular", "panels"], icon: "https://cdn.simpleicons.org/cpanel/FF6C2C" },
  { id: "rhel", name: "RHEL Variants", price: 0, category: ["popular", "os"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redhat/redhat-original.svg" },
  { id: "plesk", name: "Plesk + Linux", price: 24.00, category: ["popular", "panels"], icon: "https://cdn.simpleicons.org/plesk/52B8ED" },
  { id: "debian", name: "Debian", price: 0, category: ["os"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/debian/debian-original.svg" },
  { id: "almalinux", name: "AlmaLinux", price: 0, category: ["os"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/almalinux/almalinux-original.svg" },
  { id: "rocky", name: "Rocky Linux", price: 0, category: ["os"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rockylinux/rockylinux-original.svg" },
  { id: "hermes", name: "Hermes Agent Server", price: 0, category: ["apps"], icon: "https://cdn.simpleicons.org/gnometerminal/4A4A4A" },
  { id: "dokploy", name: "Dokploy Server", price: 0, category: ["apps"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
  { id: "zeroclaw", name: "Zeroclaw Server", price: 0, category: ["apps"], icon: "https://cdn.simpleicons.org/kubernetes/326CE5" },
  { id: "n8n", name: "n8n Server", price: 0, category: ["apps"], icon: "https://cdn.simpleicons.org/n8n/FF6D5A" },
  { id: "wireguard", name: "Wireguard Server", price: 0, category: ["apps"], icon: "https://cdn.simpleicons.org/wireguard/88171A" },
  { id: "nextcloud", name: "Nextcloud Server", price: 0, category: ["apps"], icon: "https://cdn.simpleicons.org/nextcloud/0082C9" },
  { id: "gitlab", name: "Gitlab Server", price: 0, category: ["apps"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gitlab/gitlab-original.svg" },
  { id: "docker", name: "Docker", price: 0, category: ["apps"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
  { id: "lamp", name: "LAMP", price: 0, category: ["apps"], icon: "https://cdn.simpleicons.org/linux/FCC624" },
  { id: "openclaw", name: "OpenClaw Server", price: 0, category: ["apps"], icon: "https://cdn.simpleicons.org/nginx/009639" },
  { id: "webmin", name: "Webmin", price: 0, category: ["panels"], icon: "https://cdn.simpleicons.org/webmin/000000" },
  { id: "webmin-lamp", name: "Webmin + LAMP", price: 0, category: ["panels"], icon: "https://cdn.simpleicons.org/webmin/000000" },
  { id: "ipfs", name: "IPFS Node", price: 0, category: ["blockchain"], icon: "https://cdn.simpleicons.org/ipfs/65C2CB" },
  { id: "flux", name: "Flux Node", price: 0, category: ["blockchain"], icon: "https://cdn.simpleicons.org/flux/2B61D1" },
  { id: "horizen", name: "Horizen Node", price: 0, category: ["blockchain"], icon: "https://cdn.simpleicons.org/horizen/041C44" },
];

const STORAGE_OPTIONS = [
  { id: 100, name: "100 GB NVMe", price: 0 },
  { id: 200, name: "200 GB NVMe", price: 3.00 },
];

export default function OrderClient({ dbPlans }: { dbPlans: any[] }) {
  const VPS_PLANS = dbPlans.map(p => ({
    id: p.slug,
    name: p.name,
    price: p.price,
    cpu: p.cpu.replace(" vCores", ""),
    ram: p.ram,
    disk: p.storage,
    snapshot: "1",
    port: "1 Gbit/s"
  }));

  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || (VPS_PLANS[0]?.id || "vps-1");
  const selectedPlan = VPS_PLANS.find(p => p.id === planId) || VPS_PLANS[0];

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [session, setSession] = useState<{ authenticated: boolean; user?: { email: string; firstName: string } } | null>(null);
  const [accountPassword, setAccountPassword] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => setSession(data))
      .catch(() => setSession({ authenticated: false }));
  }, []);

  // Step 1: Config
  const [quantity, setQuantity] = useState(1);
  const [term, setTerm] = useState<number>(1);
  const [region, setRegion] = useState("eu");
  const [storageSpace, setStorageSpace] = useState(100);
  const [imageTab, setImageTab] = useState("popular");
  const [image, setImage] = useState("ubuntu");
  const [autoBackup, setAutoBackup] = useState(true);
  
  // Networking / Addons Toggles
  const [hasPrivateNetwork, setHasPrivateNetwork] = useState(false);
  const [unlimitedBandwidth, setUnlimitedBandwidth] = useState(true);
  const [extraIpv4, setExtraIpv4] = useState(false);
  const [hasObjectStorage, setHasObjectStorage] = useState(false);
  const [hasMonitoring, setHasMonitoring] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: Personal Info
  const [customerType, setCustomerType] = useState<"new" | "existing">("new");
  const [formData, setFormData] = useState({
    businessName: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postcode: "",
    country: "Pakistan",
    state: "",
    email: "",
    telephone: ""
  });

  // Math
  const baseMonthly = selectedPlan.price;
  const regionCost = REGIONS.find(r => r.id === region)?.price || 0;
  const imageCost = OS_IMAGES.find(i => i.id === image)?.price || 0;
  const extraStorageCost = STORAGE_OPTIONS.find(s => s.id === storageSpace)?.price || 0;
  const backupCost = autoBackup ? 3.30 : 0;

  // Total Monthly per Server
  const monthlyTotal = baseMonthly + regionCost + imageCost + extraStorageCost + backupCost;
  
  // Term discounts
  let termDiscount = 0;
  if (term === 12) termDiscount = 0.15; // 15% off
  if (term === 24) termDiscount = 0.20; // 20% off

  const discountedMonthly = monthlyTotal * (1 - termDiscount);
  
  // Setup Fee
  const setupFee = 0; // Contabo says "No Setup Fee" for these terms in the screenshot
  const oneTimeTotal = setupFee * quantity;

  // Total Due Today
  const dueToday = (discountedMonthly * term * quantity) + oneTimeTotal;
  
  // Savings
  const savedAmount = (monthlyTotal * term * quantity) - (discountedMonthly * term * quantity);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    for (let i=0; i<16; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    setPassword(pwd);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (step === 1) {
      if (!password || password.length < 8) {
        setErrorMessage("Please enter a valid server password (minimum 8 characters).");
        return;
      }
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2) {
      submitOrder();
    }
  };

  const submitOrder = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          term,
          region,
          storageType: `SSD ${storageSpace}GB`,
          image,
          password,
          personalInfo: session?.authenticated ? {} : formData,
          totalAmount: dueToday
        })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.accountPassword) {
          setAccountPassword(data.accountPassword);
        }

        // Initialize Stripe Payment
        const piRes = await fetch("/api/create-payment-intent", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ amount: dueToday, orderId: data.orderId })
        });
        const piData = await piRes.json();

        if (piRes.ok && piData.clientSecret) {
          setClientSecret(piData.clientSecret);
          setStep(3);
          window.scrollTo(0, 0);
        } else {
          setErrorMessage(piData.error || "Failed to initialize payment.");
        }
      } else {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-background flex flex-col pb-32">
      {/* Top Header Steps */}
      <div className="bg-white dark:bg-surface border-b border-divider py-8">
        <div className="max-w-4xl mx-auto px-4 relative">
          {/* Connecting Lines */}
          <div className="absolute top-[10px] left-[10%] right-[10%] flex items-center z-0">
             <div className={`h-0 flex-1 border-t-2 border-dashed mx-1 sm:mx-2 ${step >= 2 ? 'border-accent' : 'border-divider/50'}`} />
             <div className={`h-0 flex-1 border-t-2 border-dashed mx-1 sm:mx-2 ${step >= 3 ? 'border-accent' : 'border-divider/50'}`} />
             <div className={`h-0 flex-1 border-t-2 border-dashed mx-1 sm:mx-2 ${step >= 4 ? 'border-accent' : 'border-divider/50'}`} />
          </div>

          {/* Steps */}
          <div className="relative z-10 flex justify-between">
            <div className="flex flex-col items-center w-20 sm:w-32">
              <div className={`w-5 h-5 rounded-full mb-3 flex items-center justify-center text-white ${step >= 1 ? 'bg-accent' : 'bg-divider/50'}`}>
                {step > 1 && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className={`text-[11px] sm:text-sm font-semibold text-center ${step >= 1 ? 'text-accent' : 'text-muted'}`}>Configuration</span>
            </div>
            
            <div className="flex flex-col items-center w-20 sm:w-32">
              <div className={`w-5 h-5 rounded-full mb-3 flex items-center justify-center text-white ${step >= 2 ? 'bg-accent' : 'bg-divider/50'}`}>
                {step > 2 && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className={`text-[11px] sm:text-sm font-semibold text-center ${step >= 2 ? 'text-accent' : 'text-muted'}`}>Personal info</span>
            </div>
            
            <div className="flex flex-col items-center w-20 sm:w-32">
              <div className={`w-5 h-5 rounded-full mb-3 flex items-center justify-center text-white ${step >= 3 ? 'bg-accent' : 'bg-divider/50'}`}>
                {step > 3 && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className={`text-[11px] sm:text-sm font-semibold text-center ${step >= 3 ? 'text-accent' : 'text-muted'}`}>Payment</span>
            </div>

            <div className="flex flex-col items-center w-20 sm:w-32">
              <div className={`w-5 h-5 rounded-full mb-3 flex items-center justify-center text-white ${step >= 4 ? 'bg-accent' : 'bg-divider/50'}`}>
                {step > 4 && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className={`text-[11px] sm:text-sm font-semibold text-center ${step >= 4 ? 'text-accent' : 'text-muted'}`}>Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8">
        
        {step === 1 && (
          <form id="config-form" onSubmit={handleNext} className="space-y-8 bg-white dark:bg-surface p-6 sm:p-10 shadow-sm border border-divider">
            <h1 className="text-3xl font-bold text-foreground mb-8 tracking-tight">Configure your {selectedPlan.name}</h1>

            {errorMessage && step === 1 && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium mb-6 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {errorMessage}
              </div>
            )}

            {/* Server Specs Box */}
            <div className="border-2 border-accent rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-accent/5 mt-8">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
                <div>
                  <div className="text-[10px] font-bold uppercase text-muted tracking-wider mb-1">CPU</div>
                  <div className="text-sm font-medium text-foreground">{selectedPlan.cpu} vCPU Cores</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-muted tracking-wider mb-1">RAM</div>
                  <div className="text-sm font-medium text-foreground">{selectedPlan.ram}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-muted tracking-wider mb-1">STORAGE</div>
                  <div className="text-sm font-medium text-foreground">{storageSpace} GB SSD<br/><span className="text-xs text-muted font-normal">More storage available</span></div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-muted tracking-wider mb-1">SNAPSHOT</div>
                  <div className="text-sm font-medium text-foreground">{selectedPlan.snapshot} Snapshot</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-muted tracking-wider mb-1">PORT</div>
                  <div className="text-sm font-medium text-foreground">{selectedPlan.port}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 border-l border-accent/20 pl-6 shrink-0">
                <span className="text-sm text-muted">Server<br/>Quantity</span>
                <select 
                  className="border border-divider rounded bg-background text-foreground px-3 py-1.5 focus:outline-none focus:border-accent"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  {[1,2,3,4,5].map(n => <option key={n} value={n} className="bg-white dark:bg-[#1e293b] text-black dark:text-white">{n}</option>)}
                </select>
              </div>
            </div>

            {/* Term Length */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Select your term length</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1 Month */}
                <div 
                  onClick={() => setTerm(1)}
                  className={`cursor-pointer rounded-lg border-2 overflow-hidden flex flex-col ${term === 1 ? 'border-accent shadow-sm' : 'border-divider hover:border-accent/40'}`}
                >
                  <div className="p-4 flex-1 bg-white dark:bg-surface flex items-center justify-between">
                    <div className="text-sm font-medium">1 Month</div>
                    <div className="text-right">
                       <div className="text-lg font-bold">${(monthlyTotal).toFixed(2)} <span className="text-xs font-normal text-muted">/ month</span></div>
                    </div>
                  </div>
                  <div className="bg-[#78A479] text-white text-xs font-bold text-center py-2">No Setup Fee</div>
                </div>
                {/* 12 Months */}
                <div 
                  onClick={() => setTerm(12)}
                  className={`cursor-pointer rounded-lg border-2 overflow-hidden flex flex-col relative ${term === 12 ? 'border-accent shadow-sm' : 'border-divider hover:border-accent/40'}`}
                >
                  <div className="absolute top-2 left-2 bg-[#E6F3E6] text-[#2E7D32] text-[10px] font-bold px-2 py-0.5 rounded-sm">SAVE 15%</div>
                  <div className="p-4 pt-8 flex-1 bg-white dark:bg-surface flex items-center justify-between">
                    <div className="text-sm font-medium">12 Months</div>
                    <div className="text-right">
                       <div className="text-xs text-red-500 line-through">${(monthlyTotal).toFixed(2)}/month</div>
                       <div className="text-lg font-bold">${(monthlyTotal * 0.85).toFixed(2)} <span className="text-xs font-normal text-muted">/ month</span></div>
                    </div>
                  </div>
                  <div className="bg-[#78A479] text-white text-xs font-bold text-center py-2">No Setup Fee</div>
                </div>
                {/* 24 Months */}
                <div 
                  onClick={() => setTerm(24)}
                  className={`cursor-pointer rounded-lg border-2 overflow-hidden flex flex-col relative ${term === 24 ? 'border-accent shadow-sm' : 'border-divider hover:border-accent/40'}`}
                >
                  <div className="absolute top-2 left-2 bg-[#E6F3E6] text-[#2E7D32] text-[10px] font-bold px-2 py-0.5 rounded-sm">SAVE 20%</div>
                  <div className="p-4 pt-8 flex-1 bg-white dark:bg-surface flex items-center justify-between">
                    <div className="text-sm font-medium">24 Months</div>
                    <div className="text-right">
                       <div className="text-xs text-red-500 line-through">${(monthlyTotal).toFixed(2)}/month</div>
                       <div className="text-lg font-bold">${(monthlyTotal * 0.80).toFixed(2)} <span className="text-xs font-normal text-muted">/ month</span></div>
                    </div>
                  </div>
                  <div className="bg-[#78A479] text-white text-xs font-bold text-center py-2">No Setup Fee</div>
                </div>
              </div>
            </div>

            <div className="h-px bg-divider w-full" />

            {/* Region */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Region</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center justify-center bg-[#EBF0F5] dark:bg-accent/5 rounded-lg p-8">
                   <Globe className="w-32 h-32 text-accent/20" />
                </div>
                <div>
                   <div className="flex gap-4 border-b border-divider mb-4">
                     <button type="button" className="pb-2 border-b-2 border-accent text-accent font-medium text-sm">Best</button>
                     <button type="button" className="pb-2 border-b-2 border-transparent text-muted font-medium text-sm">Europe</button>
                     <button type="button" className="pb-2 border-b-2 border-transparent text-muted font-medium text-sm">America</button>
                     <button type="button" className="pb-2 border-b-2 border-transparent text-muted font-medium text-sm">Asia</button>
                   </div>
                   <div className="space-y-2">
                     {REGIONS.map(r => (
                       <div 
                         key={r.id} 
                         onClick={() => setRegion(r.id)}
                         className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${region === r.id ? 'border-accent bg-accent/5' : 'border-divider hover:border-accent/40'}`}
                       >
                         <div className="text-sm text-foreground">{r.name} – {r.latency}</div>
                         <div className="text-sm text-muted">{r.price === 0 ? "Free" : `$${r.price.toFixed(2)} /month`}</div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-divider w-full" />

            {/* Storage */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Storage</h2>
              <div className="flex flex-wrap gap-4">
                {STORAGE_OPTIONS.map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => setStorageSpace(s.id)}
                    className={`flex items-center justify-between px-6 py-3 rounded-lg border-2 cursor-pointer transition-colors min-w-[200px] ${storageSpace === s.id ? 'border-accent bg-accent/5 shadow-sm text-accent' : 'border-divider hover:border-accent/40'}`}
                  >
                    <span className="font-medium">{s.name}</span>
                    <span className="text-sm">{s.price === 0 ? "Free" : `$${s.price.toFixed(2)} /month`}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-divider w-full" />

            {/* Image */}
            <div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 border-b border-divider">
                <h2 className="text-lg font-bold text-foreground mb-4 md:mb-0">Image</h2>
                <div className="flex gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                   <button type="button" onClick={() => setImageTab("popular")} className={`pb-2 border-b-2 font-medium text-sm ${imageTab === "popular" ? "border-accent text-accent" : "border-transparent text-muted"}`}>Popular</button>
                   <button type="button" onClick={() => setImageTab("os")} className={`pb-2 border-b-2 font-medium text-sm ${imageTab === "os" ? "border-accent text-accent" : "border-transparent text-muted"}`}>OS</button>
                   <button type="button" onClick={() => setImageTab("apps")} className={`pb-2 border-b-2 font-medium text-sm ${imageTab === "apps" ? "border-accent text-accent" : "border-transparent text-muted"}`}>New: Apps</button>
                   <button type="button" onClick={() => setImageTab("panels")} className={`pb-2 border-b-2 font-medium text-sm ${imageTab === "panels" ? "border-accent text-accent" : "border-transparent text-muted"}`}>Panels</button>
                   <button type="button" onClick={() => setImageTab("blockchain")} className={`pb-2 border-b-2 font-medium text-sm ${imageTab === "blockchain" ? "border-accent text-accent" : "border-transparent text-muted"}`}>Blockchain</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {OS_IMAGES.filter(i => i.category.includes(imageTab)).map(i => (
                  <div 
                    key={i.id} 
                    onClick={() => setImage(i.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all h-[110px] text-center ${image === i.id ? 'border-accent bg-accent/5 shadow-md text-accent scale-[1.02]' : 'border-divider hover:border-accent/40 text-foreground'}`}
                  >
                    <div className="w-8 h-8 shrink-0 bg-white rounded flex items-center justify-center p-1 shadow-sm border border-divider/50 mb-2 transition-transform">
                      <img 
                        src={i.icon || "https://cdn.simpleicons.org/linux/000000"} 
                        alt={i.name} 
                        className="w-full h-full object-contain" 
                        onError={(e) => { e.currentTarget.src = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg' }} 
                      />
                    </div>
                    <span className="font-semibold text-[13px] leading-tight mb-1 w-full px-1 break-words line-clamp-2">{i.name}</span>
                    {i.price === 0 ? (
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Included</span>
                    ) : (
                      <span className="text-[12px] font-bold text-foreground">
                        ${i.price.toFixed(2)} <span className="text-[10px] text-muted font-normal">/mo</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-divider w-full" />

            {/* Auto Backup */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">Data Protection with Auto Backup</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                 <div className="flex items-center justify-center p-6 border border-divider rounded-lg bg-surface">
                   <div className="text-sm space-y-2 text-muted">
                     <p>• Daily automated backups.</p>
                     <p>• Instant 1-click recovery.</p>
                     <p>• Keeps the last 10 backup versions.</p>
                     <p>• No setup needed.</p>
                   </div>
                 </div>
                 <div 
                   onClick={() => setAutoBackup(true)}
                   className={`cursor-pointer rounded-lg border-2 p-6 text-center relative ${autoBackup ? 'border-accent shadow-sm' : 'border-divider hover:border-accent/40'}`}
                 >
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-background dark:text-white text-[11px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">Our Recommendation</div>
                   <div className="font-bold text-lg mb-1">Auto Backup</div>
                   <div className="font-bold text-base mb-2">$3.30 <span className="text-xs font-normal">/ month</span></div>
                   <div className="text-xs text-muted">Set it and forget it.<br/>Effortless data security.</div>
                 </div>
                 <div 
                   onClick={() => setAutoBackup(false)}
                   className={`cursor-pointer rounded-lg border-2 p-6 flex items-center justify-center h-full transition-colors ${!autoBackup ? 'border-accent shadow-sm text-accent' : 'border-divider hover:border-accent/40 text-muted'}`}
                 >
                   <div className="font-medium">No Data Protection</div>
                 </div>
              </div>
            </div>

            <div className="h-px bg-divider w-full" />

            {/* Additional Features */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Additional Features</h2>
              
              <div className="space-y-6">
                 <div>
                   <h3 className="font-bold text-base mb-4">Networking</h3>
                   <div className="space-y-4 max-w-2xl ml-auto">
                     <div className={`flex items-center justify-between border p-4 rounded-lg transition-colors cursor-pointer ${hasPrivateNetwork ? 'border-accent bg-accent/5' : 'border-divider hover:border-accent/40'}`} onClick={() => setHasPrivateNetwork(!hasPrivateNetwork)}>
                       <div className="flex flex-col select-none">
                         <label className="text-sm font-bold text-foreground cursor-pointer">Private Networking</label>
                         <span className="text-xs text-muted">Enable private networking between your servers - Free</span>
                       </div>
                       <div className={`w-11 h-6 rounded-full flex items-center transition-colors shrink-0 ${hasPrivateNetwork ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-700'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${hasPrivateNetwork ? 'translate-x-6' : 'translate-x-1'}`} />
                       </div>
                     </div>
                     <div className={`flex items-center justify-between border p-4 rounded-lg transition-colors cursor-pointer ${unlimitedBandwidth ? 'border-accent bg-accent/5' : 'border-divider hover:border-accent/40'}`} onClick={() => setUnlimitedBandwidth(!unlimitedBandwidth)}>
                       <div className="flex flex-col select-none">
                         <label className="text-sm font-bold text-foreground cursor-pointer">Unlimited Bandwidth</label>
                         <span className="text-xs text-muted">Unmetered incoming and outgoing traffic - Free</span>
                       </div>
                       <div className={`w-11 h-6 rounded-full flex items-center transition-colors shrink-0 ${unlimitedBandwidth ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-700'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${unlimitedBandwidth ? 'translate-x-6' : 'translate-x-1'}`} />
                       </div>
                     </div>
                     <div className={`flex items-center justify-between border p-4 rounded-lg transition-colors cursor-pointer ${extraIpv4 ? 'border-accent bg-accent/5' : 'border-divider hover:border-accent/40'}`} onClick={() => setExtraIpv4(!extraIpv4)}>
                       <div className="flex flex-col select-none">
                         <label className="text-sm font-bold text-foreground cursor-pointer">Additional IPv4 Address</label>
                         <span className="text-xs text-muted">Add a secondary IPv4 address to your server - Free</span>
                       </div>
                       <div className={`w-11 h-6 rounded-full flex items-center transition-colors shrink-0 ${extraIpv4 ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-700'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${extraIpv4 ? 'translate-x-6' : 'translate-x-1'}`} />
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="pt-6 border-t border-divider border-dashed">
                   <h3 className="font-bold text-base mb-4">Add-Ons</h3>
                   <div className="space-y-4 max-w-2xl ml-auto">
                     <div className={`flex items-center justify-between border p-4 rounded-lg transition-colors cursor-pointer ${hasObjectStorage ? 'border-accent bg-accent/5' : 'border-divider hover:border-accent/40'}`} onClick={() => setHasObjectStorage(!hasObjectStorage)}>
                       <div className="flex flex-col select-none">
                         <label className="text-sm font-bold text-foreground cursor-pointer">Object Storage</label>
                         <span className="text-xs text-muted">S3-compatible object storage (250GB) - Free</span>
                       </div>
                       <div className={`w-11 h-6 rounded-full flex items-center transition-colors shrink-0 ${hasObjectStorage ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-700'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${hasObjectStorage ? 'translate-x-6' : 'translate-x-1'}`} />
                       </div>
                     </div>
                     <div className={`flex items-center justify-between border p-4 rounded-lg transition-colors cursor-pointer ${hasMonitoring ? 'border-accent bg-accent/5' : 'border-divider hover:border-accent/40'}`} onClick={() => setHasMonitoring(!hasMonitoring)}>
                       <div className="flex flex-col select-none">
                         <label className="text-sm font-bold text-foreground cursor-pointer">Server Monitoring</label>
                         <span className="text-xs text-muted">24/7 advanced uptime and resource monitoring - Free</span>
                       </div>
                       <div className={`w-11 h-6 rounded-full flex items-center transition-colors shrink-0 ${hasMonitoring ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-700'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${hasMonitoring ? 'translate-x-6' : 'translate-x-1'}`} />
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            <div className="h-px bg-divider w-full" />

            {/* Login & Password */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Login & password for your server</h2>
              <div className="max-w-2xl bg-surface p-6 rounded-lg border border-divider">
                 <div className="flex items-center gap-4 mb-4">
                    <label className="w-32 text-sm font-medium text-foreground">Username</label>
                    <div className="text-sm font-medium text-muted">root</div>
                 </div>
                 <div className="flex items-start gap-4">
                    <label className="w-32 text-sm font-medium text-foreground mt-2">Password</label>
                    <div className="flex-1">
                      <button type="button" onClick={generatePassword} className="text-xs text-accent hover:underline mb-1 flex items-center gap-1">
                        Generate new password
                      </button>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          required
                          minLength={8}
                          className="w-full border border-divider rounded-md p-2.5 text-sm bg-white pr-10 focus:outline-none focus:border-accent"
                          placeholder="Enter a secure password"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-[10px] text-muted mt-2 space-y-0.5 list-disc pl-4">
                        <li>You can add SSH keys later in the Control Panel.</li>
                        <li>Your password won't be emailed.</li>
                        <li>Keep it safe for Windows access. If lost, a reinstall is required.</li>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
            
            {/* Pad the bottom inside the form so content isn't hidden by the fixed bar */}
            <div className="h-10"></div>
          </form>
        )}

        {step === 2 && (
          <div className="max-w-4xl mx-auto w-full">
            {/* Tabs */}
            <div className="flex space-x-1 mb-0 relative z-10">
              <button className="bg-white dark:bg-surface text-foreground px-6 py-4 rounded-t-lg font-medium shadow-sm border-t border-l border-r border-divider z-20">
                I'm a new customer
              </button>
              <button className="bg-accent text-white dark:text-background px-6 py-4 rounded-t-lg font-medium shadow-sm z-10 opacity-90 hover:opacity-100">
                I already have an account
              </button>
            </div>

            {/* Main Form Container */}
            <form id="personal-form" onSubmit={handleNext} className="bg-white dark:bg-surface p-8 shadow-sm border border-divider rounded-b-lg rounded-tr-lg relative z-0 -mt-[1px]">
               <div className="flex justify-between items-center mb-8">
                 <h2 className="text-[22px] font-bold text-[#202E39] dark:text-foreground">Personal Data</h2>
                 <div className="flex gap-2">
                   <div className="flex items-center gap-2 border border-[#202E39]/30 dark:border-divider rounded-md px-2.5 py-1 bg-white dark:bg-surface text-[11px] font-bold">
                     <Lock className="w-5 h-5 text-[#202E39] dark:text-foreground/80" strokeWidth={1.5} />
                     <div className="leading-[1.1]"><span className="block text-[#202E39] dark:text-foreground">Privacy</span><span className="block text-accent dark:text-white/60 font-medium">Protected</span></div>
                   </div>
                   <div className="flex items-center gap-2 border border-[#202E39]/30 dark:border-divider rounded-md px-2.5 py-1 bg-white dark:bg-surface text-[11px] font-bold">
                     <ShieldCheck className="w-5 h-5 text-[#202E39] dark:text-foreground/80" strokeWidth={1.5} />
                     <div className="leading-[1.1]"><span className="block text-[#202E39] dark:text-foreground">Secure</span><span className="block text-accent dark:text-white/60 font-medium">Checkout</span></div>
                   </div>
                 </div>
               </div>
               
               <div className="space-y-5">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                     <label className="block text-[13px] text-muted mb-1 font-medium">Business Name</label>
                     <input type="text" placeholder="optional" className="w-full border border-divider rounded p-2.5 text-[14px] bg-transparent focus:border-accent focus:outline-none transition-colors" />
                   </div>
                   <div>
                     <label className="block text-[13px] text-muted mb-1 font-medium">VAT Number <span className="text-[10px] bg-divider/50 rounded-full px-1.5 py-0.5 ml-1 text-muted-foreground">?</span></label>
                     <input type="text" placeholder="optional" className="w-full border border-divider rounded p-2.5 text-[14px] bg-transparent focus:border-accent focus:outline-none transition-colors" />
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-[100px_1fr_1fr] gap-5">
                   <div>
                     <label className="block text-[13px] text-muted mb-1 font-medium">Salutation</label>
                     <select className="w-full border border-divider rounded p-2.5 text-[14px] bg-white dark:bg-surface focus:border-accent focus:outline-none transition-colors">
                       <option className="bg-white dark:bg-[#1e293b] text-black dark:text-white">Mr</option>
                       <option className="bg-white dark:bg-[#1e293b] text-black dark:text-white">Ms</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-[13px] text-muted mb-1 font-medium">First Name</label>
                     <input type="text" required className="w-full border border-divider rounded p-2.5 text-[14px] bg-transparent focus:border-accent focus:outline-none transition-colors" value={formData.firstName || ''} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-[13px] text-muted mb-1 font-medium">Last Name</label>
                     <input type="text" required className="w-full border border-divider rounded p-2.5 text-[14px] bg-transparent focus:border-accent focus:outline-none transition-colors" value={formData.lastName || ''} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-[13px] text-muted mb-1 font-medium">Address</label>
                   <input type="text" required placeholder="Enter your Address" className="w-full border border-divider rounded p-2.5 text-[14px] bg-transparent focus:border-accent focus:outline-none transition-colors" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                     <label className="block text-[13px] text-muted mb-1 font-medium">City</label>
                     <input type="text" required className="w-full border border-divider rounded p-2.5 text-[14px] bg-transparent focus:border-accent focus:outline-none transition-colors" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-[13px] text-muted mb-1 font-medium">Postcode</label>
                     <input type="text" required className="w-full border border-divider rounded p-2.5 text-[14px] bg-transparent focus:border-accent focus:outline-none transition-colors" value={formData.postcode || ''} onChange={e => setFormData({...formData, postcode: e.target.value})} />
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                     <label className="block text-[13px] text-muted mb-1 font-medium">Country</label>
                     <select className="w-full border border-divider rounded p-2.5 text-[14px] bg-white dark:bg-surface focus:border-accent focus:outline-none transition-colors" value={formData.country || 'Pakistan'} onChange={e => setFormData({...formData, country: e.target.value})}>
                       {COUNTRIES.map(country => (
                         <option key={country} value={country} className="bg-white dark:bg-[#1e293b] text-black dark:text-white">{country}</option>
                       ))}
                     </select>
                   </div>
                   <div>
                     <label className="block text-[13px] text-muted mb-1 font-medium">State / Province</label>
                     <input type="text" placeholder="Enter your State" className="w-full border border-divider rounded p-2.5 text-[14px] bg-transparent focus:border-accent focus:outline-none transition-colors" value={formData.state || ''} onChange={e => setFormData({...formData, state: e.target.value})} />
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-[13px] text-muted mb-1 font-medium">Telephone <span className="text-[10px] bg-divider/50 rounded-full px-1.5 py-0.5 ml-1 text-muted-foreground">?</span></label>
                   <input type="tel" required className="w-full border border-divider rounded p-2.5 text-[14px] bg-transparent focus:border-accent focus:outline-none transition-colors" />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                     <label className="block text-[13px] text-muted mb-1 font-medium">Email</label>
                     <input type="email" required className="w-full border border-divider rounded p-2.5 text-[14px] bg-transparent focus:border-accent focus:outline-none transition-colors" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-[13px] text-muted mb-1 font-medium">Confirm Email</label>
                     <input type="email" required className="w-full border border-divider rounded p-2.5 text-[14px] bg-transparent focus:border-accent focus:outline-none transition-colors" />
                   </div>
                 </div>
               </div>
               
               <div className="mt-12 flex justify-between items-end">
                 <button type="button" onClick={() => {setStep(1); window.scrollTo(0,0);}} className="text-[13px] font-medium text-muted hover:text-foreground">
                   &larr; Back
                 </button>
                 <button type="submit" className="bg-accent hover:opacity-90 text-white dark:text-background px-8 py-3 rounded-xl font-mono uppercase font-bold shadow-md shadow-accent/20 transition-all duration-300">
                   Next
                 </button>
               </div>
               
               <div className="mt-10 border-t border-divider pt-6 text-[10px] leading-relaxed text-muted max-w-3xl">
                 Your privacy is important to us. We process your personal data for the purpose of creating a user account and carrying out your order as per our <a href="#" className="text-accent hover:underline">privacy notice</a>. We take the highest precautions to make sure that your data is safe and secure. We will never sell your data to any third parties.
               </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-4xl mx-auto w-full mb-12">
            <div className="bg-white dark:bg-surface p-8 shadow-sm border border-divider rounded-lg">
              <h2 className="text-[20px] font-bold text-[#202E39] dark:text-foreground mb-6">2. Payment</h2>
              
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripeCheckoutForm 
                    amount={dueToday} 
                    onSuccess={() => {
                      setStep(4);
                      window.scrollTo(0,0);
                    }}
                    onBack={() => {
                      setStep(2);
                      window.scrollTo(0,0);
                    }}
                  />
                </Elements>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                  </div>
                  <p className="mt-4 text-muted">Initializing secure payment gateway...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-3xl mx-auto w-full mb-12">
            <div className="bg-white dark:bg-surface p-10 shadow-sm border border-divider text-center rounded-lg">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-3xl font-bold text-[#202E39] dark:text-foreground mb-4">Order Confirmed!</h2>
              <p className="text-base text-muted mb-8 max-w-xl mx-auto">
                Thank you for your order. We have successfully received your payment of <strong className="text-foreground">${dueToday.toFixed(2)}</strong>. We are now provisioning your server.
              </p>
              
              {accountPassword && (
                <div className="bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 p-6 rounded-xl max-w-lg mx-auto mb-8 text-left">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Your Website Login Credentials</h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">
                    Please save these details. You will need them to log in to the Customer Dashboard.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-gray-400">Email:</span>
                      <strong className="text-slate-900 dark:text-white">{formData.email}</strong>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-gray-400">Password:</span>
                      <strong className="text-slate-900 dark:text-white font-mono bg-slate-200 dark:bg-gray-900 px-2 py-1 rounded">{accountPassword}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                 <Link href="/" className="inline-flex items-center justify-center bg-accent hover:opacity-90 text-white dark:text-background px-8 py-3 rounded-xl font-mono uppercase font-bold shadow-md shadow-accent/20 transition-all duration-300">
                   Return to Dashboard
                 </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Bar - Only show on steps 1 and 2 */}
      {step < 3 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#E8EDF1] dark:bg-surface border-t border-divider shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm font-medium">
               <button type="button" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="font-bold text-foreground hover:text-accent transition-colors cursor-pointer">Order Summary</button>
               <button type="button" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }} className="text-accent flex items-center gap-1 hover:opacity-80 transition-opacity"><Monitor className="w-4 h-4"/> Share</button>
            </div>
            
            <div className="flex items-center gap-8">
              {/* Savings */}
              {savedAmount > 0 && (
                <div className="text-[#2E7D32] font-bold text-sm hidden md:block">
                  You save ${savedAmount.toFixed(2)}.
                </div>
              )}
              
              {/* Totals */}
              <div className="flex flex-col text-sm min-w-[200px]">
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-muted">Monthly</span>
                   <span className="font-bold">${(discountedMonthly * quantity).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-muted">One-Time</span>
                   <span className="font-bold">${(oneTimeTotal).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center font-bold">
                   <div className="flex flex-col">
                     <span className="text-foreground">Due Today</span>
                     <span className="text-[10px] font-normal text-muted">Prepaid {term} Months</span>
                   </div>
                   <span className="text-lg">${dueToday.toFixed(2)}</span>
                 </div>
              </div>

              {/* Next Button */}
              <button 
                type="submit" 
                form={step === 1 ? "config-form" : "personal-form"}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-3 bg-accent hover:opacity-90 disabled:opacity-50 text-white dark:text-background px-10 py-4 font-mono text-lg font-bold uppercase rounded-xl transition-all duration-300 shadow-lg shadow-accent/20"
              >
                {isSubmitting ? "..." : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
