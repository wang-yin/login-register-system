interface SuccessStatusProps {
  message: string;
}

export default function SuccessStatus({ message }: SuccessStatusProps) {
  return (
    <div className="py-6 space-y-3">
      <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm">
        {message}
      </div>
      <p className="text-xs text-muted-foreground">正在為您引導回控制面板...</p>
    </div>
  );
}
