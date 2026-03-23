const EVENT = "gitaverse:openEmailPopup";

export function openEmailPopup(): void {
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function onOpenEmailPopup(handler: () => void): () => void {
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
