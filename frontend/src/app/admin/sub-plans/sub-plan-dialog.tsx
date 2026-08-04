/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2, Pencil, PlusCircle, AlertCircle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
    CreateSubPlanValues,
    createSubPlanYupSchema,
    UpdateSubPlanValues,
    updateSubPlanYupSchema,
} from "./validations";

interface SubPlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    initialValues?: Partial<CreateSubPlanValues>;
    loading?: boolean;
    onSubmit: (
        values: CreateSubPlanValues | UpdateSubPlanValues
    ) => Promise<void> | void;
}

const ALL_QR_TYPES = ["URL", "TEXT", "WIFI", "VCARD", "EMAIL", "PDF", "IMAGES"];

const STEPS = [
    { id: 1, title: "Basic Info", fields: ["name", "description", "price", "currency", "intervalValue", "intervalType"] },
    { id: 2, title: "Usage Limits", fields: ["maxQRCodes", "maxTotalScans", "maxScansPerQR", "maxFolders", "maxQRsPerFolder", "maxFileUploads", "maxFileSizeMb", "maxCampaigns"] },
    { id: 3, title: "Features & Types", fields: ["analyticsHistoryDays", "allowPasswordProtection", "allowedQRTypes"] },
] as const;

export function SubPlanDialog({
    open,
    onOpenChange,
    mode,
    initialValues,
    loading = false,
    onSubmit,
}: SubPlanDialogProps) {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const schema = mode === "create" ? createSubPlanYupSchema : updateSubPlanYupSchema;

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<CreateSubPlanValues>({
        // @ts-expect-error schema type variance handled at runtime
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            description: "",
            isFree: false,
            isActive: true,
            price: 0,
            currency: "USD",
            intervalType: "MONTHS",
            intervalValue: 1,
            maxQRCodes: null,
            maxTotalScans: null,
            maxScansPerQR: null,
            maxFolders: null,
            maxQRsPerFolder: null,
            maxFileUploads: null,
            maxFileSizeMb: null,
            maxCampaigns: null,
            allowedQRTypes: [],
            analyticsHistoryDays: null,
            allowPasswordProtection: false,
        },
    });

    const isFree = watch("isFree");
    const selectedQRTypes = watch("allowedQRTypes") || [];

    // Reset step & form state when dialog opens/closes
    useEffect(() => {
        if (open) {
            setCurrentStep(1);
            reset({
                name: initialValues?.name ?? "",
                description: initialValues?.description ?? "",
                isFree: initialValues?.isFree ?? false,
                isActive: initialValues?.isActive ?? true,
                price: initialValues?.price ?? 0,
                currency: initialValues?.currency ?? "USD",
                intervalType: initialValues?.intervalType ?? "MONTHS",
                intervalValue: initialValues?.intervalValue ?? 1,
                maxQRCodes: initialValues?.maxQRCodes ?? null,
                maxTotalScans: initialValues?.maxTotalScans ?? null,
                maxScansPerQR: initialValues?.maxScansPerQR ?? null,
                maxFolders: initialValues?.maxFolders ?? null,
                maxQRsPerFolder: initialValues?.maxQRsPerFolder ?? null,
                maxFileUploads: initialValues?.maxFileUploads ?? null,
                maxFileSizeMb: initialValues?.maxFileSizeMb ?? null,
                maxCampaigns: initialValues?.maxCampaigns ?? null,
                allowedQRTypes: initialValues?.allowedQRTypes ?? [],
                analyticsHistoryDays: initialValues?.analyticsHistoryDays ?? null,
                allowPasswordProtection: initialValues?.allowPasswordProtection ?? false,
            });
        }
    }, [initialValues, open, reset]);

    // Sync price to zero if plan is free
    useEffect(() => {
        if (isFree) {
            setValue("price", 0);
        }
    }, [isFree, setValue]);

    const handleNext = async () => {
        const fieldsToValidate = STEPS[currentStep - 1].fields as unknown as (keyof CreateSubPlanValues)[];
        const isStepValid = await trigger(fieldsToValidate);

        if (isStepValid) {
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate the entire form on submission
        const isValid = await trigger();
        if (isValid) {
            handleSubmit((values) => onSubmit(values))();
        } else {
            // Find which step has errors and jump to it
            for (let i = 0; i < STEPS.length; i++) {
                const stepFields = STEPS[i].fields as unknown as (keyof CreateSubPlanValues)[];
                const hasError = stepFields.some((field) => errors[field]);
                if (hasError) {
                    setCurrentStep(i + 1);
                    break;
                }
            }
        }
    };

    const handleQRTypeToggle = (type: string, checked: boolean) => {
        if (checked) {
            setValue("allowedQRTypes", [...selectedQRTypes, type]);
        } else {
            setValue(
                "allowedQRTypes",
                selectedQRTypes.filter((item) => item !== type)
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border border-border/10 bg-surface shadow-card sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-text flex items-center gap-2 text-lg font-semibold">
                        {mode === "create" ? (
                            <PlusCircle className="text-secondary h-5 w-5" />
                        ) : (
                            <Pencil className="text-secondary h-5 w-5" />
                        )}
                        {mode === "create" ? "Create Subscription Plan" : "Edit Subscription Plan"}
                    </DialogTitle>

                    <DialogDescription className="text-text-secondary">
                        {mode === "create"
                            ? "Set up pricing, features, and quotas for a new plan."
                            : "Modify the configuration and resource limits for this plan."}
                    </DialogDescription>

                    {/* Stepper Header Progress */}
                    <div className="pt-4 pb-2">
                        <div className="flex items-center justify-between">
                            {STEPS.map((step, idx) => {
                                const isCompleted = currentStep > step.id;
                                const isCurrent = currentStep === step.id;

                                return (
                                    <div key={step.id} className="flex-1 flex items-center">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    if (step.id < currentStep) {
                                                        setCurrentStep(step.id);
                                                    } else {
                                                        const isStepValid = await trigger(
                                                            STEPS[currentStep - 1].fields as unknown as (keyof CreateSubPlanValues)[]
                                                        );
                                                        if (isStepValid) setCurrentStep(step.id);
                                                    }
                                                }}
                                                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${isCompleted
                                                    ? "bg-primary text-primary-foreground"
                                                    : isCurrent
                                                        ? "bg-primary/20 text-primary border-2 border-primary"
                                                        : "bg-muted text-muted-foreground"
                                                    }`}
                                            >
                                                {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                                            </button>
                                            <span
                                                className={`text-xs font-medium hidden sm:inline ${isCurrent ? "text-foreground font-semibold" : "text-muted-foreground"
                                                    }`}
                                            >
                                                {step.title}
                                            </span>
                                        </div>

                                        {idx < STEPS.length - 1 && (
                                            <div
                                                className={`h-[2px] flex-1 mx-3 transition-colors ${currentStep > step.id ? "bg-primary" : "bg-muted"
                                                    }`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
                    {/* Error Banner if form has hidden errors in other steps */}
                    {Object.keys(errors).length > 0 && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 text-destructive text-xs">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>Some fields have errors. Please check previous steps.</span>
                        </div>
                    )}

                    {/* STEP 1: Basic & Pricing */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Plan Name</label>
                                <Input placeholder="Pro Plan" {...register("name")} />
                                {errors.name && (
                                    <p className="text-destructive text-xs">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium">Description</label>
                                <Input
                                    placeholder="Best for small businesses and creators"
                                    {...register("description")}
                                />
                                {errors.description && (
                                    <p className="text-destructive text-xs">{errors.description.message}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-6 py-2">
                                <Controller
                                    name="isFree"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="isFree"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <label htmlFor="isFree" className="text-sm font-medium cursor-pointer">
                                                Is Free Plan
                                            </label>
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="isActive"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                                                Active
                                            </label>
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Price</label>
                                    <Input
                                        type="number"
                                        disabled={isFree}
                                        placeholder="29"
                                        {...register("price")}
                                    />
                                    {errors.price && (
                                        <p className="text-destructive text-xs">{errors.price.message}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Currency</label>
                                    <select
                                        {...register("currency")}
                                        className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="INR">INR (₹)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="JPY">JPY (¥)</option>
                                    </select>
                                    {errors.currency && (
                                        <p className="text-destructive text-xs">{errors.currency.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Interval Value</label>
                                    <Input type="number" placeholder="1" {...register("intervalValue")} />
                                    {errors.intervalValue && (
                                        <p className="text-destructive text-xs">{errors.intervalValue.message}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Interval Type</label>
                                    <select
                                        {...register("intervalType")}
                                        className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                                    >
                                        <option value="MONTHS">MONTHS</option>
                                        <option value="DAYS">DAYS</option>
                                    </select>
                                    {errors.intervalType && (
                                        <p className="text-destructive text-xs">{errors.intervalType.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Usage Limits */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <p className="text-xs text-text-secondary">
                                Leave inputs blank or set to empty for unlimited access.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Max QR Codes</label>
                                    <Input type="number" placeholder="Unlimited" {...register("maxQRCodes")} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Max Total Scans</label>
                                    <Input type="number" placeholder="Unlimited" {...register("maxTotalScans")} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Max Scans / QR</label>
                                    <Input type="number" placeholder="Unlimited" {...register("maxScansPerQR")} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Max Folders</label>
                                    <Input type="number" placeholder="Unlimited" {...register("maxFolders")} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Max QRs / Folder</label>
                                    <Input type="number" placeholder="Unlimited" {...register("maxQRsPerFolder")} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Max File Uploads</label>
                                    <Input type="number" placeholder="Unlimited" {...register("maxFileUploads")} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Max File Size (MB)</label>
                                    <Input type="number" placeholder="Unlimited" {...register("maxFileSizeMb")} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Max Campaigns</label>
                                    <Input type="number" placeholder="Unlimited" {...register("maxCampaigns")} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Features & Types */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Analytics Retention (Days)</label>
                                <Input type="number" placeholder="Unlimited" {...register("analyticsHistoryDays")} />
                            </div>

                            <div className="pt-2">
                                <Controller
                                    name="allowPasswordProtection"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="allowPasswordProtection"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <label
                                                htmlFor="allowPasswordProtection"
                                                className="text-sm font-medium cursor-pointer"
                                            >
                                                Allow Password Protection on QR Codes
                                            </label>
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="text-sm font-medium">Allowed QR Code Types</label>

                                <div className="grid grid-cols-3 gap-2 border rounded-md p-3 bg-background">
                                    {ALL_QR_TYPES.map((type) => {
                                        const isChecked = selectedQRTypes.includes(type);

                                        return (
                                            <div key={type} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`type-${type}`}
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) =>
                                                        handleQRTypeToggle(type, Boolean(checked))
                                                    }
                                                />
                                                <label
                                                    htmlFor={`type-${type}`}
                                                    className="text-xs font-medium cursor-pointer"
                                                >
                                                    {type}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}


                    <DialogFooter className="border-border mt-6 border-t pt-4 flex justify-between sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={currentStep === 1 ? () => onOpenChange(false) : handleBack}
                        >
                            {currentStep === 1 ? (
                                "Cancel"
                            ) : (
                                <>
                                    <ChevronLeft className="mr-1 h-4 w-4" /> Back
                                </>
                            )}
                        </Button>

                        {currentStep < STEPS.length ? (
                            <Button type="button" onClick={handleNext}>
                                Next <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {mode === "create" ? "Create Plan" : "Save Changes"}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}