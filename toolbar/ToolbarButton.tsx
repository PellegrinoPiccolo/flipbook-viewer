import type { ComponentProps } from "react";
import { cn } from "cn";

const ToolbarButton = ({ className, ...props }: ComponentProps<"button">) => (
  <button
    type="button"
    className={cn(
      "inline-flex size-8 min-w-8 items-center justify-center bg-neutral-100 text-(--flipbook-ink) transition-colors duration-200 hover:bg-(--flipbook-accent) hover:text-(--flipbook-ink) disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--flipbook-accent)",
      className,
    )}
    {...props}
  />
);

export default ToolbarButton;
