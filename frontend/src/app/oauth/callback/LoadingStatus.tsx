import Spinner from "@/components/common/Spinner";

export default function LoadingStatus() {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Spinner />
      </div>
      <h3 className="text-xl font-bold text-foreground">第三方安全認證中</h3>
      <p className="text-sm text-muted-foreground">
        正在與伺服器安全同步身分資料，請稍後...
      </p>
    </div>
  );
}
