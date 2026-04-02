describe("prisma singleton", () => {
  test("prisma module exports a client instance", async () => {
    jest.resetModules();
    process.env.NODE_ENV = "development";
    const mod = await import("@/lib/prisma");
    expect(mod.prisma).toBeDefined();
    // basic shape check
    const prismaLike = mod.prisma as { $transaction?: unknown };
    expect(typeof prismaLike.$transaction).toBe("function");
  });
});

