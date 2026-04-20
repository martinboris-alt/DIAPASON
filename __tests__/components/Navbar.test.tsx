import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "dark", setTheme: vi.fn() }),
}));

import Navbar from "@/components/Navbar";

describe("Navbar", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  it("renders anchor elements for section links (not buttons)", () => {
    render(<Navbar />);
    const serviciosLink = screen.getByRole("link", { name: /servicios/i });
    expect(serviciosLink.tagName).toBe("A");
    expect(serviciosLink).toHaveAttribute("href", "#servicios");
  });

  it("renders anchor for Solicitar servicio CTA", () => {
    render(<Navbar />);
    const cta = screen.getAllByRole("link", { name: /solicitar servicio/i })[0];
    expect(cta.tagName).toBe("A");
    expect(cta).toHaveAttribute("href", "#contacto");
  });

  it("renders external page links with correct href", () => {
    render(<Navbar />);
    expect(screen.getAllByRole("link", { name: /partituras/i })[0]).toHaveAttribute("href", "/partituras");
    expect(screen.getAllByRole("link", { name: /blog/i })[0]).toHaveAttribute("href", "/blog");
  });

  it("hamburger button has aria-label and aria-expanded", () => {
    render(<Navbar />);
    const hamburger = screen.getByRole("button", { name: /abrir menú/i });
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles aria-expanded when hamburger is clicked", async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    const hamburger = screen.getByRole("button", { name: /abrir menú/i });
    await user.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-expanded", "true");
  });
});
