import Spinner from "@/components/common/Spinner";

interface LoadingStatusProps {
  message: string;
}

export default function LoadingStatus({ message }: LoadingStatusProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-3">
      <Spinner />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
