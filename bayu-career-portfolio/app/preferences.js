const KEYS = { language: "bayu-portfolio-language", theme: "bayu-portfolio-theme" };

export const normalizeLanguage = (value) => (value === "en" ? "en" : "id");
export const normalizeTheme = (value) => (value === "dark" ? "dark" : "light");

export function readPreferences(storage) {
  try {
    return {
      language: normalizeLanguage(storage.getItem(KEYS.language)),
      theme: normalizeTheme(storage.getItem(KEYS.theme)),
    };
  } catch {
    return { language: "id", theme: "light" };
  }
}

export function writePreference(storage, key, value) {
  if (!(key in KEYS)) return;
  const normalized = key === "language" ? normalizeLanguage(value) : normalizeTheme(value);
  try { storage.setItem(KEYS[key], normalized); } catch { /* in-memory state still works */ }
}
