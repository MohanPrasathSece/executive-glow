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
      { title: "Simply Innovative Consulting" },
      {
        name: "description",
        content:
          "Simply Innovative Consulting partners with leaders on strategic innovation, business transformation, and executive advisory. Consulting for ambitious enterprises.",
      },
    ],
  }),
  component: Index,
});

/* ---------- helpers ---------- */

function useCountUp(target: number, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isInView, target, duration]);

  return { count, ref };
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
    "inline-flex items-center justify-center px-6 py-3 text-sm font-medium gap-1.5 rounded-full transition-all group";

  const variants = {
    primary:
      "bg-brand text-brand-foreground hover:shadow-[var(--shadow-elegant)] group-hover:-translate-y-0.5",
    secondary:
      "border border-hairline bg-background text-ink hover:bg-surface-alt group-hover:-translate-y-0.5",
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={cn(base, variants[variant])}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
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
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={fadeUp}
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
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["Services", "#services"],
    ["Approach", "#approach"],
    ["Work", "#work"],
    ["Contact", "#contact"],
  ] as const;

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
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
            SIC
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

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-hairline bg-background p-4 shadow-[var(--shadow-elegant)] md:hidden"
            >
              {links.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="block rounded-lg px-4 py-2 text-sm text-ink-soft hover:bg-surface-alt hover:text-ink"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}

function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      className="fixed top-0 left-0 right-0 h-1 bg-brand z-50 origin-left"
      style={{ scaleX }}
    />
  );
}

function HeroArt() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
    </div>
  );
}

function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-16">
      <HeroArt />

      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: scrollY * 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </motion.div>

      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-ink leading-tight">
            Transform your enterprise
          </h1>
        </Reveal>

        <Reveal delay={1}>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-ink-soft md:text-xl">
            Simply Innovative Consulting is a boutique advisory partnering with executive teams on strategic innovation,
            business transformation, and leadership — translating ambition into measurable outcomes.
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton variant="primary">Start an engagement</MagneticButton>
            <MagneticButton variant="secondary" href="#services">
              Explore our practice
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={4}>
          <div className="mt-16 grid max-w-3xl mx-auto grid-cols-2 gap-8 border-t border-hairline pt-8 md:grid-cols-4">
            {[
              ["15+", "Years advising"],
              ["50+", "Global engagements"],
              ["98%", "Retention"],
              ["12×", "Average ROI"],
            ].map(([value, label]) => (
              <Reveal key={label} delay={0.5}>
                <div>
                  <div className="font-numeric text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                    {value}
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">{label}</p>
                </div>
              </Reveal>
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
    "Ascent Bank",
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
  const services = [
    {
      icon: Sparkles,
      title: "Strategy & Innovation",
      description: "Navigate market disruption and chart new growth vectors with confidence.",
    },
    {
      icon: Users,
      title: "Leadership Development",
      description: "Build high-performing executive teams equipped for tomorrow's challenges.",
    },
    {
      icon: Workflow,
      title: "Organizational Transformation",
      description: "Redesign your operating model to drive agility and competitive advantage.",
    },
    {
      icon: Compass,
      title: "Digital Transformation",
      description: "Harness emerging technologies to unlock new business possibilities.",
    },
  ];

  return (
    <section id="services" className="py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] text-brand">What we do</span>
        </Reveal>

        <Reveal delay={1}>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Advisory built for the pace of modern enterprise.
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-8 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="rounded-2xl border border-hairline bg-background p-8 hover:shadow-[var(--shadow-elegant)] transition-shadow">
                <s.icon className="h-8 w-8 text-brand" />
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-ink-soft">{s.description}</p>
              </div>
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
          <span className="text-xs uppercase tracking-[0.2em] text-brand">Why Simply Innovative Consulting</span>
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
                  The SIC Navigator™
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
            <div className="rounded-3xl border border-hairline bg-background p-8">
              <GraduationCap className="h-8 w-8 text-brand" />
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                Outcomes-focused
              </h3>
              <p className="mt-2 text-sm text-ink-soft">
                We measure success by your business results, not our hours.
              </p>
            </div>
          </Reveal>

          <Reveal delay={1.2} className="md:col-span-2">
            <div className="rounded-3xl border border-hairline bg-background p-8">
              <Users className="h-8 w-8 text-brand" />
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                Senior talent
              </h3>
              <p className="mt-2 text-sm text-ink-soft">
                Partners and principals on every engagement.
              </p>
            </div>
          </Reveal>

          <Reveal delay={1.4} className="md:col-span-2">
            <div className="rounded-3xl border border-hairline bg-background p-8">
              <Workflow className="h-8 w-8 text-brand" />
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                Built to last
              </h3>
              <p className="mt-2 text-sm text-ink-soft">
                We embed capability so impact compounds.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { count, ref } = useCountUp(to);
  return (
    <div ref={ref}>
      {count}
      {suffix}
    </div>
  );
}

function Stats() {
  const stats = [
    { k: 240, s: "+", label: "Executives coached" },
    { k: 50, s: "+", label: "Global engagements" },
    { k: 98, s: "%", label: "Client retention" },
    { k: 12, s: "×", label: "Average ROI" },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 rounded-3xl border border-hairline p-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
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
  return (
    <section id="approach" className="py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] text-brand">How we work</span>
        </Reveal>

        <Reveal delay={1}>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            A proven methodology that delivers.
          </h2>
        </Reveal>

        <div className="mt-20 space-y-4 md:space-y-6">
          {[
            {
              phase: "Diagnose",
              description: "Deep discovery to understand your context, challenges, and aspirations.",
            },
            {
              phase: "Design",
              description: "Co-create the roadmap that aligns strategy, culture, and execution.",
            },
            {
              phase: "Deploy",
              description: "Hands-on partnership to translate strategy into measurable impact.",
            },
            {
              phase: "Sustain",
              description: "Build internal capability so momentum compounds long-term.",
            },
          ].map((p, i) => (
            <Reveal key={p.phase} delay={i * 0.1}>
              <div className="rounded-2xl border border-hairline bg-background p-6 md:p-8 hover:shadow-[var(--shadow-elegant)] transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-brand-foreground font-semibold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">{p.phase}</h3>
                    <p className="mt-1 text-ink-soft">{p.description}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
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
        <div className="flex items-end justify-between gap-6 flex-col md:flex-row">
          <Reveal>
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-brand">
                Impact
              </span>
              <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
                Outcomes from our engagements.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <a href="#contact" className="group inline-flex items-center gap-2 font-medium text-brand hover:gap-3 transition-all">
              Explore all case studies
              <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <div className={cn("rounded-2xl border border-hairline p-8", c.hue)}>
                <p className="text-xs uppercase tracking-[0.2em] text-brand">{c.sector}</p>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">{c.title}</h3>
                <p className="mt-4 text-2xl font-semibold text-ink">{c.metric}</p>
              </div>
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
      q: "Simply Innovative Consulting brought a quiet confidence to a very loud year. Their partners are the ones I call before the board meeting.",
      n: "Elena Vasquez",
      r: "Group CEO, Vantage Industries",
    },
    {
      q: "The clearest thinking on business transformation we've engaged with. Executive-grade, without the theater.",
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
            What our clients say.
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {quotes.map((q, i) => (
            <Reveal key={q.n} delay={i * 0.1}>
              <div className="rounded-2xl border border-hairline/30 bg-ink/50 backdrop-blur p-8">
                <blockquote className="text-lg leading-relaxed italic text-background/90">
                  "{q.q}"
                </blockquote>
                <div className="mt-6 pt-6 border-t border-hairline/30">
                  <p className="font-semibold text-background">{q.n}</p>
                  <p className="mt-1 text-sm text-background/70">{q.r}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const faqs = [
    {
      q: "What is the typical engagement length?",
      a: "Engagements typically run 3-12 months, depending on scope and complexity. We work flexibly to match your cadence.",
    },
    {
      q: "Who will be involved from SIC?",
      a: "A senior partner leads every engagement, supported by specialists matched to your challenge.",
    },
    {
      q: "How do you measure success?",
      a: "We define success metrics at the start—whether revenue impact, capability building, or organizational outcomes.",
    },
    {
      q: "What industries do you serve?",
      a: "We work across financial services, healthcare, technology, consumer, and public sector enterprises.",
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-28 md:py-36">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] text-brand">FAQ</span>
        </Reveal>

        <Reveal delay={1}>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Frequently asked questions.
          </h2>
        </Reveal>

        <div className="mt-12 space-y-4">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full rounded-2xl border border-hairline bg-background p-6 text-left hover:shadow-[var(--shadow-elegant)] transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display font-semibold text-ink">{f.q}</h3>
                  {open === i ? (
                    <Minus className="h-5 w-5 text-brand flex-shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-brand flex-shrink-0" />
                  )}
                </div>

                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-hairline text-ink-soft"
                    >
                      {f.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </Reveal>
          ))}
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
                  href="mailto:hello@simplyinnovativeconsulting.com"
                  className="flex items-center gap-3 text-ink hover:text-brand"
                >
                  <Mail className="h-4 w-4 text-brand" /> hello@simplyinnovativeconsulting.com
                </a>
                <div className="text-ink-soft">New York · London · Singapore</div>
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
          <span className="font-display text-lg font-bold text-ink">Simply Innovative Consulting</span>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink-soft">
          <a href="#services" className="hover:text-ink">Services</a>
          <a href="#approach" className="hover:text-ink">Approach</a>
          <a href="#work" className="hover:text-ink">Work</a>
          <a href="#contact" className="hover:text-ink">Contact</a>
          <a href="#" className="hover:text-ink">Privacy</a>
        </nav>

        <p className="text-xs text-ink-soft">
          © {new Date().getFullYear()} Simply Innovative Consulting. All rights reserved.
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

export default Index;
