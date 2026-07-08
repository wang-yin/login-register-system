interface DoneStepProps {
  onSwitch: (view: "login") => void;
}

export default function DoneStep({ onSwitch }: DoneStepProps) {
  return (
    <div className="text-center space-y-4 py-6">
      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2>密碼重設成功！</h2>
      <p className="text-muted-foreground text-sm">您現在可以使用新密碼登入</p>
      <button
        onClick={() => onSwitch("login")}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
      >
        前往登入
      </button>
    </div>
  );
}
