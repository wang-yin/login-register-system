export default function SuccessStatus({ message }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
        ✓
      </div>

      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
