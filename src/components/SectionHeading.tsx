import type { ReactNode } from "react";
import { Reveal } from "@/components/interactive";

type Props = { id: string; eyebrow: string; title: ReactNode; children?: ReactNode };

export function SectionHeading({ id, eyebrow, title, children }: Props) {
  return (
    <Reveal className="mb-10 max-w-2xl sm:mb-14">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 id={id} className="font-display text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {children && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{children}</p>}
    </Reveal>
  );
}
