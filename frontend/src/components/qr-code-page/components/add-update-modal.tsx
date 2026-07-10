"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  QrCode, Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
  UploadIcon as UploadCircle,
  LinkIcon,
  Contact,
  Mail,
  Wifi,
  MessageCircle,
  PhoneCall,
  StarIcon,
  HeartIcon,
  Folder
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createQRSchema } from "./validations";
import { QRType, TCreateQRDTO } from "@/types";
import { StepperHeader } from "./stepper";

interface QRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: TCreateQRDTO | null;
  loading?: boolean;
  onSubmit: (values: TCreateQRDTO) => Promise<void> | void;
}

// Full premium configurations mapping visual aesthetics
export const QR_TYPE_CONFIGS = [
  { id: "URL", name: "URL", icon: <LinkIcon />, desc: "Link to any website", bg: "bg-blue-50 text-blue-600" },
  { id: "VCARD", name: "vCard", icon: <Contact />, desc: "Digital contact card", bg: "bg-amber-50 text-amber-700" },
  { id: "EMAIL", name: "Email", icon: <Mail />, desc: "Pre-filled email dispatcher", bg: "bg-emerald-50 text-emerald-700" },
  { id: "WIFI", name: "WiFi", icon: <Wifi />, desc: "Auto-connect network", bg: "bg-orange-50 text-orange-700" },
  { id: "SMS", name: "SMS", icon: <MessageCircle />, desc: "Pre-filled text message", bg: "bg-rose-50 text-rose-700" },
  { id: "PHONE", name: "Phone", icon: <PhoneCall />, desc: "Direct call action", bg: "bg-lime-50 text-lime-700" },
  { id: "GOOGLE_REVIEW", name: "G. Review", icon: <StarIcon />, desc: "Google review optimization", bg: "bg-teal-50 text-teal-700" },
  { id: "WHATSAPP", name: "WhatsApp", icon: <HeartIcon />, desc: "Instant text conversation", bg: "bg-green-50 text-green-700" },
] as const;

export function QrModalForm({
  open,
  onOpenChange,
  mode,
  initialData,
  loading = false,
  onSubmit,
}: QRDialogProps) {
  const [step, setStep] = useState<number>(0);

  const [selectedFolder, setSelectedFolder] = useState<string>("Demo");
  const [qrColor, setQrColor] = useState<string>("#1E1756");
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [dotStyle, setDotStyle] = useState<string>("Square");
  const [exportSize, setExportSize] = useState<string>("600px");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createQRSchema),
    defaultValues: {
      name: "",
      type: "URL" as QRType,
      status: "ACTIVE",
      scanLimit: null,
      content: {
        url: "",
      },
    },
  });

  const type = watch("type");

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        name: "",
        type: "URL",
        status: "ACTIVE",
        scanLimit: null,
        content: { url: "" },
      });
    }
    setStep(0);
  }, [initialData, open, reset]);

  const onTypeChange = (value: QRType) => {
    setValue("type", value);
    switch (value) {
      case "URL": setValue("content", { url: "" }); break;
      case "TEXT": setValue("content", { text: "" }); break;
      case "EMAIL": setValue("content", { email: "", subject: "", body: "" }); break;
      case "PHONE": setValue("content", { phone: "" }); break;
      case "SMS": setValue("content", { phone: "", message: "" }); break;
      case "WIFI": setValue("content", { ssid: "", password: "", encryption: "WPA2" }); break;
      case "VCARD": setValue("content", { firstName: "", lastName: "", phone: "", email: "" }); break;
      case "WHATSAPP": setValue("content", { phone: "", message: "" }); break;
    }
  };

  const handleNextStep = async () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {

      const isValid = await trigger(["name", "content"]);
      if (isValid) setStep(2);
    }
  };

  const handlePrevStep = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-black/10 bg-white p-0 shadow-2xl md:max-w-3xl sm:min-h-[70vh] overflow-hidden rounded-xl flex flex-col gap-0">

        <DialogHeader className="space-y-1 px-6 py-4 border-b border-gray-100 bg-white">
          <DialogTitle className="text-gray-900 flex items-center gap-2 text-lg font-semibold">
            <QrCode className="text-indigo-600 h-5 w-5" />
            {mode === "create" ? "Create Premium QR Code" : "Update Dynamic Workspace QR"}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-xs">
            {mode === "create"
              ? "Generate a customizable, actionable dynamic workflow asset."
              : "Modify active routing structural target pathways rules."}
          </DialogDescription>
        </DialogHeader>

        <div className="w-full bg-accent/10 flex items-center justify-center py-4">
          <StepperHeader
            currentStep={step}
            onStepChange={(targetStep) => setStep(targetStep)}
            steps={[{ title: "Choose Type" }, { title: "Configure Content" }, { title: "Customize Design" }]}
          />
        </div>

        <div className="w-full px-6 py-5 flex-1 overflow-y-auto bg-white">

          {step === 0 && (
            <div className="space-y-5 animate-in fade-in-50 duration-150">
              <div>
                <h4 className="text-2xs font-bold tracking-wider text-gray-400 uppercase mb-3">Select QR Code Objective</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {QR_TYPE_CONFIGS.map((cfg) => (
                    <div
                      key={cfg.id}
                      onClick={() => onTypeChange(cfg.id as QRType)}
                      className={`border p-3 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 bg-white group hover:-translate-y-0.5 hover:shadow-sm ${type === cfg.id
                        ? "border-indigo-600 ring-2 ring-indigo-600/10 bg-indigo-50/20"
                        : "border-gray-200/80 hover:border-indigo-400"
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-inner ${cfg.bg}`}>
                        {cfg.icon}
                      </div>
                      <span className="text-xs font-semibold text-gray-900">{cfg.name}</span>
                      <p className="text-3xs text-gray-400 text-center leading-tight tracking-tight px-1">{cfg.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <h4 className="text-2xs font-bold tracking-wider text-gray-400 uppercase mb-3">Assign Workspace Folder</h4>
                <div className="flex flex-wrap gap-2">
                  {["Demo", "Business", "Social Media", "Marketing Asset"].map((folder) => (
                    <button
                      key={folder}
                      type="button"
                      onClick={() => setSelectedFolder(folder)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150 flex items-center gap-1.5 ${selectedFolder === folder
                        ? "bg-linear-to-r from-indigo-600 to-indigo-500 text-white border-transparent shadow-sm shadow-indigo-600/20"
                        : "bg-white border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600"
                        }`}
                    >
                      <span><Folder /></span> {folder}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <h4 className="text-2xs font-bold tracking-wider text-gray-400 uppercase mb-1">Target Structural Configuration</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 tracking-wide">QR Profile Display Name *</label>
                  <Input
                    placeholder="e.g. Q3 Strategic Asset Link"
                    className="h-10 border-gray-200 rounded-lg focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                    {...register("name")}
                  />
                  {errors.name && <p className="text-rose-600 text-xs mt-0.5">{errors.name.message}</p>}
                </div>

                {type === "URL" && (
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-700 tracking-wide">Routing Destination URL *</label>
                    <Input
                      placeholder="https://yourbrand.com/target-path"
                      className="h-10 border-gray-200 rounded-lg"
                      {...register("content.url")}
                    />
                    <span className="text-3xs text-gray-400 mt-0.5">Destination target pathway metadata must validate using standard security protocols TLS/HTTPS patterns.</span>
                  </div>
                )}

                {type === "EMAIL" && (
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-700 tracking-wide">Recipient Email Address *</label>
                      <Input placeholder="corporate@workspace.io" className="h-10 border-gray-200 rounded-lg" {...register("content.email")} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700 tracking-wide">Default Action Subject Line</label>
                        <Input placeholder="Inquiry from QR Vector" className="h-10 border-gray-200 rounded-lg" {...register("content.subject")} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700 tracking-wide">Pre-populated Body Context</label>
                        <Input placeholder="Type message frame..." className="h-10 border-gray-200 rounded-lg" {...register("content.body")} />
                      </div>
                    </div>
                  </div>
                )}

                {type === "WIFI" && (
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1.5 md:col-span-1">
                        <label className="text-xs font-semibold text-gray-700 tracking-wide">Network SSID *</label>
                        <Input placeholder="Office_5G_Secure" className="h-10 border-gray-200 rounded-lg" {...register("content.ssid")} />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-1">
                        <label className="text-xs font-semibold text-gray-700 tracking-wide">Passphrase Secret</label>
                        <Input type="password" placeholder="••••••••" className="h-10 border-gray-200 rounded-lg" {...register("content.password")} />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-1">
                        <label className="text-xs font-semibold text-gray-700 tracking-wide">Cipher Protection</label>
                        <Select defaultValue="WPA2" onValueChange={(v) => setValue("content.encryption", v)}>
                          <SelectTrigger className="h-10 border-gray-200 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WPA">WPA</SelectItem>
                            <SelectItem value="WPA2">WPA2</SelectItem>
                            <SelectItem value="WEP">WEP</SelectItem>
                            <SelectItem value="NONE">Unsecured (None)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {type === "VCARD" && (
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Given Name *</label>
                        <Input placeholder="Kajal" className="h-10 border-gray-200 rounded-lg" {...register("content.firstName")} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Family Name</label>
                        <Input placeholder="Chandel" className="h-10 border-gray-200 rounded-lg" {...register("content.lastName")} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Mobile Contact Vector</label>
                        <Input placeholder="+91 99999 00000" className="h-10 border-gray-200 rounded-lg" {...register("content.phone")} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Digital Mailbox</label>
                        <Input placeholder="kajal@brand.in" className="h-10 border-gray-200 rounded-lg" {...register("content.email")} />
                      </div>
                    </div>
                  </div>
                )}

                {(type === "PHONE" || type === "SMS" || type === "WHATSAPP") && (
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-700">Destination Phone Number Vector *</label>
                      <Input placeholder="+1 (555) 019-2834" className="h-10 border-gray-200 rounded-lg" {...register("content.phone")} />
                    </div>
                    {type !== "PHONE" && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Predefined Payload Message Text</label>
                        <Input placeholder="Hello, I want to request access permissions..." className="h-10 border-gray-200 rounded-lg" {...register("content.message")} />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">Hard Scan Throttling Limit</label>
                  <Input
                    type="number"
                    placeholder="No restriction thresholds (Unlimited)"
                    className="h-10 border-gray-200 rounded-lg"
                    value={watch("scanLimit") ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue("scanLimit", value === "" ? null : Number(value));
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">Fallback Routing Rule Redirect Status</label>
                  <Select defaultValue="ACTIVE" onValueChange={(v: any) => setValue("status", v)}>
                    <SelectTrigger className="h-10 border-gray-200 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Direct Live Redirect (Active)</SelectItem>
                      <SelectItem value="PAUSED">Hold Routing Rules (Paused / Inactive)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in-50 duration-150">
              <div className="space-y-4">
                <div>
                  <h4 className="text-2xs font-bold tracking-wider text-gray-400 uppercase mb-2">QR Vector Core Palette</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {["#1E1756", "#4340C4", "#0F6E56", "#D85A30", "#854F0B", "#000000"].map((color) => (
                      <div
                        key={color}
                        onClick={() => setQrColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-7 h-7 rounded-lg cursor-pointer transition-transform relative ${qrColor === color ? "scale-110 ring-2 ring-indigo-500 ring-offset-2" : "hover:scale-105"
                          }`}
                      />
                    ))}
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-7 h-7 rounded-lg border border-gray-200 cursor-pointer p-0.5 overflow-hidden"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-2xs font-bold tracking-wider text-gray-400 uppercase mb-2">Matrix Node Dot Style</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {["Square", "Dots", "Rounded", "Diamond", "Star", "Heart"].map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setDotStyle(style)}
                        className={`text-xs p-2 rounded-lg border font-medium transition-all text-center ${dotStyle === style
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs"
                          : "border-gray-200 text-gray-600 hover:bg-slate-50"
                          }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-2xs font-bold tracking-wider text-gray-400 uppercase mb-2">Export Vector Canvas Dimension</h4>
                  <div className="flex gap-2">
                    {["300px", "600px", "1200px", "SVG"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setExportSize(size)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex-1 transition-all text-center ${exportSize === size
                          ? "bg-gradient-to-b from-indigo-600 to-indigo-500 text-white border-transparent shadow-xs"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-slate-50"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-2xs font-bold tracking-wider text-gray-400 uppercase mb-1.5">Centerpiece Watermark Overlay</h4>
                  <div className="border border-dashed border-indigo-200 rounded-xl p-3 text-center cursor-pointer bg-indigo-50/20 group hover:bg-indigo-50/40 transition-colors">
                    <UploadCircle className="h-6 w-6 text-indigo-500 mx-auto mb-1 group-hover:scale-105 transition-transform" />
                    <span className="text-xs font-semibold text-indigo-700 block">Drop asset workspace logo here</span>
                    <span className="text-3xs text-gray-400">Supports transparent alpha channel PNG or SVG (Max 2MB)</span>
                  </div>
                </div>
              </div>

              {/* Right Column Real-time Live Render Preview Panel */}
              <div className="flex flex-col">
                <h4 className="text-2xs font-bold tracking-wider text-gray-400 uppercase mb-2">Live Raster Viewport</h4>
                <div className="flex-1 bg-slate-50 border border-dashed border-indigo-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3">
                  <div
                    style={{ backgroundColor: bgColor }}
                    className="w-36 h-36 rounded-2xl flex items-center justify-center border-2 border-indigo-600/10 shadow-md transition-all relative"
                  >
                    <span style={{ color: qrColor }} className="text-6xl select-none font-light">⬡</span>
                    <div className="absolute bottom-2 text-4xs font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white tracking-widest uppercase scale-90">
                      {dotStyle}
                    </div>
                  </div>
                  <p className="text-3xs text-gray-400 text-center px-4 leading-tight">
                    Rasterization modifications modify paths instantly. Real-time configuration validation pipeline status.
                  </p>
                  <div className="flex gap-1.5 w-full max-w-xs mt-1">
                    <Button type="button" variant="outline" className="h-7 text-3xs font-medium bg-white flex-1 rounded-md shadow-2xs">⬇ PNG</Button>
                    <Button type="button" variant="outline" className="h-7 text-3xs font-medium bg-white flex-1 rounded-md shadow-2xs">⬇ SVG</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        <form onSubmit={handleSubmit((data) => onSubmit(data as TCreateQRDTO))}>
          <DialogFooter className="px-8 h-20 pb-8 border-t border-gray-100 bg-slate-50 flex items-center justify-between gap-2 sm:justify-between">
            <div className="flex items-center ">
              {step > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handlePrevStep}
                  className="h-9 text-xs text-gray-600 border border-gray-200/80 hover:bg-white bg-transparent rounded-lg flex items-center gap-1.5 px-3"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-9 text-xs bg-white text-gray-700 border-gray-200 hover:bg-gray-50 rounded-lg px-4"
              >
                Cancel
              </Button>

              {step < 2 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm shadow-indigo-600/10 flex items-center gap-1 px-4"
                >
                  Next Stage <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-9 text-xs bg-linear-to-b from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold rounded-lg shadow-md shadow-indigo-600/15 flex items-center gap-1.5 px-5"
                >
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      {mode === "create" ? "Generate Vector Assets" : "Commit System Changes"}
                    </>
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  );
}