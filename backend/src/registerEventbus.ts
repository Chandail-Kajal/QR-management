import { registerEmailSubscribers } from "@/shared/pubsub/email.subscriber";
import { logger } from "./config/logger";

let registered = false;

export function registerEventBus() {
  if (registered) return;
  registerEmailSubscribers();
  registered = true;
}