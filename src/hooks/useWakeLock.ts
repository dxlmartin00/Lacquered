import { useState, useEffect, useCallback, useRef } from 'react';

export function useWakeLock() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const requestedRef = useRef<boolean>(false);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const request = useCallback(async () => {
    if (!('wakeLock' in navigator)) {
      setIsSupported(false);
      return false;
    }

    try {
      requestedRef.current = true;
      const sentinel = await navigator.wakeLock.request('screen');
      wakeLockRef.current = sentinel;
      setIsActive(true);
      setError(null);

      sentinel.addEventListener('release', () => {
        setIsActive(false);
        wakeLockRef.current = null;
      });

      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Wake lock request failed';
      console.warn('Wake Lock request error:', message);
      setError(message);
      setIsActive(false);
      return false;
    }
  }, []);

  const release = useCallback(async () => {
    requestedRef.current = false;
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch (err) {
        console.warn('Wake lock release error:', err);
      } finally {
        wakeLockRef.current = null;
        setIsActive(false);
      }
    }
  }, []);

  // Re-acquire lock when document becomes visible again if requested
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && requestedRef.current && !wakeLockRef.current) {
        await request();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [request]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
      }
    };
  }, []);

  return {
    isSupported,
    isActive,
    error,
    request,
    release,
    toggle: () => (isActive ? release() : request()),
  };
}
