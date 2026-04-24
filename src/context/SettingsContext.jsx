import { createContext, useContext, useState, useEffect } from "react";
import { settingsAPI } from "../api";

const SettingsContext = createContext(null);

const DEFAULTS = {
  appName: "Shipment Tracker",
  appSubtitle: "Tracking",
  logoEmoji: "🚚",
  logoUrl: "",
  primaryColor: "#2563EB",
  sidebarColor: "#0F172A",
  accentColor: "#1E3A5F",
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const applyTheme = (s) => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", s.primaryColor || DEFAULTS.primaryColor);
    root.style.setProperty("--color-sidebar", s.sidebarColor || DEFAULTS.sidebarColor);
    root.style.setProperty("--color-accent", s.accentColor || DEFAULTS.accentColor);
  };

  useEffect(() => {
    settingsAPI.get()
      .then(res => { setSettings({ ...DEFAULTS, ...res.data }); applyTheme(res.data); })
      .catch(() => applyTheme(DEFAULTS))
      .finally(() => setLoading(false));
  }, []);

  const updateSettings = async (data) => {
    const res = await settingsAPI.update(data);
    setSettings(prev => ({ ...prev, ...res.data }));
    applyTheme(res.data);
    return res.data;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
