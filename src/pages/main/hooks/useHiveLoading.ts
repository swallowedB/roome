import { useCallback, useEffect, useRef, useState } from 'react';

export default function useHiveLoading(
  initialRoomIds: string[],
  hasInitialVisibleBatch: boolean,
  onLoadingComplete?: () => void,
) {
  const [loadedRooms, setLoadedRooms] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const completedInitialBatchRef = useRef(false);
  const initialRoomIdsKey = initialRoomIds.join(',');

  const handleModelLoaded = useCallback((roomId: string) => {
    setLoadedRooms((prev) => {
      if (prev.has(roomId)) return prev;
      const next = new Set(prev);
      next.add(roomId);
      return next;
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    completedInitialBatchRef.current = false;
  }, [hasInitialVisibleBatch, initialRoomIdsKey]);

  useEffect(() => {
    const isInitialBatchLoaded =
      hasInitialVisibleBatch &&
      initialRoomIds.every((roomId) => loadedRooms.has(roomId));

    if (isInitialBatchLoaded && !completedInitialBatchRef.current) {
      completedInitialBatchRef.current = true;
      setIsLoading(false);
      onLoadingComplete?.();
    }
  }, [hasInitialVisibleBatch, initialRoomIds, loadedRooms, onLoadingComplete]);

  return { isLoading, handleModelLoaded };
}
