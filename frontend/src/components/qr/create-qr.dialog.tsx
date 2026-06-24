"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QrCode, Link2, Ban, Sparkles } from "lucide-react"; // Cute, contextual icons

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { createQR, updateQr } from "@/services/qr.service";
import { createQRSchema, CreateQRForm } from "./create-qr.schema";

interface QR {
  id: string;
  name: string;
  destinationUrl: string;
  scanLimit?: number;
}

interface QRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qr?: QR | null;
}

export function QRDialog({ open, onOpenChange, qr }: QRDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!qr;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateQRForm>({
    resolver: zodResolver(createQRSchema),
    defaultValues: {
      name: "",
      destinationUrl: "",
      scanLimit: undefined,
    },
  });

  useEffect(() => {
    if (qr) {
      reset({
        name: qr.name,
        destinationUrl: qr.destinationUrl,
        scanLimit: qr.scanLimit,
      });
    } else {
      reset({
        name: "",
        destinationUrl: "",
        scanLimit: undefined,
      });
    }
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
        isEdit ? "QR updated successfully" : "QR created successfully",
      );
      queryClient.invalidateQueries({
        queryKey: ["qrs"],
      });
      reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          `Failed to ${isEdit ? "update" : "create"} QR`,
      );
    },
  });

  function onSubmit(values: CreateQRForm) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden border-border/60 bg-card/95 backdrop-blur-md shadow-2xl transition-all duration-300">
        {/* Subtle decorative glow behind content */}
        <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        
        <DialogHeader className="relative pb-2">
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
              <QrCode className="h-5 w-5 animate-pulse" />
            </span>
            <div className="flex flex-col items-start gap-0.5">
              <span>{isEdit ? "Edit QR Code" : "Create QR Code"}</span>
              <span className="text-xs font-normal text-muted-foreground/80 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary/70" />
                {isEdit ? "Modify your aesthetic routing link" : "Generate a beautiful dynamic scan routing"}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative pt-2">
          {/* QR Code Identifier Field */}
          <Field className="space-y-1.5">
            <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 flex items-center gap-1.5">
              <QrCode className="h-3.5 w-3.5 text-primary/60" /> Name
            </FieldLabel>
            <div className="relative group">
              <Input
                placeholder="e.g., My Magic Link"
                disabled={mutation.isPending}
                className="h-11 bg-background/50 border-border/80 focus-visible:ring-primary/40 focus-visible:border-primary rounded-xl transition-all duration-200"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <FieldError className="text-xs text-destructive animate-in fade-in-50 slide-in-from-top-1">
                {errors.name.message}
              </FieldError>
            )}
          </Field>

          {/* Destination Field */}
          <Field className="space-y-1.5">
            <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5 text-primary/60" /> Destination URL
            </FieldLabel>
            <Input
              placeholder="https://example.com"
              disabled={mutation.isPending}
              className="h-11 bg-background/50 border-border/80 focus-visible:ring-primary/40 focus-visible:border-primary rounded-xl transition-all duration-200 font-mono text-sm"
              {...register("destinationUrl")}
            />
            {errors.destinationUrl && (
              <FieldError className="text-xs text-destructive animate-in fade-in-50 slide-in-from-top-1">
                {errors.destinationUrl.message}
              </FieldError>
            )}
          </Field>

          {/* Optional Scan Limits Field */}
          <Field className="space-y-1.5">
            <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 flex items-center gap-1.5">
              <Ban className="h-3.5 w-3.5 text-primary/60" /> Scan Limit <span className="text-[10px] lowercase text-muted-foreground/60">(optional)</span>
            </FieldLabel>
            <Input
              type="number"
              placeholder="Unlimited scans"
              disabled={mutation.isPending}
              className="h-11 bg-background/50 border-border/80 focus-visible:ring-primary/40 focus-visible:border-primary rounded-xl transition-all duration-200"
              {...register("scanLimit", {
                valueAsNumber: true,
              })}
            />
            {errors.scanLimit && (
              <FieldError className="text-xs text-destructive animate-in fade-in-50 slide-in-from-top-1">
                {errors.scanLimit.message}
              </FieldError>
            )}
          </Field>

          {/* Action Footer */}
          <div className="flex justify-end gap-3 pt-3 border-t border-border/30">
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 px-5"
            >
              Cancel
            </Button>

            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="rounded-xl font-medium shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:opacity-90 active:scale-98 transition-all duration-200 px-6"
            >
              {mutation.isPending ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isEdit ? "Updating..." : "Creating..."}
                </div>
              ) : isEdit ? (
                "Update QR"
              ) : (
                "Create QR"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}