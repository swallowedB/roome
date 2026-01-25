import { useCallback, useEffect, useState } from "react";

export default function useHiveLoading(totalRooms: number, onLoadingComplete?: () => void) {
  const [loadedRooms, setLoadedRooms] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const handleModelLoaded = useCallback((roomId: string) => {
    setLoadedRooms((prev) => {
      if (prev.has(roomId)) return prev;
      const next = new Set(prev);
      next.add(roomId);
      return next;
    });
  }, []);

  useEffect(() => {
    if (totalRooms > 0 && loadedRooms.size >= totalRooms) {
      setIsLoading(false);
      onLoadingComplete?.();
    }
  }, [loadedRooms, totalRooms, onLoadingComplete]);

  return { isLoading, handleModelLoaded };
}
