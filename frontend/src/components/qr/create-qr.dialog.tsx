"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { createQR } from "@/services/qr.service";
import { createQRSchema, CreateQRForm } from "./create-qr.schema";

interface CreateQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateQRDialog({ open, onOpenChange }: CreateQRDialogProps) {
  const queryClient = useQueryClient();

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

  const mutation = useMutation({
    mutationFn: createQR,
    onSuccess: () => {
      toast.success("QR created successfully");
      queryClient.invalidateQueries({
        queryKey: ["qrs"],
      });
      reset(); // Clear form fields
      onOpenChange(false); // Close dialog
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to create QR");
    },
  });

  function onSubmit(values) {
    mutation.mutate({
      name: values.name,
      destinationUrl: values.destinationUrl,
      scanLimit: values.scanLimit,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create QR Code</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input
              placeholder="Website QR"
              disabled={mutation.isPending}
              {...register("name")}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          {/* Destination URL Field */}
          <Field>
            <FieldLabel>Destination URL</FieldLabel>
            <Input
              placeholder="https://example.com"
              disabled={mutation.isPending}
              {...register("destinationUrl")}
            />
            {errors.destinationUrl && (
              <FieldError>{errors.destinationUrl.message}</FieldError>
            )}
          </Field>

          {/* Scan Limit Field */}
          <Field>
            <FieldLabel>Scan Limit (optional)</FieldLabel>
            <Input
              type="number"
              placeholder="Unlimited"
              disabled={mutation.isPending}
              {...register("scanLimit")}
            />
            {errors.scanLimit && (
              <FieldError>{errors.scanLimit.message}</FieldError>
            )}
          </Field>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create QR"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
