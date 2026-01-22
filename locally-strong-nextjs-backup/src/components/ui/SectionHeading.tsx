import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  headline: string;
  subheadline?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  headline,
  subheadline,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered && 'text-center', className)}>
      <h2 className="font-heading text-3xl text-charcoal md:text-4xl">
        {headline}
      </h2>
      {subheadline && (
        <p className="mt-4 text-lg text-charcoal/70">{subheadline}</p>
      )}
    </div>
  );
}
