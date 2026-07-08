"use client";

interface SpinnerProps {
  className?: string;
}

export default function Spinner({ className = "" }: SpinnerProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={`animate-spin ${className}`}
    >
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  );
}
