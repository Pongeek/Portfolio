import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Big 404 */}
        <p className="font-display text-[9rem] font-bold leading-none text-primary/10 select-none">
          404
        </p>

        <h1 className="font-display text-3xl font-bold mb-3 -mt-4">
          Page not found
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          This page doesn't exist or was moved. Head back to the portfolio.
        </p>

        <Button asChild className="gap-2">
          <a href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </a>
        </Button>
      </div>
    </section>
  );
}
