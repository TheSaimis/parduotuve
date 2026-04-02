describe("prisma singleton", () => {
  test("prisma module exports a client instance", async () => {
    jest.resetModules();
    process.env.NODE_ENV = "development";
    const mod = await import("@/lib/prisma");
    expect(mod.prisma).toBeDefined();
    // basic shape check
    expect(typeof (mod.prisma as any).$transaction).toBe("function");
  });
});

