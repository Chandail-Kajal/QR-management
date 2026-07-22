'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const qrFeatures = [
    { name: 'Website QR Code', icon: '🌐' },
    { name: 'Google Review QR Code', icon: '⭐' },
    { name: 'WhatsApp QR Code', icon: '💬' },
    { name: 'SMS QR Code', icon: '📩' },
    { name: 'PDF QR Code', icon: '📄' },
    { name: 'Contact (vCard) QR Code', icon: '📇' },
    { name: 'Social Media QR Code', icon: '📱' },
    { name: 'Email QR Code', icon: '✉️' },
    { name: 'Phone Call QR Code', icon: '📞' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between antialiased selection:bg-purple-500/30 selection:text-purple-200">

      {/* ================= HEADER ================= */}
      <header className="border-b border-slate-900 bg-slate-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-gradient-to-br from-purple-600 via-fuchsia-500 to-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl text-white">
              QR
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Smart QR</span>
          </div>

          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-300 items-center">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                className="hover:text-purple-400 transition flex items-center gap-1 py-2 focus:outline-none"
              >
                Features
                <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-xl bg-slate-950 border border-slate-900 shadow-2xl p-3 grid grid-cols-2 gap-1 z-50">
                  {qrFeatures.map((feature, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedType(feature.name)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-900 transition text-left"
                    >
                      <span className="text-lg">{feature.icon}</span>
                      <span className="text-xs font-medium text-slate-300">{feature.name.replace(' QR Code', '')}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a href="#dynamic-features" className="hover:text-purple-400 transition">QR Formats</a>
          </nav>

          <Link
            href="/login"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-sm font-semibold text-white transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Log In
          </Link>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-grow bg-slate-950">

        {/* HERO */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            QR codes that <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">just work</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            Create and manage dynamic QR codes in seconds, with real-time scan tracking built in.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:opacity-90 transition-all duration-200 text-center text-sm uppercase tracking-wider"
            >
              Create Account Free
            </Link>
            <a
              href="#dynamic-features"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-950 hover:bg-slate-900 font-semibold text-slate-200 border border-slate-900 transition text-center text-sm uppercase tracking-wider"
            >
              Explore Formats
            </a>
          </div>
        </section>

        {/* FEATURES */}
        <section id="dynamic-features" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-900">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 text-center">Choose a QR type</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {qrFeatures.map((feat, idx) => {
              const isSelected = selectedType === feat.name;
              return (
                <Link
                  key={idx}
                  href="/login"
                  onMouseEnter={() => setSelectedType(feat.name)}
                  onFocus={() => setSelectedType(feat.name)}
                  className={`group relative p-8 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 transform hover:-translate-y-1 hover:scale-[1.03] ${
                    isSelected
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 border-transparent text-white shadow-xl shadow-purple-950/30'
                      : 'bg-slate-950 border-slate-900 text-slate-300 hover:border-purple-500/40 hover:bg-slate-900/40'
                  }`}
                >
                  <span className="text-4xl transition-transform duration-300 group-hover:scale-110">{feat.icon}</span>
                  <span className="text-sm font-semibold leading-tight">{feat.name}</span>
                  <span className={`text-xs font-medium flex items-center gap-1 transition-opacity duration-300 ${
                    isSelected ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-purple-400'
                  }`}>
                    Get started
                    <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-white text-xs gap-4">
          <div>&copy; {new Date().getFullYear()} Smart QR. All rights reserved.</div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-purple-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-purple-400 transition">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
