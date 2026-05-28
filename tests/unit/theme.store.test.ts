import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useThemeStore } from "../../src/stores/theme";

describe("theme store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("style");
  });

  it("initializes and writes default theme variables", () => {
    const store = useThemeStore();
    store.init();

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(
      document.documentElement.style.getPropertyValue("--accent-color").trim(),
    ).toBe("#2962ff");
  });

  it("switches to dark mode and persists state", () => {
    const store = useThemeStore();
    store.setMode("dark");

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("gallery_blog_theme_v1")).toContain("\"mode\":\"dark\"");
  });

  it("accepts gradient accent color and extracts text color", () => {
    const store = useThemeStore();
    store.setAccentColor("linear-gradient(120deg, #123456, #abcdef)");

    expect(
      document.documentElement.style.getPropertyValue("--accent-color").trim(),
    ).toBe("linear-gradient(120deg, #123456, #abcdef)");
    expect(
      document.documentElement.style.getPropertyValue("--accent-text-color").trim(),
    ).toBe("#123456");
  });
});
