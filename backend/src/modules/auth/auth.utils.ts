import { PlanInterval } from "@/generated/prisma/enums";
import { ApiError } from "@/shared/utils";

export function calculatePlanEndDate(
  startDate: Date,
  intervalType: PlanInterval,
  intervalValue: number,
): Date {
  if (intervalValue <= 0) {
    throw new ApiError(400, "Invalid subscription plan duration");
  }

  const endDate = new Date(startDate);

  switch (intervalType) {
    case PlanInterval.DAYS:
      endDate.setDate(endDate.getDate() + intervalValue);
      return endDate;

    case PlanInterval.MONTHS: {
      const originalDay = endDate.getDate();

      // Move to the first day of the target month first.
      endDate.setDate(1);
      endDate.setMonth(endDate.getMonth() + intervalValue);

      // Last day of target month.
      const lastDayOfTargetMonth = new Date(
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        0,
      ).getDate();

      endDate.setDate(Math.min(originalDay, lastDayOfTargetMonth));

      return endDate;
    }

    default:
      throw new ApiError(400, "Invalid subscription plan interval");
  }
}
