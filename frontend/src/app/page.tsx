import LoginForm from "@/components/form/LoginForm";

export default function Home() {
  return (
    <div className="flex-col w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-foreground mb-1 text-2xl">歡迎回來</h1>
        <p className="text-muted-foreground text-sm">登入您的帳號以繼續</p>
      </div>

      {/* card */}
      <div className="bg-card border border-border rounded-2xl p-8 shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
        {/* switcher */}
        <div className="flex bg-muted rounded-lg p-1 mb-6">
          <button className="flex-1 py-2 rounded-md text-sm transition-all duration-200 bg-card text-foreground shadow-sm">
            登入
          </button>
          <button className="flex-1 py-2 rounded-md text-sm transition-all duration-200 text-muted-foreground hover:text-foreground">
            註冊
          </button>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
