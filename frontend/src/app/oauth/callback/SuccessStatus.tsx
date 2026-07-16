export default function SuccessStatus() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
        ✓
      </div>
      <h3 className="text-xl font-bold text-foreground">第三方認證成功！</h3>
      <p className="text-sm text-muted-foreground">
        歡迎回來，系統正在為您引導首頁...
      </p>
    </div>
  );
}
