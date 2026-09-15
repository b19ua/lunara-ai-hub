import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AiMode } from "@/services/types";

export type AiStatus = "ready" | "busy" | "offline";

interface AppState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  aiStatus: AiStatus;
  setAiStatus: (s: AiStatus) => void;
  aiMode: AiMode;
  setAiMode: (m: AiMode) => void;
  setupComplete: boolean;
  completeSetup: () => void;
  resetSetup: () => void;
  unreadNotifications: number;
  markNotificationsRead: () => void;
}

const Ctx = createContext<AppState | null>(null);

const SETUP_KEY = "lunara.setup.complete";
const THEME_KEY = "lunara.theme";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [aiStatus, setAiStatus] = useState<AiStatus>("ready");
  const [aiMode, setAiMode] = useState<AiMode>("local");
  const [setupComplete, setSetupComplete] = useState(true);
  const [unreadNotifications, setUnread] = useState(4);

  // Browser storage is only read after hydration to keep SSR output stable.
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme === "dark" || storedTheme === "light") setTheme(storedTheme);
    setSetupComplete(localStorage.getItem(SETUP_KEY) !== "false");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  const completeSetup = useCallback(() => {
    localStorage.setItem(SETUP_KEY, "true");
    setSetupComplete(true);
  }, []);

  const resetSetup = useCallback(() => {
    localStorage.setItem(SETUP_KEY, "false");
    setSetupComplete(false);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      aiStatus,
      setAiStatus,
      aiMode,
      setAiMode,
      setupComplete,
      completeSetup,
      resetSetup,
      unreadNotifications,
      markNotificationsRead: () => setUnread(0),
    }),
    [
      theme,
      toggleTheme,
      aiStatus,
      aiMode,
      setupComplete,
      completeSetup,
      resetSetup,
      unreadNotifications,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
