import {
  addToCartLines,
  clearCartLines,
  decodeCartPayload,
  encodeCartPayload,
  removeCartLine,
  setCartLineQty,
} from "@/lib/cart/core";

describe("cart cookie payload", () => {
  const secret = "test-secret";

  test("encode/decode roundtrip works", () => {
    const token = encodeCartPayload(
      [
        { productId: 1, qty: 2 },
        { productId: 2, qty: 1 },
      ],
      secret,
    );
    const decoded = decodeCartPayload(token, secret);
    expect(decoded).toEqual([
      { productId: 1, qty: 2 },
      { productId: 2, qty: 1 },
    ]); // deep equal
  });

  test("decode returns [] on tampered signature (exception-safe)", () => {
    const token = encodeCartPayload([{ productId: 1, qty: 2 }], secret);
    const tampered = token.slice(0, -1) + (token.endsWith("x") ? "y" : "x"); // pakeičiam vieną simbolį
    expect(decodeCartPayload(tampered, secret)).toEqual([]);
  });

  test("decode returns [] on invalid format", () => {
    expect(decodeCartPayload("not-a-token", secret)).toEqual([]);
  });
});

describe("cart line algorithms", () => {
  test("addToCartLines merges and caps by stock", () => {
    const start = [{ productId: 1, qty: 1 }];
    const next = addToCartLines(start, 1, 5, 3);
    expect(next).toEqual([{ productId: 1, qty: 3 }]); // capped
  });

  test("setCartLineQty removes line when qty < 1", () => {
    const next = setCartLineQty([{ productId: 1, qty: 2 }], 1, 0, 99);
    expect(next).toEqual([]);
    expect(clearCartLines()).toEqual([]); // simple equality
  });

  test("removeCartLine removes by productId", () => {
    const next = removeCartLine(
      [
        { productId: 1, qty: 1 },
        { productId: 2, qty: 1 },
      ],
      2,
    );
    expect(next).toHaveLength(1); // length assert
    expect(next[0]?.productId).toBe(1);
  });
});

