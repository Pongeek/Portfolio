import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  /** Optional custom fallback — defaults to the built-in error card. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Catches any render/lifecycle error in its subtree and shows a
 * styled fallback instead of a blank white screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeSection />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message ?? "Unknown error" };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production you could forward this to a logging service (Sentry, etc.)
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Something went wrong
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              An unexpected error occurred while rendering this page.
              You can try reloading — if the problem persists, feel free to{" "}
              <a
                href="mailto:MaximPim95@gmail.com"
                className="text-primary hover:underline"
              >
                get in touch
              </a>
              .
            </p>
          </div>

          {/* Error detail (dev-friendly, collapsed by default) */}
          {this.state.message && (
            <details className="text-left">
              <summary className="text-xs text-muted-foreground/60 cursor-pointer hover:text-muted-foreground transition-colors">
                Error details
              </summary>
              <pre className="mt-2 p-3 rounded-lg bg-muted text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap break-all">
                {this.state.message}
              </pre>
            </details>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={this.handleReload} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reload page
            </Button>
            <Button variant="outline" onClick={this.handleReset}>
              Try without reloading
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
