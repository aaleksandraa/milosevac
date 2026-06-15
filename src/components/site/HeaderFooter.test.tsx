import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Footer } from "./Footer";
import { Header } from "./Header";

describe("mobile header and footer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("shows current temperature and includes weather in the mobile menu", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ current: { temperature: 19.2 } }),
    }));

    render(
      <MemoryRouter>
        <Header onSearchClick={() => {}} />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByLabelText("Trenutna temperatura i vrijeme u Miloševcu")).toHaveTextContent("19°"));

    fireEvent.click(screen.getByRole("button", { name: "Otvori meni" }));

    expect(screen.getAllByText("Vrijeme").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Obavještenja").length).toBeGreaterThan(0);
  });

  it("uses centered portal links and real social profiles without removed categories", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Miloševac na Facebooku" })).toHaveAttribute(
      "href",
      "https://www.facebook.com/milosevac.official",
    );
    expect(screen.getByRole("link", { name: "Miloševac na Instagramu" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/milosevac.official/",
    );
    expect(screen.queryByText("Projekti")).not.toBeInTheDocument();
    expect(screen.queryByText("Slike")).not.toBeInTheDocument();
  });
});
