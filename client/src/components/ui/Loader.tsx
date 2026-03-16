import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      
      <Loader2 className="h-10 w-10 animate-spin text-primary" />

      <p className="text-sm text-muted-foreground animate-pulse">
        Loading your experience...
      </p>

    </div>
  );
}