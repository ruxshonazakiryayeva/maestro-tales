type ReportErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

/**
 * Central place to log runtime errors. Currently just logs to the console;
 * wire this up to an error-tracking service (e.g. Sentry) if/when needed.
 */
export function reportError(
  error: unknown,
  context: Record<string, unknown> = {},
  options: ReportErrorOptions = {},
) {
  if (typeof window === "undefined") return;
  console.error("[error-reporting]", error, {
    route: window.location.pathname,
    ...context,
    ...options,
  });
}
