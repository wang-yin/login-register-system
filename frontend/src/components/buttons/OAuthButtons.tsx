import { GoogleIcon, GithubIcon } from "../icon";

export default function OAuthButtons() {
  return (
    <div className="space-y-3">
      <div className="flex items-center  gap-3">
        <div className="flex-1 bg-border h-px"></div>
        <span className="text-muted-foreground text-sm px-2">
          或以第三方登入
        </span>
        <div className="flex-1 bg-border h-px"></div>
      </div>

      <button className="w-full flex justify-center gap-3 px-4 py-3 rounded-lg border border-border bg-secondary hover:bg-accent transition-colors duration-200 text-foreground cursor-pointer">
        <GoogleIcon />
        <span>使用 Google 帳號</span>
      </button>
      <button className="w-full flex justify-center gap-3 px-4 py-3 rounded-lg border border-border bg-secondary hover:bg-accent transition-colors duration-200 text-foreground cursor-pointer">
        <GithubIcon />
        <span>使用 GitHub 帳號</span>
      </button>
    </div>
  );
}
