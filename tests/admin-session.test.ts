import { decodeAdminSession, encodeAdminSession, getSessionSecret } from "@/lib/admin-session-core";

describe("admin session token", () => {
  const secret = "secret";

  test("encode/decode roundtrip", () => {
    const token = encodeAdminSession({ uid: 123, exp: Math.floor(Date.now() / 1000) + 60 }, secret);
    const decoded = decodeAdminSession(token, secret);
    expect(decoded).not.toBeNull(); // not-null assert
    expect(decoded?.uid).toBe(123);
  });

  test("expired session decodes to null (exception-style validation)", () => {
    const token = encodeAdminSession({ uid: 1, exp: 1 }, secret);
    expect(decodeAdminSession(token, secret)).toBeNull();
  });

  test("tampered token decodes to null", () => {
    const token = encodeAdminSession({ uid: 1, exp: 9999999999 }, secret);
    const tampered = token.replace(".", "..");
    expect(decodeAdminSession(tampered, secret)).toBeNull();
  });
});

describe("getSessionSecret", () => {
  const prevNodeEnv = process.env.NODE_ENV;
  const prevSecret = process.env.SESSION_SECRET;

  afterEach(() => {
    process.env.NODE_ENV = prevNodeEnv;
    process.env.SESSION_SECRET = prevSecret;
  });

  test("returns SESSION_SECRET when set", () => {
    process.env.NODE_ENV = "production";
    process.env.SESSION_SECRET = "abc";
    expect(getSessionSecret()).toBe("abc");
  });

  test("throws-like check: production without secret returns null", () => {
    process.env.NODE_ENV = "production";
    process.env.SESSION_SECRET = "";
    expect(getSessionSecret()).toBeNull();
  });
});

