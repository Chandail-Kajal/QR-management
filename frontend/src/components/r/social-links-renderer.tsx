"use client";

import { Globe, MessageCircle, Music2, ExternalLink } from "lucide-react";
import {
  FaInstagram as Instagram,
  FaLinkedin as Linkedin,
  FaFacebook as Facebook,
  FaYoutube as Youtube,
  FaTwitter as Twitter,
} from "react-icons/fa6";

import { Card } from "@/components/ui/card";
import { SocialQRContent } from "@/types";

const SOCIAL_CONFIG = {
  instagram: {
    label: "Instagram",
    icon: Instagram,
    className: "hover:border-pink-500/50 hover:bg-pink-500/10",
  },
  facebook: {
    label: "Facebook",
    icon: Facebook,
    className: "hover:border-blue-500/50 hover:bg-blue-500/10",
  },
  linkedin: {
    label: "LinkedIn",
    icon: Linkedin,
    className: "hover:border-blue-400/50 hover:bg-blue-400/10",
  },
  youtube: {
    label: "YouTube",
    icon: Youtube,
    className: "hover:border-red-500/50 hover:bg-red-500/10",
  },
  tiktok: {
    label: "TikTok",
    icon: Music2,
    className: "hover:border-cyan-400/50 hover:bg-cyan-400/10",
  },
  x: {
    label: "X",
    icon: Twitter,
    className: "hover:border-white/40 hover:bg-white/10",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: MessageCircle,
    className: "hover:border-green-500/50 hover:bg-green-500/10",
  },
  website: {
    label: "Website",
    icon: Globe,
    className: "hover:border-cyan-500/50 hover:bg-cyan-500/10",
  },
} as const;

export function SocialRenderer({ content }: { content: SocialQRContent }) {
  const links = Object.entries(content.links).filter(([, url]) =>
    Boolean(url),
  ) as [keyof typeof SOCIAL_CONFIG, string][];

  return (
    <div className="bg-black flex flex-col items-center justify-start p-4 py-12">
      <div className="relative w-full max-w-md">
        {/* Ambient glow */}
        <div
          className="
            absolute inset-0
            rounded-[2.5rem]
            blur-3xl
            opacity-50
            bg-linear-to-r
            from-purple-500
            via-pink-500
            to-cyan-500
            animate-pulse
          "
        />

        <Card
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            border-white/10
            bg-black/80
            backdrop-blur-xl
            shadow-2xl
          "
        >
          {/* Shine */}
          <div
            className="
              absolute inset-0
              pointer-events-none
              bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,.12)_45%,transparent_65%)]
              animate-[shine_4s_linear_infinite]
            "
          />

          {/* Background gradient */}
          <div
            className="
              absolute inset-0
              pointer-events-none
              bg-linear-to-br
              from-fuchsia-500/20
              via-transparent
              to-cyan-500/20
            "
          />

          <div className="relative z-10 p-8">
            {/* Profile */}
            <div className="flex flex-col items-center text-center">
              <div
                className="
                  h-28 w-28
                  rounded-full
                  bg-linear-to-br
                  from-purple-500
                  via-pink-500
                  to-cyan-500
                  p-0.75
                  shadow-xl
                "
              >
                <div
                  className="
                    h-full w-full
                    rounded-full
                    bg-black
                    flex items-center justify-center
                  "
                >
                  <span className="text-4xl font-bold text-white">
                    {content.title?.charAt(0)?.toUpperCase() ?? "S"}
                  </span>
                </div>
              </div>

              <h1 className="mt-6 text-2xl font-bold text-white">
                {content.title}
              </h1>

              {content.description && (
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">
                  {content.description}
                </p>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-8 space-y-3">
              {links.map(([key, url]) => {
                const config = SOCIAL_CONFIG[key];

                if (!config) return null;

                const Icon = config.icon;

                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      group
                      flex items-center
                      gap-4
                      rounded-2xl
                      border border-white/10
                      bg-white/5
                      px-4 py-3.5
                      text-white
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:shadow-lg
                      ${config.className}
                    `}
                  >
                    <div
                      className="
                        flex
                        h-10 w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-white/10
                        text-white
                        transition-transform
                        group-hover:scale-105
                      "
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="flex-1 text-sm font-semibold">
                      {config.label}
                    </span>

                    <ExternalLink
                      className="
                        h-4 w-4
                        text-zinc-500
                        transition-all
                        group-hover:text-white
                        group-hover:translate-x-0.5
                      "
                    />
                  </a>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                Connect With Us
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}