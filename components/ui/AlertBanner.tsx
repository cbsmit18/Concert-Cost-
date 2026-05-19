"use client";



export function AlertBanner({

  type,

  message,

  onDismiss,

}: {

  type: "error" | "success" | "info";

  message: string;

  onDismiss?: () => void;

}) {

  const alertClass =

    type === "error"

      ? "alert-error"

      : type === "success"

        ? "alert-success"

        : "alert-info";



  return (

    <div

      role="alert"

      className={`alert ${alertClass} shadow-sm animate-fade-in text-sm`}

    >

      <span className="flex-1">{message}</span>

      {onDismiss && (

        <button

          type="button"

          className="btn btn-ghost btn-xs"

          onClick={onDismiss}

          aria-label="Dismiss"

        >

          ✕

        </button>

      )}

    </div>

  );

}

