"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QrCode, Loader2 } from "lucide-react";

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

import { createQRSchema, CreateQRForm } from "./validations";
import { QRType, TCreateQRDTO } from "@/types";

interface QRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: TCreateQRDTO | null;
  loading?: boolean;
  onSubmit: (values: TCreateQRDTO) => Promise<void> | void;
}

export const QR_TYPES: QRType[] = [
  "URL",
  "TEXT",
  "EMAIL",
  "PHONE",
  "SMS",
  "WIFI",
  "VCARD",
  "WHATSAPP",
] as const;

export function QrModalForm({
  open,
  onOpenChange,
  mode,
  initialData,
  loading = false,
  onSubmit,
}: QRDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createQRSchema),
    defaultValues: {
      name: "",
      type: "URL",
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
  }, [initialData, open, reset]);

  const onTypeChange = (value: string) => {
    setValue("type", value);

    switch (value) {
      case "URL":
        setValue("content", { url: "" });
        break;
      case "TEXT":
        setValue("content", { text: "" });
        break;
      case "EMAIL":
        setValue("content", { email: "", subject: "", body: "" });
        break;
      case "PHONE":
        setValue("content", { phone: "" });
        break;
      case "SMS":
        setValue("content", { phone: "", message: "" });
        break;
      case "WIFI":
        setValue("content", {
          ssid: "",
          password: "",
          encryption: "WPA2",
        });
        break;
      case "VCARD":
        setValue("content", {
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
        });
        break;
      case "WHATSAPP":
        setValue("content", { phone: "", message: "" });
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-border/10 bg-surface shadow-card sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-text flex items-center gap-2 text-lg font-semibold">
            <QrCode className="text-secondary h-5 w-5" />
            {mode === "create" ? "Create QR Code" : "Update QR Code"}
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            {mode === "create"
              ? "Generate a customizable dynamic QR code profile."
              : "Modify settings and structural contents of your QR code."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => onSubmit(data as CreateQRForm))}
          className="space-y-4"
        >
          {/* QR Code Identification Name */}
          <div className="space-y-1.5">
            <label htmlFor="qr-name" className="text-text text-sm font-medium">
              Name
            </label>
            <Input
              id="qr-name"
              placeholder="Campaign Tracking Link"
              className="border-border bg-background focus:border-secondary"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-danger text-xs">{errors.name.message}</p>
            )}
          </div>

          {/* QR Profile Content Type Configuration */}
          <div className="space-y-1.5">
            <label className="text-text text-sm font-medium">QR Type</label>
            <Select
              value={type}
              onValueChange={(val) => onTypeChange(val as string)}
            >
              <SelectTrigger className="border-border bg-background focus:border-secondary w-full text-left">
                <SelectValue placeholder="Select context" />
              </SelectTrigger>
              <SelectContent className="bg-surface border border-border">
                {QR_TYPES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional Scan Counter Threshold Limits */}
          <div className="space-y-1.5">
            <label
              htmlFor="scan-limit"
              className="text-text text-sm font-medium"
            >
              Scan Limit{" "}
              <span className="text-text-muted text-xs font-normal">
                (optional)
              </span>
            </label>
            <Input
              id="scan-limit"
              type="number"
              placeholder="Unlimited"
              className="border-border bg-background focus:border-secondary"
              value={watch("scanLimit") ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setValue("scanLimit", value === "" ? null : Number(value));
              }}
            />
          </div>

          {type === "URL" && (
            <div className="space-y-1.5 pt-1">
              <label className="text-text text-sm font-medium">
                Target URL
              </label>
              <Input
                placeholder="https://example.com"
                className="border-border bg-background focus:border-secondary"
                {...register("content.url")}
              />
            </div>
          )}

          {type === "TEXT" && (
            <div className="space-y-1.5 pt-1">
              <label className="text-text text-sm font-medium">
                Plain Text Content
              </label>
              <Input
                placeholder="Enter string content"
                className="border-border bg-background focus:border-secondary"
                {...register("content.text")}
              />
            </div>
          )}

          {type === "EMAIL" && (
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-text text-sm font-medium">
                Email Setup
              </label>
              <Input
                placeholder="recipient@domain.com"
                className="border-border bg-background focus:border-secondary"
                {...register("content.email")}
              />
              <Input
                placeholder="Subject Line"
                className="border-border bg-background focus:border-secondary"
                {...register("content.subject")}
              />
              <Input
                placeholder="Pre-filled Body Text"
                className="border-border bg-background focus:border-secondary"
                {...register("content.body")}
              />
            </div>
          )}

          {type === "PHONE" && (
            <div className="space-y-1.5 pt-1">
              <label className="text-text text-sm font-medium">
                Phone Number
              </label>
              <Input
                placeholder="+1 (555) 000-0000"
                className="border-border bg-background focus:border-secondary"
                {...register("content.phone")}
              />
            </div>
          )}

          {type === "SMS" && (
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-text text-sm font-medium">
                SMS Dispatcher
              </label>
              <Input
                placeholder="Phone Number"
                className="border-border bg-background focus:border-secondary"
                {...register("content.phone")}
              />
              <Input
                placeholder="Message Content"
                className="border-border bg-background focus:border-secondary"
                {...register("content.message")}
              />
            </div>
          )}

          {type === "WIFI" && (
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-text text-sm font-medium">
                Network Settings
              </label>
              <Input
                placeholder="Network SSID Name"
                className="border-border bg-background focus:border-secondary"
                {...register("content.ssid")}
              />
              <Input
                placeholder="Security Passphrase"
                type="password"
                className="border-border bg-background focus:border-secondary"
                {...register("content.password")}
              />
              <Select
                defaultValue="WPA2"
                onValueChange={(v) => setValue("content.encryption", v)}
              >
                <SelectTrigger className="border-border bg-background focus:border-secondary w-full text-left">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border border-border">
                  <SelectItem value="WPA">WPA</SelectItem>
                  <SelectItem value="WPA2">WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="NONE">NONE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {type === "VCARD" && (
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-text text-sm font-medium">
                Contact Details (vCard)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="First Name"
                  className="border-border bg-background focus:border-secondary"
                  {...register("content.firstName")}
                />
                <Input
                  placeholder="Last Name"
                  className="border-border bg-background focus:border-secondary"
                  {...register("content.lastName")}
                />
              </div>
              <Input
                placeholder="Phone"
                className="border-border bg-background focus:border-secondary"
                {...register("content.phone")}
              />
              <Input
                placeholder="Email Address"
                className="border-border bg-background focus:border-secondary"
                {...register("content.email")}
              />
            </div>
          )}

          {type === "WHATSAPP" && (
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-text text-sm font-medium">
                WhatsApp Dispatch
              </label>
              <Input
                placeholder="Recipient Phone Number"
                className="border-border bg-background focus:border-secondary"
                {...register("content.phone")}
              />
              <Input
                placeholder="Predefined message body text"
                className="border-border bg-background focus:border-secondary"
                {...register("content.message")}
              />
            </div>
          )}

          {/* Standardized Form Actions Layer Footer */}
          <DialogFooter className="border-border mt-6 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Create QR Code" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
