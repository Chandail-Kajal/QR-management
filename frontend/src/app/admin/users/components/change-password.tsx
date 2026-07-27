/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
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

const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters."),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  onSubmit: (values: ChangePasswordFormValues) => Promise<void> | void;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  loading = false,
  onSubmit,
}: ChangePasswordDialogProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Reset form and password visibility toggle whenever dialog opens/closes
  useEffect(() => {
    if (!open) {
      reset({
        password: "",
        confirmPassword: "",
      });
      setShowPassword(false);
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-border/10 bg-surface shadow-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-text flex items-center gap-2 text-lg font-semibold">
            <KeyRound className="text-secondary h-5 w-5" />
            Change Password
          </DialogTitle>

          <DialogDescription className="text-text-secondary">
            Enter a new password for this account.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="space-y-4"
        >
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
            />

            {errors.password && (
              <p className="text-destructive text-xs">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
            />

            {errors.confirmPassword && (
              <p className="text-destructive text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Show/Hide Password Checkbox */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="show-password"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="border-input h-4 w-4 rounded accent-primary cursor-pointer"
            />
            <label
              htmlFor="show-password"
              className="text-text-secondary cursor-pointer select-none text-sm flex items-center gap-1.5"
            >
              {showPassword ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
              Show password
            </label>
          </div>

          <DialogFooter className="border-border mt-6 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}