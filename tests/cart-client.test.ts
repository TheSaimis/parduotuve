import {
  addCartItem,
  clearCartRemote,
  emitCartChanged,
  fetchCartSnapshot,
  removeCartItem,
  submitCheckout,
  updateCartLine,
} from "@/lib/cart/client";
import { SHOP_API } from "@/lib/cart/constants";

function mockFetch(json: unknown, ok = true, status = 200) {
  global.fetch = jest.fn(async () => {
    return {
      ok,
      status,
      json: async () => json,
    } as unknown as Response;
  }) as unknown as typeof fetch;
}

describe("cart client (API wrappers)", () => {
  afterEach(() => {
    // @ts-expect-error test cleanup
    delete global.fetch;
    // @ts-expect-error test cleanup
    delete global.window;
  });

  test("emitCartChanged dispatches when window exists", () => {
    const dispatched: string[] = [];
    // @ts-expect-error minimal window mock
    global.window = {
      dispatchEvent: (e: Event) => {
        dispatched.push(e.type);
        return true;
      },
    };
    emitCartChanged();
    expect(dispatched).toContain("vitrina-cart-changed");
  });

  test("fetchCartSnapshot returns ok on 200", async () => {
    mockFetch({ lines: [], itemCount: 0, subtotal: 0 }, true, 200);
    const snap = await fetchCartSnapshot();
    expect(snap.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(SHOP_API.cart, { cache: "no-store" });
  });

  test("fetchCartSnapshot returns error on non-ok", async () => {
    mockFetch({ error: "boom" }, false, 500);
    const snap = await fetchCartSnapshot();
    expect(snap.ok).toBe(false);
    expect(snap.error).toBe("boom");
  });

  test("addCartItem sends POST", async () => {
    mockFetch({}, true, 200);
    const r = await addCartItem(1, 2);
    expect(r.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalled();
    const args = (global.fetch as jest.Mock).mock.calls[0];
    expect(args[0]).toBe(SHOP_API.cart);
    expect(args[1].method).toBe("POST");
  });

  test("updateCartLine sends PATCH", async () => {
    mockFetch({}, true, 200);
    const r = await updateCartLine(1, 3);
    expect(r.ok).toBe(true);
    const args = (global.fetch as jest.Mock).mock.calls[0];
    expect(args[1].method).toBe("PATCH");
  });

  test("removeCartItem sends DELETE with query", async () => {
    mockFetch({}, true, 200);
    const r = await removeCartItem(7);
    expect(r.ok).toBe(true);
    const args = (global.fetch as jest.Mock).mock.calls[0];
    expect(String(args[0])).toBe(`${SHOP_API.cart}?productId=7`);
    expect(args[1].method).toBe("DELETE");
  });

  test("clearCartRemote sends DELETE", async () => {
    mockFetch({}, true, 200);
    const r = await clearCartRemote();
    expect(r.ok).toBe(true);
    const args = (global.fetch as jest.Mock).mock.calls[0];
    expect(args[0]).toBe(SHOP_API.cart);
    expect(args[1].method).toBe("DELETE");
  });

  test("submitCheckout returns orderId on success", async () => {
    mockFetch({ orderId: 123 }, true, 200);
    const r = await submitCheckout({ name: "A", email: "a@b.com", address: "Xxx xxx" });
    expect(r.ok).toBe(true);
    expect(r.orderId).toBe(123);
  });
});

