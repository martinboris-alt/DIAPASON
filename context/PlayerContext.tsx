"use client";

import { createContext, useContext, useRef, useCallback } from "react";

interface PlayerContextValue {
  register: (id: string, stop: () => void) => () => void;
  requestPlay: (id: string) => void;
}

const PlayerContext = createContext<PlayerContextValue>({
  register: () => () => {},
  requestPlay: () => {},
});

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  // Mapa de id → función stop de cada player registrado
  const players = useRef<Map<string, () => void>>(new Map());
  const activeId = useRef<string | null>(null);

  const register = useCallback((id: string, stop: () => void): () => void => {
    players.current.set(id, stop);
    return () => { players.current.delete(id); };
  }, []);

  const requestPlay = useCallback((id: string) => {
    // Detener el player activo si es diferente al que pide reproducir
    if (activeId.current && activeId.current !== id) {
      players.current.get(activeId.current)?.();
    }
    activeId.current = id;
  }, []);

  return (
    <PlayerContext.Provider value={{ register, requestPlay }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayerContext = () => useContext(PlayerContext);
