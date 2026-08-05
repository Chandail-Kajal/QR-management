/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Toolbar } from "@/components/toolbar";
import { useEffect, useState } from "react";
import {
    useCreateSubPlan,
    useDeleteSubPlan,
    useUpdateSubPlan,
    useSubPlans
} from "@/hooks/use-sub-plans"
import { DataTableColumn, DataTable } from "@/components/data-table";
import { Edit, Trash2, ShieldCheck, Zap } from "lucide-react";
import { useDebounce } from "use-debounce";
import { ActionsDropdown } from "@/components/table-action-dropdown";
import { TSubPlanDTO } from "@/types/sub-plan.types";
import { toast } from "sonner";
import { SubPlanDialog } from "./sub-plan-dialog";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";


export default function SubPlanManagement() {
    const [open, setOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [debouncedSearch] = useDebounce(search, 500);

    const { data, isLoading } = useSubPlans(page, limit);

    const {
        mutate: createSubPlan,
        isPending: creatingPlan,
        isSuccess: createPlanSuccess,
        error: createPlanError,
    } = useCreateSubPlan();

    const {
        mutate: updateSubPlan,
        isPending: updatingPlan,
        isSuccess: updatePlanSuccess,
        error: updatePlanError,
    } = useUpdateSubPlan();

    const {
        mutate: deleteSubPlan,
        isSuccess: deletePlanSuccess,
        error: deletePlanError,
    } = useDeleteSubPlan();

    const [editingId, setEditingId] = useState<number | undefined>(undefined);
    const [editValues, setEditValues] = useState<TSubPlanDTO | null>(null);

    // Sync editing selection to modal state
    const handleEdit = (plan: TSubPlanDTO) => {
        setEditingId(plan.id);
        setEditValues(plan);
        setOpen(true);
    };

    const handleCreate = () => {
        setEditingId(undefined);
        setEditValues(null);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setEditValues(null);
        setEditingId(undefined);
        setOpen(false);
    };

    // Feedback notifications
    useEffect(() => {
        if (createPlanSuccess) {
            toast.success("Subscription Plan created successfully");
            handleCloseDialog();
        }
        if (createPlanError) {
            toast.error("Failed to create plan");
        }
    }, [createPlanSuccess, createPlanError]);

    useEffect(() => {
        if (updatePlanSuccess) {
            toast.success("Subscription Plan updated successfully");
            handleCloseDialog();
        }
        if (updatePlanError) {
            toast.error("Failed to update plan");
        }
    }, [updatePlanSuccess, updatePlanError]);

    const columns: DataTableColumn<TSubPlanDTO>[] = [
        {
            label: "Plan Name",
            dataIndex: "name",
            className: "pl-5 font-medium",
            render: (name, record) => (
                <div className="flex items-center gap-2">
                    <span>{name}</span>
                    {record.isFree && (
                        <div className="text-xs font-semibold border border-primary bg-primary/5 text-primary rounded-full px-2 py-0.5">
                            Free
                        </div>
                    )}
                </div>
            ),
        },
        {
            label: "Price",
            dataIndex: "price",
            render: (price, record) => (
                <span className="font-semibold">
                    {record.isFree ? "Free" : `${record.currency} ${price}`}
                </span>
            ),
        },
        {
            label: "Interval",
            dataIndex: "intervalValue",
            render: (val, record) => (
                <span className="text-xs text-text-secondary">
                    Every {val} {record.intervalType.toLowerCase()}
                </span>
            ),
        },
        {
            label: "QR Types Allowed",
            dataIndex: "allowedQRTypes",
            render: (_, row) => {
                const arr = row.allowedQRTypes
                console.log(arr[0]);
                if (!arr || arr?.length === 0) return <div>No type</div>

                return <div className="flex flex-wrap gap-1">
                    {arr?.slice(0, 2).map((t) => (
                        <Badge key={t} variant="outline" className="text-[10px] border-info text-info flex items-center justify-center">
                            {t}
                        </Badge>
                    ))}
                    {arr?.length > 2 && (
                        <span className="text-xs text-text-secondary">
                            +{arr.length - 2} more
                        </span>
                    )}
                </div>
            }
        },
        {
            label: "Status",
            dataIndex: "isActive",
            render: (isActive: boolean) => (
                <div className={clsx("border px-4 py-0.5 rounded-full w-fit font-medium", isActive ? "bg-success/5 border-success text-success" : "bg-error/5 border-error text-error")}>
                    {isActive ? "Active" : "Inactive"}
                </div>
            ),
        },
        {
            label: "Actions",
            dataIndex: "id",
            render: (_, record) => (
                <div className="flex flex-row gap-2 items-center justify-end">
                    <ActionsDropdown
                        actions={[
                            {
                                label: "Edit Plan",
                                icon: <Edit className="w-4 h-4 text-warning" />,
                                onClick: () => handleEdit({ ...record, description: '' }),
                            },
                            {
                                label: "Delete Plan",
                                icon: <Trash2 className="w-4 h-4 text-error" />,
                                onClick: () => {
                                    if (confirm("Are you sure you want to delete this plan?")) {
                                        deleteSubPlan(record.id);
                                    }
                                },
                            },
                        ]}
                    />
                </div>
            ),
        },
    ];

    const paginationInfo = {
        page: page,
        limit: limit,
        totalItems: data?.pagination?.totalItems ?? data?.items?.length ?? 0,
        totalPages: data?.pagination?.totalPages ?? 1,
    };

    const emptyStatePlaceholder = (
        <div className="relative overflow-hidden rounded-xl bg-surface p-12 text-center flex flex-col items-center justify-center min-h-70 group">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl mb-4 bg-background-secondary border border-border text-secondary transition-transform duration-200 group-hover:scale-105">
                <Zap className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h3 className="text-text text-sm font-semibold tracking-tight mb-1.5">
                No subscription plans created
            </h3>
            <p className="text-text-secondary text-xs max-w-60 leading-relaxed">
                Create your first plan to start offering subscriptions to users.
            </p>
        </div>
    );

    return (
        <main className="flex-1 transition-colors duration-150 flex flex-col gap-4 pb-20">
            <Toolbar
                onCreate={handleCreate}
                createLabel="Add Plan" searchQuery={""}
            />

            <DataTable
                columns={columns}
                data={data?.items ?? []}
                pagination={paginationInfo}
                onNext={setPage}
                onPrev={setPage}
                onLimitChange={setLimit}
                emptyState={emptyStatePlaceholder}
            />

            <SubPlanDialog
                open={open}
                onOpenChange={handleCloseDialog}
                mode={editingId ? "edit" : "create"}
                initialValues={
                    editValues
                        ? {
                            name: editValues.name,
                            description: editValues.description,
                            isFree: editValues.isFree,
                            isActive: editValues.isActive,
                            price: editValues.price,
                            currency: editValues.currency,
                            intervalType: editValues.intervalType,
                            intervalValue: editValues.intervalValue,
                            maxQRCodes: editValues.maxQRCodes,
                            maxTotalScans: editValues.maxTotalScans,
                            maxScansPerQR: editValues.maxScansPerQR,
                            maxFolders: editValues.maxFolders,
                            maxQRsPerFolder: editValues.maxQRsPerFolder,
                            maxFileUploads: editValues.maxFileUploads,
                            maxFileSizeMb: editValues.maxFileSizeMb,
                            maxCampaigns: editValues.maxCampaigns,
                            allowedQRTypes: editValues.allowedQRTypes ?? [],
                            analyticsHistoryDays: editValues.analyticsHistoryDays,
                            allowPasswordProtection: editValues.allowPasswordProtection ?? false,
                        }
                        : {
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
                        }
                }
                onSubmit={(values) => {
                    if (editingId) {
                        updateSubPlan({
                            editingId,
                            ...values,
                        });
                    } else {
                        createSubPlan(values);
                    }
                }}
            />
        </main>
    );
}