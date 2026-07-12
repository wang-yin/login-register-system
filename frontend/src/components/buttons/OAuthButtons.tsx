import { GoogleIcon, GithubIcon } from "../icon";

export default function OAuthButtons() {
  const handleOAuthRedirect = (provider: "google" | "github") => {
    // 💡 這些 Client ID 可以直接放在前端環境變數 .env.local 中
    console.log("當前環境變數：", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
    if (provider === "google") {
      // 💡 改成這樣：直接讀取，不給備用字串
      const clientId =
        "179387694143-8t0b5m3011v06nvvf2c5nitac461qqok.apps.googleusercontent.com";

      if (!clientId) {
        console.error(
          "❌ 錯誤：找不到 NEXT_PUBLIC_GOOGLE_CLIENT_ID 環境變數，請檢查 .env.local 是否有正確配置並重啟專案。",
        );
        alert("系統配置錯誤：找不到 Google Client ID");
        return;
      }

      const redirectUri = encodeURIComponent(
        "http://localhost:3000/oauth/callback",
      );
      const scope = encodeURIComponent("profile email");

      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=google`;
    } else if (provider === "github") {
      const clientId = "Ov23lilKiPY2xsIg96kx";
      const redirectUri = encodeURIComponent(
        "http://localhost:3000/oauth/callback",
      );
      const scope = encodeURIComponent("user:email");

      // 導向 GitHub 官方認證大門
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=github`;
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center  gap-3">
        <div className="flex-1 bg-border h-px"></div>
        <span className="text-muted-foreground text-sm px-2">
          或以第三方登入
        </span>
        <div className="flex-1 bg-border h-px"></div>
      </div>

      <button
        onClick={() => handleOAuthRedirect("google")}
        className="w-full flex justify-center gap-3 px-4 py-3 rounded-lg border border-border bg-secondary hover:bg-accent transition-colors duration-200 text-foreground cursor-pointer"
      >
        <GoogleIcon />
        <span>使用 Google 帳號</span>
      </button>
      <button
        onClick={() => handleOAuthRedirect("github")}
        className="w-full flex justify-center gap-3 px-4 py-3 rounded-lg border border-border bg-secondary hover:bg-accent transition-colors duration-200 text-foreground cursor-pointer"
      >
        <GithubIcon />
        <span>使用 GitHub 帳號</span>
      </button>
    </div>
  );
}
