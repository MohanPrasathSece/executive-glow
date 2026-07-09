import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
  useMotionValue,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Compass,
  GraduationCap,
  Users,
  Workflow,
  Check,
  Plus,
  Minus,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meridian — Executive AI & Transformation Advisory" },
      {
        name: "description",
        content:
          "Meridian partners with leaders on AI strategy, learning, leadership and organizational transformation. Executive advisory for ambitious enterprises.",
      },
    ],
  }),
  component: Index,
});

/* ---------- helpers ---------- */

function useCountUp(target: number, duration = 1600) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return { ref, value };
}

function MagneticButton({
  children,
  variant = "primary",
  href = "#contact",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 will-change-transform";
  const styles =
    variant === "primary"
      ? "bg-brand text-brand-foreground shadow-[var(--shadow-glow)] hover:bg-brand-hover"
      : "bg-background text-ink border border-brand/60 text-brand hover:bg-accent-tint";

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={cn(base, styles)}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </motion.a>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- sections ---------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["Services", "#services"],
    ["Approach", "#approach"],
    ["Work", "#work"],
    ["Insights", "#insights"],
    ["Contact", "#contact"],
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav
        className={cn(
          "glass-nav flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500",
          scrolled ? "shadow-[var(--shadow-glass)]" : "",
        )}
      >
        <a href="#top" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-background">
            <span className="h-2 w-2 rounded-full bg-brand" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            Meridian
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-alt hover:text-ink"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href="#contact"
            className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
          >
            Book a call
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <button
          className="rounded-full border border-hairline p-2 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1">
            <span className="block h-0.5 w-4 bg-ink" />
            <span className="block h-0.5 w-4 bg-ink" />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 w-[calc(100%-2rem)] max-w-6xl rounded-3xl glass-nav p-4 md:hidden"
          >
            <ul className="flex flex-col">
              {links.map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-ink hover:bg-surface-alt"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const w = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });
  return (
    <motion.div
      style={{ scaleX: w, transformOrigin: "0% 50%" }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-brand"
    />
  );
}

function HeroArt() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -60]);
  return (
    <motion.div
      style={{ y }}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* soft grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #E5E7EB 1px, transparent 1px), linear-gradient(to bottom, #E5E7EB 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse at 60% 30%, rgba(0,0,0,0.9), transparent 65%)",
        }}
      />
      {/* abstract orange orb */}
      <div className="absolute right-[-10%] top-[10%] h-[520px] w-[520px] rounded-full bg-accent-tint blur-3xl" />
      {/* line illustration */}
      <svg
        className="absolute right-6 top-32 hidden h-[420px] w-[420px] text-brand/70 md:block"
        viewBox="0 0 400 400"
        fill="none"
      >
        {[...Array(9)].map((_, i) => (
          <motion.circle
            key={i}
            cx="200"
            cy="200"
            r={30 + i * 18}
            stroke="currentColor"
            strokeWidth="1"
            opacity={0.15 + i * 0.05}
            initial={{ pathLength: 0, rotate: 0 }}
            animate={{ pathLength: 1, rotate: 360 }}
            transition={{
              pathLength: { duration: 2 + i * 0.15, ease: "easeOut" },
              rotate: { duration: 60 + i * 8, repeat: Infinity, ease: "linear" },
            }}
            style={{ transformOrigin: "200px 200px" }}
          />
        ))}
        <circle cx="200" cy="200" r="4" fill="currentColor" />
      </svg>
    </motion.div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-40 pb-28 md:pt-52 md:pb-36">
      <HeroArt />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background/60 px-3 py-1 text-xs font-medium text-ink-soft backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Executive advisory · AI · Transformation
          </span>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight text-ink md:text-7xl">
            Clarity for the leaders
            <br />
            reshaping their industry
            <span className="text-brand">.</span>
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
            Meridian is a boutique advisory partnering with executive teams on AI
            strategy, learning, leadership, and organizational transformation —
            translating ambition into measurable outcomes.
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton variant="primary">Start an engagement</MagneticButton>
            <MagneticButton variant="secondary" href="#services">
              Explore our practice
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={4}>
          <div className="mt-16 grid max-w-3xl grid-cols-2 gap-8 border-t border-hairline pt-8 md:grid-cols-4">
            {[
              ["12+", "Years advising"],
              ["40", "Global engagements"],
              ["96%", "Retention"],
              ["4.9", "Client NPS"],
            ].map(([k, v]) => (
              <div key={v}>
                <div className="font-numeric text-2xl font-semibold text-ink">{k}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-ink-soft">
                  {v}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Marquee() {
  const logos = [
    "Northwind",
    "Aperture",
    "Helios",
    "Vantage",
    "Meridian Bank",
    "Kestrel",
    "Lumen Health",
    "Foundry Labs",
  ];
  const items = [...logos, ...logos];
  return (
    <section className="border-y border-hairline bg-surface-alt py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-ink-soft">
          Trusted by leadership teams at
        </p>
        <div className="mt-6 overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-14">
            {items.map((n, i) => (
              <span
                key={i}
                className="whitespace-nowrap font-display text-xl font-semibold tracking-tight text-ink/40"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const items = [
    {
      icon: Sparkles,
      title: "AI Consulting",
      desc: "From opportunity mapping to production AI systems — designed with human judgement at the center.",
      bullets: ["AI strategy & governance", "Use-case discovery", "Build vs. buy roadmaps"],
    },
    {
      icon: GraduationCap,
      title: "Learning Strategy",
      desc: "Modern learning architectures that scale capability across geographies, functions and career stages.",
      bullets: ["Capability frameworks", "Academy design", "Measurement systems"],
    },
    {
      icon: Users,
      title: "Leadership Development",
      desc: "Executive programs that sharpen judgement, accelerate decisions and align teams around a shared future.",
      bullets: ["C-suite coaching", "Leader labs", "Succession & readiness"],
    },
    {
      icon: Workflow,
      title: "Organizational Transformation",
      desc: "Operating model redesign that pairs strategy with the muscle to execute — cleanly and confidently.",
      bullets: ["Operating model", "Change architecture", "Portfolio governance"],
    },
  ];

  return (
    <section id="services" className="py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-brand">
                Our practice
              </span>
              <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
                Four disciplines. One outcome:
                <span className="text-brand"> durable advantage.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <p className="max-w-md text-ink-soft">
              Every engagement is led by a senior partner and built for the
              specifics of your industry, team and moment.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {items.map((s, i) => (
            <Reveal key={s.title} delay={i}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-hairline bg-background p-8 transition-all duration-500 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[var(--shadow-elegant)]">
                <div className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-tint text-brand">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-3 text-ink-soft">{s.desc}</p>
                <ul className="mt-6 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-ink">
                      <Check className="h-4 w-4 text-brand" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="absolute right-8 top-8 opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="h-5 w-5 text-brand" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bento() {
  return (
    <section className="bg-surface-alt py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] text-brand">Why Meridian</span>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            A partner built for the pace of modern leadership.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-6 md:grid-rows-2">
          <Reveal className="md:col-span-4 md:row-span-1">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-hairline bg-background p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">Signature framework</p>
                <h3 className="mt-3 font-display text-3xl font-semibold text-ink">
                  The Meridian Compass™
                </h3>
                <p className="mt-3 max-w-xl text-ink-soft">
                  A decision architecture that aligns strategy, capability and
                  culture — used across every engagement to keep intent and
                  execution on one line.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-16 w-16 rounded-full border border-brand/40 bg-accent-tint" />
                <div className="h-10 w-10 rounded-full bg-brand" />
                <div className="h-6 w-6 rounded-full bg-ink" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={1} className="md:col-span-2">
            <div className="flex h-full flex-col justify-between rounded-3xl bg-ink p-8 text-background">
              <p className="text-xs uppercase tracking-[0.2em] text-background/60">
                Senior-led
              </p>
              <p className="font-display text-2xl font-semibold leading-tight">
                Every engagement led by a partner with 15+ years of
                <span className="text-brand"> operator experience</span>.
              </p>
            </div>
          </Reveal>

          <Reveal delay={2} className="md:col-span-2">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-hairline bg-background p-8">
              <Compass className="h-6 w-6 text-brand" />
              <div>
                <h3 className="font-display text-xl font-semibold text-ink">
                  Industry fluency
                </h3>
                <p className="mt-2 text-sm text-ink-soft">
                  Financial services, healthcare, technology, energy.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={3} className="md:col-span-2">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-hairline bg-accent-tint p-8">
              <span className="font-numeric text-4xl font-semibold text-ink">
                <Counter to={72} suffix="%" />
              </span>
              <p className="text-sm text-ink-soft">
                average productivity lift on AI-enabled workflows within 9 months.
              </p>
            </div>
          </Reveal>

          <Reveal delay={4} className="md:col-span-2">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-hairline bg-background p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                Global reach
              </p>
              <p className="font-display text-2xl font-semibold text-ink">
                14 cities · 6 time zones · one team.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { ref, value } = useCountUp(to);
  return (
    <span ref={ref} className="font-numeric">
      {value}
      {suffix}
    </span>
  );
}

function Stats() {
  const stats = [
    { k: 240, s: "+", label: "Executives coached" },
    { k: 40, s: "", label: "Global engagements" },
    { k: 96, s: "%", label: "Client retention" },
    { k: 12, s: "×", label: "Average ROI" },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 rounded-3xl border border-hairline p-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i}>
              <div>
                <div className="font-numeric text-5xl font-semibold tracking-tight text-ink">
                  <Counter to={s.k} suffix={s.s} />
                </div>
                <p className="mt-2 text-sm text-ink-soft">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    {
      n: "01",
      t: "Discover",
      d: "Executive interviews, data diagnostics and market context set an honest baseline.",
    },
    {
      n: "02",
      t: "Design",
      d: "We co-create the target operating model, capability map and prioritized portfolio.",
    },
    {
      n: "03",
      t: "Deliver",
      d: "Embedded teams ship pilots, transfer capability and instrument what matters.",
    },
    {
      n: "04",
      t: "Sustain",
      d: "Governance rhythm, coaching cadences and measurement keep momentum after we leave.",
    },
  ];
  return (
    <section id="approach" className="bg-surface-alt py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-14 md:grid-cols-[1fr_2fr]">
          <Reveal>
            <div className="md:sticky md:top-32">
              <span className="text-xs uppercase tracking-[0.2em] text-brand">Approach</span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
                A calm, senior-led process built on four beats.
              </h2>
              <p className="mt-4 text-ink-soft">
                Predictable pace. Uncompromising quality. Zero theatrics.
              </p>
            </div>
          </Reveal>

          <ol className="relative border-l border-hairline pl-8">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i}>
                <li className="relative mb-10 last:mb-0">
                  <span className="absolute -left-[41px] top-1 grid h-6 w-6 place-items-center rounded-full border border-brand bg-background">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                  </span>
                  <div className="flex items-baseline gap-4">
                    <span className="font-numeric text-sm text-brand">{s.n}</span>
                    <h3 className="font-display text-2xl font-semibold text-ink">
                      {s.t}
                    </h3>
                  </div>
                  <p className="mt-2 max-w-lg text-ink-soft">{s.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function CaseStudies() {
  const cases = [
    {
      sector: "Financial services",
      title: "Rewiring a global bank around AI-augmented advisors",
      metric: "+38% advisor productivity",
      hue: "bg-accent-tint",
    },
    {
      sector: "Healthcare",
      title: "Building a leadership academy for 4,200 clinical managers",
      metric: "94% completion · 4.8/5",
      hue: "bg-surface-alt",
    },
    {
      sector: "Technology",
      title: "Redesigning the operating model of a hyperscaler business unit",
      metric: "$120M reallocated",
      hue: "bg-accent-tint",
    },
  ];
  return (
    <section id="work" className="py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between gap-6">
          <Reveal>
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-brand">
                Selected work
              </span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
                Outcomes, not slideware.
              </h2>
            </div>
          </Reveal>
          <a
            href="#contact"
            className="hidden text-sm font-semibold text-brand hover:text-brand-hover md:inline-flex md:items-center md:gap-1"
          >
            View all engagements <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.title} delay={i}>
              <article className="group h-full overflow-hidden rounded-3xl border border-hairline bg-background transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
                <div className={cn("relative h-56 overflow-hidden", c.hue)}>
                  <svg
                    className="absolute inset-0 h-full w-full text-brand/50"
                    viewBox="0 0 400 200"
                    fill="none"
                  >
                    <path
                      d="M0 160 Q100 60 200 120 T400 80"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M0 180 Q120 90 220 150 T400 110"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.6"
                    />
                    <circle cx="200" cy="120" r="4" fill="currentColor" />
                  </svg>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                    {c.sector}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-ink">
                    {c.title}
                  </h3>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-numeric text-sm font-semibold text-brand">
                      {c.metric}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      q: "Meridian brought a quiet confidence to a very loud year. Their partners are the ones I call before the board meeting.",
      n: "Elena Vasquez",
      r: "Group CEO, Vantage Industries",
    },
    {
      q: "The clearest thinking on AI adoption we've engaged with. Executive-grade, without the theater.",
      n: "David Okafor",
      r: "Chief Digital Officer, Helios Bank",
    },
    {
      q: "They built the leadership program that finally moved our culture. Six quarters later, it's still compounding.",
      n: "Priya Ramanathan",
      r: "CHRO, Lumen Health",
    },
  ];
  return (
    <section id="insights" className="bg-ink py-28 text-background md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] text-brand">
            Client voices
          </span>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-5xl">
            The relationships behind the results.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {quotes.map((t, i) => (
            <Reveal key={t.n} delay={i}>
              <figure className="flex h-full flex-col justify-between rounded-3xl border border-background/10 bg-background/[0.03] p-8">
                <blockquote className="font-display text-lg leading-relaxed">
                  “{t.q}”
                </blockquote>
                <figcaption className="mt-8 border-t border-background/10 pt-6">
                  <div className="font-semibold">{t.n}</div>
                  <div className="text-sm text-background/60">{t.r}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    {
      q: "How are engagements typically structured?",
      a: "Most engagements run 8–20 weeks, led by a senior partner with a small embedded team. We scope tightly around outcomes, not billable hours.",
    },
    {
      q: "Do you work with in-house teams or replace them?",
      a: "We are explicitly partners to your team. Capability transfer is a first-class objective in every engagement — the goal is for you to outgrow us.",
    },
    {
      q: "What industries do you focus on?",
      a: "Financial services, healthcare, technology and energy — with a bias toward complex, regulated environments where clarity compounds.",
    },
    {
      q: "How do you approach AI responsibly?",
      a: "Human judgement stays at the center. We design governance, oversight and measurement in from day one, alongside the technology.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-28 md:py-36">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] text-brand">
            Common questions
          </span>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Details that matter.
          </h2>
        </Reveal>

        <div className="mt-12 divide-y divide-hairline border-y border-hairline">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-lg font-semibold text-ink">
                    {it.q}
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-hairline text-ink-soft transition-colors group-hover:text-brand">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-12 text-ink-soft">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="bg-surface-alt py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-14 md:grid-cols-2">
          <Reveal>
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-brand">
                Start a conversation
              </span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
                Bring us your hardest question.
              </h2>
              <p className="mt-4 max-w-md text-ink-soft">
                Tell us what you're navigating. A senior partner will reply
                within one business day.
              </p>

              <div className="mt-10 space-y-4 border-t border-hairline pt-8 text-sm">
                <a
                  href="mailto:partners@meridian.co"
                  className="flex items-center gap-3 text-ink hover:text-brand"
                >
                  <Mail className="h-4 w-4 text-brand" /> partners@meridian.co
                </a>
                <div className="text-ink-soft">London · New York · Singapore</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="rounded-3xl border border-hairline bg-background p-8 shadow-[var(--shadow-elegant)]"
            >
              <div className="grid gap-5">
                <Field label="Full name" name="name" placeholder="Jane Doe" />
                <Field label="Work email" name="email" type="email" placeholder="jane@company.com" />
                <Field label="Organization" name="org" placeholder="Company" />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    What are you exploring?
                  </label>
                  <textarea
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-hairline bg-background px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                    placeholder="A few sentences on the challenge or opportunity."
                  />
                </div>
                <Button
                  type="submit"
                  className="mt-2 h-12 rounded-full bg-brand text-brand-foreground hover:bg-brand-hover"
                >
                  {sent ? "Thank you — we'll be in touch" : "Request a conversation"}
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-hairline bg-background px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-hairline py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-background">
            <span className="h-2 w-2 rounded-full bg-brand" />
          </span>
          <span className="font-display text-lg font-bold text-ink">Meridian</span>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink-soft">
          <a href="#services" className="hover:text-ink">Services</a>
          <a href="#approach" className="hover:text-ink">Approach</a>
          <a href="#work" className="hover:text-ink">Work</a>
          <a href="#contact" className="hover:text-ink">Contact</a>
          <a href="#" className="hover:text-ink">Privacy</a>
        </nav>
        <p className="text-xs text-ink-soft">
          © {new Date().getFullYear()} Meridian Advisory. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ---------- page ---------- */

function Index() {
  return (
    <div className="min-h-screen bg-background text-ink">
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Bento />
        <Stats />
        <Process />
        <CaseStudies />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
