/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QrCode } from "lucide-react";

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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />

            {isEdit ? "Edit QR" : "Create QR"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit, (error) => { console.error("error", error) })}
          className="space-y-5"
        >
          <div>
            <label>Name</label>

            <Input
              placeholder="QR Name"
              {...register("name")}
            />

            <p className="text-red-500 text-sm">
              {errors.name?.message}
            </p>
          </div>
          {/*  */}

          <div>
            <label>QR Type</label>

            <Select
              value={type}
              onValueChange={onTypeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {QR_TYPES.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              Scan Limit (optional)
            </Label>

            <Input
              type="number"
              placeholder="Unlimited"

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
              {...register("content.url")}
            />
          )}

          {type === "TEXT" && (
            <Input
              placeholder="Enter text"
              {...register("content.text")}
            />
          )}

          {type === "EMAIL" && (
            <div className="space-y-3">
              <Input
                placeholder="Email"
                {...register("content.email")}
              />

              <Input
                placeholder="Subject"
                {...register("content.subject")}
              />

              <Input
                placeholder="Body"
                {...register("content.body")}
              />
            </div>
          )}

          {type === "PHONE" && (
            <Input
              placeholder="+91 9876543210"
              {...register("content.phone")}
            />
          )}

          {type === "SMS" && (
            <div className="space-y-3">
              <Input
                placeholder="Phone"
                {...register("content.phone")}
              />

              <Input
                placeholder="Message"
                {...register("content.message")}
              />
            </div>
          )}

          {type === "WIFI" && (
            <div className="space-y-3">
              <Input
                placeholder="SSID"
                {...register("content.ssid")}
              />

              <Input
                placeholder="Password"
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
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="WPA">
                    WPA
                  </SelectItem>

                  <SelectItem value="WPA2">
                    WPA2
                  </SelectItem>

                  <SelectItem value="WEP">
                    WEP
                  </SelectItem>

                  <SelectItem value="NONE">
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
                {...register("content.firstName")}
              />

              <Input
                placeholder="Last Name"
                {...register("content.lastName")}
              />

              <Input
                placeholder="Phone"
                {...register("content.phone")}
              />

              <Input
                placeholder="Email"
                {...register("content.email")}
              />
            </div>
          )}

          {type === "WHATSAPP" && (
            <div className="space-y-3">
              <Input
                placeholder="Phone"
                {...register("content.phone")}
              />

              <Input
                placeholder="Message"
                {...register("content.message")}
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={mutation.isPending}
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

