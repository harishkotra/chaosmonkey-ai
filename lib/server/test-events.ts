export type StreamEvent = {
  type: "log" | "status" | "assertion" | "artifact";
  message: string;
  at: string;
};

type Listener = (event: StreamEvent) => void;

const globalForBus = globalThis as unknown as {
  __chaos_event_listeners__?: Set<Listener>;
  __chaos_event_buffer__?: StreamEvent[];
};

const listeners = globalForBus.__chaos_event_listeners__ ?? new Set<Listener>();
const buffer = globalForBus.__chaos_event_buffer__ ?? [];
globalForBus.__chaos_event_listeners__ = listeners;
globalForBus.__chaos_event_buffer__ = buffer;

export function publishEvent(event: Omit<StreamEvent, "at">) {
  const payload: StreamEvent = { ...event, at: new Date().toISOString() };
  buffer.push(payload);
  if (buffer.length > 200) buffer.shift();
  for (const listener of listeners) listener(payload);
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getBufferedEvents() {
  return [...buffer];
}
