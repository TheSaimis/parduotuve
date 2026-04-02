import MobileCartView from "@/components/mobile/MobileCartView";

export const dynamic = "force-dynamic";

export default function MobileCartPage() {
  return (
    <div className="space-y-4">
      <header className="text-center">
        <h1 className="text-lg font-bold tracking-tight">Krepšelis (Mobile)</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Mobilus krepšelio vaizdas su tuo pačiu API.
        </p>
      </header>
      <MobileCartView />
    </div>
  );
}

