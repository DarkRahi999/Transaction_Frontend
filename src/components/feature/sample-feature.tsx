import { Button } from "@/components/ui/button";

export function SampleFeature() {
  return (
    <div className="p-6 border rounded-lg bg-card text-card-foreground">
      <h3 className="text-lg font-semibold">Sample Feature Component</h3>
      <p className="mt-2 text-muted-foreground">
        This is an example of how to create feature-specific components in your Next.js template.
      </p>
      <div className="mt-4">
        <Button variant="outline">Get Started</Button>
      </div>
    </div>
  );
}