import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NativeWindowStatus } from "./NativeWindowStatus";
import { I18nProvider } from "../i18n";


describe("NativeWindowStatus", () => {
  const writeText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    writeText.mockClear();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });

  it("shows that the profile runs in a native window", () => {
    render(<I18nProvider><NativeWindowStatus profileName="Work" cdpUrl={null} /></I18nProvider>);
    expect(screen.getByText("Opened in a native window")).toBeTruthy();
    expect(screen.getByText(/Work is running directly/)).toBeTruthy();
  });

  it("copies the Manager CDP endpoint", async () => {
    render(
      <I18nProvider>
        <NativeWindowStatus
          profileName="Work"
          cdpUrl="/api/profiles/profile-1/cdp"
        />
      </I18nProvider>,
    );
    fireEvent.click(screen.getByTitle("Copy CDP endpoint URL"));
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        `${window.location.protocol}//${window.location.host}/api/profiles/profile-1/cdp`,
      );
    });
  });
});
