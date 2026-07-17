'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  // Navigation & Dropdown States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Interactive Customizer Engine States
  const [selectedType, setSelectedType] = useState('Website QR Code');
  const [qrInput, setQrInput] = useState('https://promo-summer-2026.io');
  const [primaryColor, setPrimaryColor] = useState('#a855f7'); // default Purple accent
  const [isCompiling, setIsCompiling] = useState(false);

  const qrFeatures = [
    { name: 'Website QR Code', desc: 'Direct users to any landing page or URL instantly.', icon: '🌐', placeholder: 'https://example.com' },
    { name: 'Google Review QR Code', desc: 'Boost your business ratings and online presence.', icon: '⭐', placeholder: 'https://g.page/r/your-business/review' },
    { name: 'WhatsApp QR Code', desc: 'Initiate customer chats and support loops instantly.', icon: '💬', placeholder: 'https://wa.me/1234567890' },
    { name: 'PDF QR Code', desc: 'Share menus, digital brochures, and ebooks seamlessly.', icon: '📄', placeholder: 'https://storage.com/menu.pdf' },
    { name: 'Contact (vCard) QR Code', desc: 'Save digital business cards directly to mobile contacts.', icon: '📇', placeholder: 'BEGIN:VCARD...' },
    { name: 'Social Media QR Code', desc: 'Connect all your social profiles under a single scan.', icon: '📱', placeholder: 'https://linktr.ee/username' },
    { name: 'Email QR Code', desc: 'Pre-populate subject lines and messages for quick inquiries.', icon: '✉️', placeholder: 'mailto:info@domain.com?subject=Hello' },
    { name: 'Phone Call QR Code', desc: 'Connect clients to your sales or support lines immediately.', icon: '📞', placeholder: 'tel:+1234567890' },
  ];

  // Live Terminal Analytics Simulated States
  const [simulatedScans, setSimulatedScans] = useState([
    { id: 1, route: '/promo-summer-2026', scans: 78210, type: 'Website', status: 'Active' },
    { id: 2, route: '/google-review-main', scans: 45110, type: 'Review', status: 'Active' },
    { id: 3, route: '/whatsapp-support-node', scans: 25600, type: 'WhatsApp', status: 'Paused' },
  ]);

  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;

    setIsCompiling(true);
    setTimeout(() => {
      const match = qrFeatures.find(f => f.name === selectedType);
      const newScan = {
        id: Date.now(),
        route: qrInput.length > 25 ? qrInput.substring(0, 22) + '...' : qrInput,
        type: match ? match.name.split(' ')[0] : 'Custom',
        scans: 0,
        status: 'Active'
      };
      setSimulatedScans([newScan, ...simulatedScans]);
      setIsCompiling(false);
    }, 600);
  };

  const toggleStatus = (id: number) => {
    setSimulatedScans(simulatedScans.map(item => 
      item.id === id ? { ...item, status: item.status === 'Active' ? 'Paused' : 'Active' } : item
    ));
  };

  const currentPlaceholder = qrFeatures.find(f => f.name === selectedType)?.placeholder || '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between antialiased selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* ================= HEADER NAVIGATION ================= */}
      <header className="border-b border-slate-900 bg-slate-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-gradient-to-br from-purple-600 via-fuchsia-500 to-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl tracking-wider shadow-md shadow-purple-500/20 text-white">
              QR
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Smart QR <span className="text-purple-400 font-light">& Analytics</span>
            </span>
          </div>
          
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-300 items-center">
            {/* Interactive Features Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                className="hover:text-purple-400 transition flex items-center gap-1 py-2 focus:outline-none text-slate-300"
              >
                Features
                <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] rounded-xl bg-slate-950 border border-slate-900 shadow-2xl p-4 grid grid-cols-2 gap-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {qrFeatures.map((feature, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedType(feature.name)}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-900 transition group text-left w-full"
                    >
                      <span className="text-xl bg-slate-950 p-1.5 rounded-md border border-slate-900 group-hover:bg-purple-950/50 transition">{feature.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-purple-400 transition">{feature.name}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{feature.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a href="#analytics" className="hover:text-purple-400 transition">Analytics</a>
            <a href="#dynamic-features" className="hover:text-purple-400 transition">QR Formats</a>
          </nav>

          <div>
            <Link 
              href="/login" 
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-sm font-semibold text-white shadow-md shadow-purple-900/20 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Log In
            </Link>
          </div>
        </div>
      </header>

      {/* ================= MAIN SaaS LAYOUT ================= */}
      <main className="flex-grow bg-slate-950">
        
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center bg-slate-950">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-900 text-xs font-medium text-purple-400 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
            <span>Enterprise-Grade QR SaaS Engine</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Smart QR & Analytics Platform <br />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent text-3xl md:text-5xl font-bold">
              SaaS-Based Management Solution
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Create, manage, and monitor high-performance dynamic QR codes from a centralized dashboard. 
            Track scan interactions in real-time to convert offline audience engagement into clean, 
            actionable customer insights.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:opacity-90 shadow-lg shadow-purple-950/50 transition-all duration-200 text-center text-sm uppercase tracking-wider"
            >
              Create Account Free
            </Link>
            <a 
              href="#dynamic-features" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-950 hover:bg-slate-900 font-semibold text-slate-200 border border-slate-900 transition text-center text-sm uppercase tracking-wider"
            >
              Explore Capabilities
            </a>
          </div>
        </section>

        {/* DYNAMIC FEATURES GRID */}
        <section id="dynamic-features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900 bg-slate-950">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Supported QR Code Configurations</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">Deploy tailored offline-to-digital touchpoints for physical marketing campaigns, digital products, events, and business assets.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Grid: Features Interactive Selector Cards */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {qrFeatures.map((feat, idx) => {
                const isSelected = selectedType === feat.name;
                return (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setSelectedType(feat.name);
                      setQrInput('');
                    }}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                      isSelected 
                        ? 'bg-gradient-to-br from-slate-950 via-slate-950 to-purple-950/20 border-purple-500 shadow-lg shadow-purple-950/20 scale-[1.02]' 
                        : 'bg-slate-950 border-slate-900 hover:border-purple-500/40 hover:bg-slate-900/40'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-transparent to-indigo-600/5 opacity-60 pointer-events-none" />
                    )}
                    <div>
                      <div className={`text-3xl mb-4 w-12 h-12 flex items-center justify-center rounded-xl border transition-all ${
                        isSelected 
                          ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-transparent' 
                          : 'bg-slate-950 border-slate-900 text-slate-200 group-hover:scale-105'
                      }`}>{feat.icon}</div>
                      <h3 className={`text-base font-bold mb-2 transition-colors ${isSelected ? 'text-purple-400' : 'text-slate-200'}`}>{feat.name}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-900/60">
                      <Link href="/login" className="text-purple-400 hover:text-purple-300 text-xs font-semibold inline-flex items-center gap-1 group/link">
                        Generate Code 
                        <span className="transform group-hover/link:translate-x-0.5 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Box: COMPLETE SINGLE PAYLOAD PARAMETERS & VISUAL PREVIEW CARD */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-2xl sticky top-24 space-y-6">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-950/5 via-transparent to-transparent opacity-60 pointer-events-none" />
              
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">// Payload Settings Panel</div>
                <h3 className="text-lg font-bold text-white uppercase mt-1">Matrix Generation Desk</h3>
                <p className="text-xs text-slate-400 mt-1">Adjust payload routing properties and nodes inside this terminal block.</p>
              </div>

              <form onSubmit={handleCreateCode} className="space-y-4 relative z-10">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Destination Variable Input ({selectedType})
                  </label>
                  <input 
                    type="text"
                    required
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    placeholder={currentPlaceholder}
                    className="w-full bg-slate-950 border border-slate-900 focus:border-purple-500 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 transition font-mono shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Node Color Modifiers
                  </label>
                  <div className="flex gap-2">
                    {['#a855f7', '#6366f1', '#d946ef', '#06b6d4'].map((color) => (
                      <button
                        type="button"
                        key={color}
                        onClick={() => setPrimaryColor(color)}
                        style={{ border: primaryColor === color ? `2px solid ${color}` : '2px solid rgb(15 23 42)' }}
                        className="p-1 rounded-lg bg-slate-950 transition hover:scale-105"
                      >
                        <div className="w-5 h-5 rounded" style={{ backgroundColor: color }} />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCompiling}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white font-bold font-mono text-xs uppercase tracking-widest transition shadow-md"
                >
                  {isCompiling ? 'Compiling Code Arrays...' : 'Compile Parameter Matrix'}
                </button>
              </form>

              <div className="border-t border-slate-900 pt-6 flex flex-col items-center justify-center relative z-10">
                <div className="p-4 bg-white rounded-xl shadow-2xl relative">
                  <div className="absolute inset-x-4 top-4 h-0.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 animate-bounce opacity-80" />
                  <svg className="w-32 h-32 opacity-95 transition-colors duration-300" viewBox="0 0 100 100" fill="currentColor" style={{ color: primaryColor }}>
                    <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                    <path d="M40,10 h10 v10 h-10 z M55,0 h10 v10 h-10 z M45,25 h15 v5 h-15 z M35,40 h10 v20 h-10 z M55,45 h20 v10 h-20 z M80,40 h15 v10 h-15 z" />
                    <path d="M45,70 h10 v15 h-10 z M60,85 h25 v10 h-25 z M90,75 h10 v20 h-10 z M75,65 h10 v10 h-10 z M35,80 h5 v10 h-5 z" />
                  </svg>
                </div>
                <p className="text-[10px] font-mono text-slate-500 mt-3 break-all max-w-[280px]">
                  Target URI UUID: <span className="text-slate-300 font-semibold">{qrInput || 'Null'}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE ANALYTICS SHOWCASE */}
        <section id="analytics" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900 bg-slate-950">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Core Analytics Suite</div>
              <h2 className="text-3xl font-bold text-white mb-6 leading-tight">Turn scans into metrics. Measure performance instantly.</h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                With comprehensive scan tracking and user engagement insights, businesses can monitor QR code usage, analyze customer interactions, measure campaign effectiveness, and make data-driven decisions.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-purple-400 text-sm mt-0.5">✔</div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Real-time Attribution Loops</h4>
                    <p className="text-xs text-slate-400">Track clicks, devices, geographic coordinates, and browser variations instantly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-purple-400 text-sm mt-0.5">✔</div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Centralized Dashboard</h4>
                    <p className="text-xs text-slate-400">Organize marketing operations cleanly, group QR components, and pull clean analytics files.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Mockup Representation */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-900 p-6 shadow-2xl rounded-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-fuchsia-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-indigo-500/80"></div>
                  <span className="text-xs text-slate-500 ml-2 font-mono">dashboard_preview.io</span>
                </div>
                <span className="text-[10px] bg-slate-950 border border-slate-900 px-2 py-0.5 rounded text-purple-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span> Live Tracking Active
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Scans</div>
                  <div className="text-xl font-bold text-white mt-1">148,920</div>
                  <div className="text-[9px] text-purple-400 mt-0.5">↑ 12% baseline increase</div>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Unique Users</div>
                  <div className="text-xl font-bold text-white mt-1">84,310</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Conversion rate 94.2%</div>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Dynamic Links</div>
                  <div className="text-xl font-bold text-white mt-1">{simulatedScans.length} Active</div>
                  <div className="text-[9px] text-indigo-400 mt-0.5">No critical errors</div>
                </div>
              </div>

              {/* Dynamic Interactive Stream Table Logs */}
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {simulatedScans.map((scan) => (
                  <div key={scan.id} className="h-9 bg-slate-950 rounded-xl border border-slate-900 w-full flex items-center justify-between px-3 text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-1.5 h-1.5 rounded-full ${scan.status === 'Active' ? 'bg-purple-500 animate-pulse' : 'bg-slate-700'}`} />
                      <span className="text-slate-300 font-bold">[{scan.type}]</span>
                      <span className="truncate">{scan.route}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span>{scan.scans.toLocaleString()} scans</span>
                      <button 
                        onClick={() => toggleStatus(scan.id)}
                        className={`px-2 py-0.5 rounded text-[9px] border transition uppercase ${
                          scan.status === 'Active' 
                            ? 'bg-purple-950/40 text-purple-400 border-purple-900/60 hover:bg-purple-900/40' 
                            : 'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {scan.status === 'Active' ? 'Halt' : 'Run'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= COMPREHENSIVE STRUCTURAL FOOTER ================= */}
      <footer className="border-t border-slate-900 bg-slate-950 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="font-bold text-slate-200 mb-4 text-xs tracking-wider uppercase">Basic Layouts</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/login" className="hover:text-purple-400 transition">Website QR Generation</Link></li>
              <li><Link href="/login" className="hover:text-purple-400 transition">Google Review Configurations</Link></li>
              <li><Link href="/login" className="hover:text-purple-400 transition">WhatsApp Auto-Routing</Link></li>
              <li><Link href="/login" className="hover:text-purple-400 transition">PDF Document Directories</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-slate-200 mb-4 text-xs tracking-wider uppercase">Advanced Layouts</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/login" className="hover:text-purple-400 transition">Contact (vCard) Architectures</Link></li>
              <li><Link href="/login" className="hover:text-purple-400 transition">Social Media Integration Profiles</Link></li>
              <li><Link href="/login" className="hover:text-purple-400 transition">Email Data Fields</Link></li>
              <li><Link href="/login" className="hover:text-purple-400 transition">Phone Call Direct Routers</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-slate-200 mb-4 text-xs tracking-wider uppercase">Platform Tools</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#analytics" className="hover:text-purple-400 transition">Real-Time Dashboards</a></li>
              <li><a href="#dynamic-features" className="hover:text-purple-400 transition">SaaS Campaign Management</a></li>
              <li><Link href="/login" className="hover:text-purple-400 transition">API and Webhook Routing</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-slate-200 mb-4 text-xs tracking-wider uppercase">SaaS Overview</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A high-performance cloud ecosystem configured to manage dynamic data parameters and verify conversion pipelines seamlessly.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs gap-4">
          <div>
            &copy; {new Date().getFullYear()} Smart QR & Analytics Platform. Powered by Next-gen SaaS Architecture. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}