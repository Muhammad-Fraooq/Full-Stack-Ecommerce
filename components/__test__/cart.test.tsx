import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CartPage from "@/app/(client)/cart/page";
import userCartStore from "@/store";
import { CreateCheckoutSession } from "@/actions/createCheckoutSession";
import { vi } from "vitest";

vi.mock("@/store", () => {
  const mockStore = {
    deleteCartProduct: vi.fn(),
    getTotalPrice: vi.fn(() => 100),
    getItemCount: vi.fn(() => 1),
    getSubTotalPrice: vi.fn(() => 90),
    resetCart: vi.fn(),
    getGroupsItems: vi.fn(() => [
      {
        product: {
          _id: "1",
          name: "Test Product",
          price: 50,
          image: "test-image-url",
          slug: { current: "test-product" },
        },
      },
    ]),
  };
  return {
    __esModule: true,
    default: () => mockStore,
  };
});

vi.mock("@/actions/createCheckoutSession", () => ({
  CreateCheckoutSession: vi.fn(() => Promise.resolve("https://checkout.session.url")),
}));

vi.mock("@clerk/nextjs", () => ({
  useAuth: vi.fn(() => ({ isSignedIn: true })),
  useUser: vi.fn(() => ({ user: { id: "123", fullName: "John Doe", emailAddresses: [{ emailAddress: "john@example.com" }] } })),
  SignInButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("CartPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the cart page with products", () => {
    render(<CartPage />);

    expect(screen.getByText("Shopping Cart")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$50.00")).toBeInTheDocument();
  });

  it("calls deleteCartProduct when delete button is clicked", () => {
    const store = userCartStore();
    render(<CartPage />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(store.deleteCartProduct).toHaveBeenCalledWith("1");
  });

  it("calls resetCart when reset button is clicked", () => {
    const store = userCartStore();
    render(<CartPage />);

    const resetButton = screen.getByRole("button", { name: /reset cart/i });
    fireEvent.click(resetButton);

    expect(store.resetCart).toHaveBeenCalled();
  });

  it("redirects to checkout session on successful checkout", async () => {
    render(<CartPage />);

    const checkoutButton = screen.getByRole("button", { name: /proceed to checkout/i });
    fireEvent.click(checkoutButton);

    await waitFor(() => expect(CreateCheckoutSession).toHaveBeenCalled());
    expect(window.location.href).toBe("https://checkout.session.url");
  });

  it("shows sign in button when user is not signed in", () => {
    vi.doMock("@clerk/nextjs", () => ({
      useAuth: vi.fn(() => ({ isSignedIn: false })),
      SignInButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    }));

    render(<CartPage />);

    expect(screen.getByRole("button", { name: /sign in to checkout/i })).toBeInTheDocument();
  });

  it("shows empty cart message when no products are in the cart", () => {
    vi.mocked(userCartStore).mockImplementation(() => ({
      getGroupsItems: vi.fn(() => []),
    }));

    render(<CartPage />);

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});