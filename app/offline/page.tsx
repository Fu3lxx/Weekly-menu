export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="text-6xl">📴</div>
      <h1 className="text-2xl font-bold">Няма връзка</h1>
      <p className="max-w-sm text-muted-foreground">
        В момента сте офлайн. Последно заредените страници остават достъпни. Опитайте отново, когато
        имате интернет.
      </p>
    </div>
  );
}
