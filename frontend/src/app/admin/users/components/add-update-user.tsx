"use client";

import { useEffect } from "react";
import { Loader2, Pencil, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const createSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required.")
    .max(100, "Name cannot exceed 100 characters."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters."),

  status: z.string().default("ACTIVE"),
});

const updateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required.")
    .max(100, "Name cannot exceed 100 characters."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .optional()
    .or(z.literal("")),

  status: z.string(),
});

type CreateFormValues = z.infer<typeof createSchema>;
type UpdateFormValues = z.infer<typeof updateSchema>;

type FormValues = CreateFormValues;

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  mode: "create" | "edit";

  initialValues?: {
    name: string;
    email: string;
    status: string;
  };

  loading?: boolean;

  onSubmit: (
    values: CreateFormValues | UpdateFormValues
  ) => Promise<void> | void;
}

export function UserDialog({
  open,
  onOpenChange,
  mode,
  initialValues,
  loading = false,
  onSubmit,
}: UserDialogProps) {
  const schema = mode === "create" ? createSchema : updateSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    reset({
      name: initialValues?.name ?? "",
      email: initialValues?.email ?? "",
      password: "",
      status: initialValues?.status ?? "ACTIVE",
    });
  }, [initialValues, open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-border/10 bg-surface shadow-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-text flex items-center gap-2 text-lg font-semibold">
            {mode === "create" ? (
              <UserPlus className="text-secondary h-5 w-5" />
            ) : (
              <Pencil className="text-secondary h-5 w-5" />
            )}

            {mode === "create" ? "Create User" : "Update User"}
          </DialogTitle>

          <DialogDescription className="text-text-secondary">
            {mode === "create"
              ? "Create a new user account."
              : "Update user information."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="space-y-4"
        >
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>

            <Input
              placeholder="John Doe"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-destructive text-xs">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>

            <Input
              type="email"
              placeholder="john@example.com"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-destructive text-xs">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
         { mode =="create" && <div className="space-y-2">
            <label className="text-sm font-medium">
              Password
            </label>

            <Input
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />

            {errors.password && (
              <p className="text-destructive text-xs">
                {errors.password.message}
              </p>
            )}
          </div>}

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>

            <select
              {...register("status")}
              className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            {errors.status && (
              <p className="text-destructive text-xs">
                {errors.status.message}
              </p>
            )}
          </div>

          <DialogFooter className="border-border mt-6 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {mode === "create"
                ? "Create User"
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}