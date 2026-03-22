import { useState, useCallback } from "react";

export interface SavedItem {
  id: string;
  content: string;
  savedAt: number;
}

const STORAGE_KEY = "gitaverse_saved";

function loadItems(): SavedItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function persist(items: SavedItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useSavedGuidance() {
  const [items, setItems] = useState<SavedItem[]>(loadItems);

  const saveItem = useCallback((content: string): string => {
    const newItem: SavedItem = {
      id: `saved_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      content,
      savedAt: Date.now(),
    };
    setItems(prev => {
      const updated = [newItem, ...prev];
      persist(updated);
      return updated;
    });
    return newItem.id;
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      persist(updated);
      return updated;
    });
  }, []);

  const isAlreadySaved = useCallback(
    (content: string) => items.some(item => item.content === content),
    [items]
  );

  return { items, saveItem, removeItem, isAlreadySaved };
}
