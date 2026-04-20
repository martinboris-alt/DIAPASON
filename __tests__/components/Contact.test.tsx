import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { mockSend } = vi.hoisted(() => ({ mockSend: vi.fn() }));
vi.mock("@emailjs/browser", () => ({ default: { send: mockSend } }));

vi.mock("@/hooks/useScrollReveal", () => ({
  useScrollReveal: () => ({ current: null }),
}));

import Contact from "@/components/Contact";

const ENV = {
  NEXT_PUBLIC_EMAILJS_SERVICE_ID:  "service_test",
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: "template_test",
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY:  "key_test",
};

describe("Contact form", () => {
  beforeEach(() => {
    mockSend.mockReset();
    Object.assign(process.env, ENV);
  });

  it("renders all required fields", () => {
    render(<Contact />);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
  });

  it("shows success state after successful submission", async () => {
    mockSend.mockResolvedValueOnce({ status: 200 });
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText(/nombre/i), "Juan Pérez");
    await user.type(screen.getByLabelText(/correo/i), "juan@test.com");
    await user.type(screen.getByLabelText(/mensaje/i), "Necesito afinar mi piano.");
    await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    await waitFor(() => {
      expect(screen.getByText(/mensaje recibido/i)).toBeInTheDocument();
    });

    expect(mockSend).toHaveBeenCalledWith(
      "service_test",
      "template_test",
      expect.objectContaining({ from_name: "Juan Pérez", from_email: "juan@test.com" }),
      expect.any(Object)
    );
  });

  it("shows error state when emailjs rejects", async () => {
    mockSend.mockRejectedValueOnce(new Error("Network error"));
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText(/nombre/i), "Ana");
    await user.type(screen.getByLabelText(/correo/i), "ana@test.com");
    await user.type(screen.getByLabelText(/mensaje/i), "Consulta.");
    await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("shows error when env vars are missing", async () => {
    delete process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText(/nombre/i), "Test");
    await user.type(screen.getByLabelText(/correo/i), "test@test.com");
    await user.type(screen.getByLabelText(/mensaje/i), "Test.");
    await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(mockSend).not.toHaveBeenCalled();
  });
});
