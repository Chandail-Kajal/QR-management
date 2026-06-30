"use client";

import { useEffect } from "react";
import { FolderPlus, Loader2, Pencil } from "lucide-react";
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

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Folder name is required.")
    .max(100, "Folder name cannot exceed 100 characters."),
});

type FormValues = z.infer<typeof schema>;

interface FolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  mode: "create" | "edit";

  initialName?: string;

  loading?: boolean;

  onSubmit: (values: FormValues) => Promise<void> | void;
}

export function FolderDialog({
  open,
  onOpenChange,
  mode,
  initialName,
  loading = false,
  onSubmit,
}: FolderDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    reset({
      name: initialName ?? "",
    });
  }, [initialName, open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-border/10 bg-surface shadow-card sm:max-w-md">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-text flex items-center gap-2 text-lg font-semibold">
            {mode === "create" ? (
              <FolderPlus className="text-secondary h-5 w-5" />
            ) : (
              <Pencil className="text-secondary h-5 w-5" />
            )}
            {mode === "create" ? "Create Folder" : "Rename Folder"}
          </DialogTitle>

          <DialogDescription className="text-text-secondary">
            {mode === "create"
              ? "Create a new folder to organize your QR codes."
              : "Update the folder name."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="folder-name"
              className="text-text text-sm font-medium"
            >
              Folder Name
            </label>

            <Input
              id="folder-name"
              autoFocus
              placeholder="Marketing"
              className="border-border bg-background focus:border-secondary"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>

          <DialogFooter className="border-border mt-6 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              className={"h-10"}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" className={"h-10"} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Create Folder" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
