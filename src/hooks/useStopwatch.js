import { useEffect, useMemo, useRef, useState } from 'react';
import { nowTs } from '../utils/formatTime.js';

export function useStopwatch(initial) {
  const [elapsedMs, setElapsedMs] = useState(initial.elapsedMs ?? 0);
  const [isRunning, setIsRunning] = useState(initial.isRunning ?? false);
  const [startedAt, setStartedAt] = useState(initial.startedAt ?? null);
  const [, forceTick] = useState(0);

  const startedOffsetRef = useRef(0);

  useEffect(() => {
    if (isRunning && startedAt) {
      startedOffsetRef.current = nowTs() - startedAt;
    } else {
      startedOffsetRef.current = 0;
    }
  }, [isRunning, startedAt]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      const base = startedAt ? nowTs() - startedAt : 0;
      setElapsedMs(base);
      forceTick(x => x + 1);
    }, 250);
    return () => clearInterval(id);
  }, [isRunning, startedAt]);

  const api = useMemo(() => ({
    start: () => {
      if (isRunning) return;
      const t = nowTs() - elapsedMs;
      setStartedAt(t);
      setIsRunning(true);
    },
    stop: () => {
      if (!isRunning) return;
      const total = (startedAt ? nowTs() - startedAt : 0);
      setElapsedMs(total);
      setIsRunning(false);
    },
    reset: () => {
      setElapsedMs(0);
      setIsRunning(false);
      setStartedAt(null);
    },
    hydrate: (next) => {
      setElapsedMs(next.elapsedMs ?? 0);
      setIsRunning(next.isRunning ?? false);
      setStartedAt(next.startedAt ?? null);
    },
  }), [elapsedMs, isRunning, startedAt]);

  return { elapsedMs, isRunning, startedAt, ...api };
}

