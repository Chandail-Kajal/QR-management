/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QrCode, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
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

import { createQR, updateQr } from "@/services/qr.service";
import { createQRSchema, CreateQRForm } from "./create-qr.schema";
import { Field, FieldLabel, FieldError } from "@base-ui/react";
import { Label } from "../ui/label";

interface QRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qr?: any;
}

const QR_TYPES = [
  "URL",
  "TEXT",
  "EMAIL",
  "PHONE",
  "SMS",
  "WIFI",
  "VCARD",
  "WHATSAPP",
] as const;

// Shared dark-aesthetic class fragments
const inputClass =
  "!bg-white/[0.05] !border-white/10 !text-white/90 placeholder:!text-white/30 rounded-xl focus-visible:!ring-1 focus-visible:!ring-[#5B4FF5]/50 focus-visible:!border-[#5B4FF5]/50 transition-all duration-200";

const labelClass =
  "text-[11px] font-bold uppercase tracking-widest text-white/40 mb-1.5 block";

const selectTriggerClass =
  "w-full !bg-white/[0.05] !border-white/10 !text-white/90 rounded-xl hover:!bg-white/[0.08] focus:!ring-1 focus:!ring-[#5B4FF5]/50 focus:!border-[#5B4FF5]/50 transition-all duration-200 [&_svg]:!text-white/40";

const selectContentClass =
  "!bg-[#1B1640] !border-white/10 !text-white/80 rounded-xl shadow-xl shadow-black/50";

const selectItemClass =
  "!text-white/70 focus:!bg-[#5B4FF5]/20 focus:!text-white data-[state=checked]:!text-[#A89CFF] data-[state=checked]:font-medium rounded-lg cursor-pointer";

export function QRDialog({
  open,
  onOpenChange,
  qr,
}: QRDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!qr;

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
    }

  });

  const type = watch("type");

  useEffect(() => {
    if (qr) {
      reset(qr);
      return;
    }

    reset({
      type: "URL",
      name: "",
      content: {
        url: "",
      },
    } as CreateQRForm);
  }, [qr, reset, open]);

  const mutation = useMutation({
    mutationFn: async (data: CreateQRForm) => {
      if (isEdit && qr) {
        return updateQr(qr.id, data);
      }

      return createQR(data);
    },

    onSuccess: () => {
      toast.success(
        isEdit
          ? "QR updated successfully"
          : "QR created successfully"
      );

      queryClient.invalidateQueries({
        queryKey: ["qrs"],
      });

      onOpenChange(false);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
        "Something went wrong"
      );
    },
  });

  const onTypeChange = (value: string) => {
    setValue("type", value as any);

    switch (value) {
      case "URL":
        setValue("content", {
          url: "",
        } as any);
        break;

      case "TEXT":
        setValue("content", {
          text: "",
        } as any);
        break;

      case "EMAIL":
        setValue("content", {
          email: "",
          subject: "",
          body: "",
        } as any);
        break;

      case "PHONE":
        setValue("content", {
          phone: "",
        } as any);
        break;

      case "SMS":
        setValue("content", {
          phone: "",
          message: "",
        } as any);
        break;

      case "WIFI":
        setValue("content", {
          ssid: "",
          password: "",
          encryption: "WPA2",
        } as any);
        break;

      case "VCARD":
        setValue("content", {
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
        } as any);
        break;

      case "WHATSAPP":
        setValue("content", {
          phone: "",
          message: "",
        } as any);
        break;
    }
  };

  function onSubmit(values: CreateQRForm) {
    mutation.mutate(values);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-xl !bg-[#13102B] !border-white/10 !text-white rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Ambient glow accents */}
        <div className="absolute top-0 right-10 h-32 w-32 rounded-full bg-[#5B4FF5]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-0 h-24 w-24 rounded-full bg-[#1D9E75]/10 blur-2xl pointer-events-none" />

        <DialogHeader className="relative z-10">
          <DialogTitle className="flex items-center gap-2.5 text-white">
            <div className="h-9 w-9 rounded-xl bg-[#5B4FF5]/15 border border-[#5B4FF5]/25 text-[#A89CFF] flex items-center justify-center shadow-inner shrink-0">
              <QrCode className="h-4.5 w-4.5 stroke-[2]" />
            </div>

            <span className="text-base font-bold tracking-tight flex items-center gap-1.5">
              {isEdit ? "Edit QR" : "Create QR"}
              <Sparkles className="h-3.5 w-3.5 text-[#A89CFF]" />
            </span>
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit, (error) => { console.error("error", error) })}
          className="space-y-5 relative z-10"
        >
          <div>
            <label className={labelClass}>Name</label>

            <Input
              placeholder="QR Name"
              className={inputClass}
              {...register("name")}
            />

            <p className="text-[#FF6B6B] text-xs mt-1">
              {errors.name?.message}
            </p>
          </div>
          {/*  */}

          <div>
            <label className={labelClass}>QR Type</label>

            <Select
              value={type}
              onValueChange={onTypeChange}
            >
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue />
              </SelectTrigger>

              <SelectContent className={selectContentClass}>
                {QR_TYPES.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                    className={selectItemClass}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className={labelClass}>
              Scan Limit (optional)
            </Label>

            <Input
              type="number"
              placeholder="Unlimited"
              className={inputClass}

              value={watch("scanLimit") ?? ""}

              onChange={(e) => {
                const value = e.target.value;

                setValue(
                  "scanLimit",
                  value === ""
                    ? null
                    : Number(value)
                );
              }}
            />

          </div>

          {type === "URL" && (
            <Input
              placeholder="https://example.com"
              className={inputClass}
              {...register("content.url")}
            />
          )}

          {type === "TEXT" && (
            <Input
              placeholder="Enter text"
              className={inputClass}
              {...register("content.text")}
            />
          )}

          {type === "EMAIL" && (
            <div className="space-y-3">
              <Input
                placeholder="Email"
                className={inputClass}
                {...register("content.email")}
              />

              <Input
                placeholder="Subject"
                className={inputClass}
                {...register("content.subject")}
              />

              <Input
                placeholder="Body"
                className={inputClass}
                {...register("content.body")}
              />
            </div>
          )}

          {type === "PHONE" && (
            <Input
              placeholder="+91 9876543210"
              className={inputClass}
              {...register("content.phone")}
            />
          )}

          {type === "SMS" && (
            <div className="space-y-3">
              <Input
                placeholder="Phone"
                className={inputClass}
                {...register("content.phone")}
              />

              <Input
                placeholder="Message"
                className={inputClass}
                {...register("content.message")}
              />
            </div>
          )}

          {type === "WIFI" && (
            <div className="space-y-3">
              <Input
                placeholder="SSID"
                className={inputClass}
                {...register("content.ssid")}
              />

              <Input
                placeholder="Password"
                className={inputClass}
                {...register("content.password")}
              />

              <Select
                defaultValue="WPA2"
                onValueChange={(v) =>
                  setValue(
                    "content.encryption",
                    v as any
                  )
                }
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className={selectContentClass}>
                  <SelectItem value="WPA" className={selectItemClass}>
                    WPA
                  </SelectItem>

                  <SelectItem value="WPA2" className={selectItemClass}>
                    WPA2
                  </SelectItem>

                  <SelectItem value="WEP" className={selectItemClass}>
                    WEP
                  </SelectItem>

                  <SelectItem value="NONE" className={selectItemClass}>
                    NONE
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {type === "VCARD" && (
            <div className="space-y-3">
              <Input
                placeholder="First Name"
                className={inputClass}
                {...register("content.firstName")}
              />

              <Input
                placeholder="Last Name"
                className={inputClass}
                {...register("content.lastName")}
              />

              <Input
                placeholder="Phone"
                className={inputClass}
                {...register("content.phone")}
              />

              <Input
                placeholder="Email"
                className={inputClass}
                {...register("content.email")}
              />
            </div>
          )}

          {type === "WHATSAPP" && (
            <div className="space-y-3">
              <Input
                placeholder="Phone"
                className={inputClass}
                {...register("content.phone")}
              />

              <Input
                placeholder="Message"
                className={inputClass}
                {...register("content.message")}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-white/10 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
              className="!bg-white/[0.03] !border-white/15 !text-white/60 hover:!text-white hover:!bg-white/[0.08] rounded-xl transition-all duration-200"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="!bg-[#5B4FF5] hover:!bg-[#6C5FFF] !text-white rounded-xl shadow-md shadow-[#5B4FF5]/30 transition-all duration-200 active:scale-95"
            >
              {mutation.isPending
                ? "Saving..."
                : isEdit
                  ? "Update QR"
                  : "Create QR"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
