"use client";

import React, { useState } from "react";
import { FaAngleLeft } from "react-icons/fa";

import EmailStep from "./EmailStep";
import ResetStep from "./ResetStep";
import VerifyStep from "./VerifyStep";
import DoneStep from "./DoneStep";

interface ForgotPasswordFormProps {
  onSwitch: (view: "login") => void;
}

type Step = "email" | "sent" | "reset" | "done";

export default function ForgotPasswordForm({
  onSwitch,
}: ForgotPasswordFormProps) {
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {(["email", "sent", "reset"] as Step[]).map((s, i) => (
          <React.Fragment key={s}>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                step === s || (step === "done" && i <= 2)
                  ? "bg-primary text-primary-foreground"
                  : ["email", "sent", "reset", "done"].indexOf(step) > i
                    ? "bg-primary/30 text-primary"
                    : "bg-border text-muted-foreground"
              }`}
            >
              {["email", "sent", "reset", "done"].indexOf(step) > i
                ? "✓"
                : i + 1}
            </div>
            {i < 2 && (
              <div
                className={`h-px flex-1 transition-all duration-300 ${
                  ["email", "sent", "reset", "done"].indexOf(step) > i
                    ? "bg-primary/50"
                    : "bg-border"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {step === "email" && (
        <EmailStep
          email={email}
          setEmail={setEmail}
          onSuccess={() => setStep("sent")}
        />
      )}

      {step === "sent" && (
        <VerifyStep
          email={email}
          setResetToken={setResetToken}
          onSuccess={() => setStep("reset")}
          onBack={() => setStep("email")}
        />
      )}

      {step === "reset" && (
        <ResetStep resetToken={resetToken} onSuccess={() => setStep("done")} />
      )}

      {step === "done" && <DoneStep onSwitch={onSwitch} />}

      {step !== "done" && (
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => onSwitch("login")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mx-auto"
          >
            <FaAngleLeft />
            返回登入
          </button>
        </div>
      )}
    </div>
  );
}
