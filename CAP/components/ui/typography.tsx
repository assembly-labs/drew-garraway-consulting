import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("", {
  variants: {
    variant: {
      display: "font-display text-5xl md:text-6xl font-bold text-navy-900 leading-tight tracking-tight uppercase",
      h1: "font-display text-4xl md:text-5xl font-bold text-navy-900 leading-tight uppercase",
      h2: "font-display text-3xl md:text-4xl font-bold text-navy-900 leading-tight uppercase",
      h3: "font-display text-2xl md:text-3xl font-bold text-navy-900 leading-tight uppercase",
      h4: "font-body text-xl md:text-2xl font-semibold text-navy-900",
      h5: "font-body text-lg md:text-xl font-semibold text-navy-800",
      h6: "font-body text-base md:text-lg font-semibold text-navy-800",
      body: "font-body text-base font-normal text-navy-800 leading-relaxed",
      "body-lg": "font-body text-lg font-normal text-navy-800 leading-relaxed",
      "body-sm": "font-body text-sm font-normal text-navy-700",
      stat: "font-mono text-2xl md:text-3xl font-bold text-navy-900 leading-none",
      "stat-lg": "font-mono text-4xl md:text-5xl font-bold text-navy-900 leading-none",
      badge: "font-accent text-sm font-normal text-gold-700 uppercase tracking-wider",
      "badge-lg": "font-accent text-base font-normal text-gold-700 uppercase tracking-wider",
    },
  },
  defaultVariants: {
    variant: "body",
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as: Component = "p", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(typographyVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Typography.displayName = "Typography"

// Convenience components
export const Display = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "as" | "variant">
>((props, ref) => <Typography ref={ref} as="h1" variant="display" {...props} />)
Display.displayName = "Display"

export const H1 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "as" | "variant">
>((props, ref) => <Typography ref={ref} as="h1" variant="h1" {...props} />)
H1.displayName = "H1"

export const H2 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "as" | "variant">
>((props, ref) => <Typography ref={ref} as="h2" variant="h2" {...props} />)
H2.displayName = "H2"

export const H3 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "as" | "variant">
>((props, ref) => <Typography ref={ref} as="h3" variant="h3" {...props} />)
H3.displayName = "H3"

export const Body = React.forwardRef<
  HTMLParagraphElement,
  Omit<TypographyProps, "as" | "variant">
>((props, ref) => <Typography ref={ref} as="p" variant="body" {...props} />)
Body.displayName = "Body"

export const Stat = React.forwardRef<
  HTMLDivElement,
  Omit<TypographyProps, "as" | "variant">
>((props, ref) => <Typography ref={ref} as="div" variant="stat" {...props} />)
Stat.displayName = "Stat"

export const Badge = React.forwardRef<
  HTMLSpanElement,
  Omit<TypographyProps, "as" | "variant">
>((props, ref) => <Typography ref={ref} as="span" variant="badge" {...props} />)
Badge.displayName = "Badge"

export { Typography, typographyVariants }