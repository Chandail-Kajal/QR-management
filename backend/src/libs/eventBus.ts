import { EventEmitter } from "events";

type EventHandler<T> = (payload: T) => void | Promise<void>;

export class EventBus<T> {
    private emitter = new EventEmitter();

    on<K extends keyof T & string>(
        event: K,
        handler: EventHandler<T[K]>
    ) {
        this.emitter.on(event, handler);
    }

    once<K extends keyof T & string>(
        event: K,
        handler: EventHandler<T[K]>
    ) {
        this.emitter.once(event, handler);
    }

    emit<K extends keyof T & string>(
        event: K,
        payload: T[K]
    ) {
        this.emitter.emit(event, payload);
    }

    off<K extends keyof T & string>(
        event: K,
        handler: EventHandler<T[K]>
    ) {
        this.emitter.off(event, handler);
    }
}
