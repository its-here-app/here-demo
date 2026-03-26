"use client";

import {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppBarState {
  hidden?: boolean;
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

interface AppBarContextValue {
  state: AppBarState;
  setState: (s: AppBarState) => void;
  clearState: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppBarContext = createContext<AppBarContextValue | null>(null);

export function AppBarProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<AppBarState>({});
  return (
    <AppBarContext.Provider
      value={{
        state,
        setState: setStateRaw,
        clearState: () => setStateRaw({}),
      }}
    >
      {children}
    </AppBarContext.Provider>
  );
}

export function useAppBar() {
  const ctx = useContext(AppBarContext);
  if (!ctx) throw new Error("useAppBar must be used within AppBarProvider");
  return ctx;
}

// ─── AppBarConfig ─────────────────────────────────────────────────────────────
// Mount inside a page or component to configure AppBar slots.
// Automatically clears on unmount so AppBar resets when leaving the page.

export function AppBarConfig({ hidden, left, center, right }: AppBarState) {
  const { setState, clearState } = useAppBar();
  useLayoutEffect(() => {
    setState({ hidden, left, center, right });
    return clearState;
  }, [hidden, left, center, right]);
  return null;
}
