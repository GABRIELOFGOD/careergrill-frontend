import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-3 rounded-lg border border-transparent font-semibold whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-brand-purple text-white hover:bg-brand-purple/90",
        brand: "bg-brand-orange text-brand-ink hover:bg-brand-orange/90",
        outline: "border-brand-ink/25 bg-transparent text-brand-ink hover:border-brand-ink",
        secondary: "bg-brand-blue text-brand-ink hover:bg-brand-sage",
        ghost: "text-brand-ink hover:bg-brand-blue",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-5 text-base",
        xs: "h-8 gap-2 rounded-md px-3 text-xs",
        sm: "h-10 gap-2 rounded-md px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
        "icon-xs": "size-8 rounded-md",
        "icon-sm": "size-9 rounded-md",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
