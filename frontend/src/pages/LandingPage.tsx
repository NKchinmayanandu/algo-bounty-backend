import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Zap, Lock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

/* ──────────────────── Sakura Orb Background ──────────────────── */
function SakuraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sakura orb 1 - large, top right
      const x1 = canvas.width * 0.7 + Math.sin(time * 0.3) * 60;
      const y1 = canvas.height * 0.3 + Math.cos(time * 0.2) * 40;
      const grad1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, 400);
      grad1.addColorStop(0, "rgba(244, 114, 182, 0.12)");
      grad1.addColorStop(0.5, "rgba(167, 139, 250, 0.06)");
      grad1.addColorStop(1, "transparent");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sakura orb 2 - medium, bottom left
      const x2 = canvas.width * 0.2 + Math.cos(time * 0.25) * 50;
      const y2 = canvas.height * 0.7 + Math.sin(time * 0.35) * 30;
      const grad2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, 300);
      grad2.addColorStop(0, "rgba(139, 92, 246, 0.1)");
      grad2.addColorStop(0.6, "rgba(244, 114, 182, 0.04)");
      grad2.addColorStop(1, "transparent");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Small accent orb
      const x3 = canvas.width * 0.5 + Math.sin(time * 0.4) * 80;
      const y3 = canvas.height * 0.15 + Math.cos(time * 0.3) * 20;
      const grad3 = ctx.createRadialGradient(x3, y3, 0, x3, y3, 150);
      grad3.addColorStop(0, "rgba(103, 232, 249, 0.06)");
      grad3.addColorStop(1, "transparent");
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.008;
      requestAnimationFrame(render);
    };
    const frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

/* ──────────────────── Hero Section ──────────────────── */
function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 w-full text-center mx-auto max-w-3xl flex flex-col items-center justify-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sakura-400/8 border border-sakura-400/15 text-sakura-300 text-xs font-medium tracking-wide uppercase">
            <Sparkles size={14} />
            Powered by Algorand Smart Contracts
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8"
        >
          <span className="block text-text-primary">Trustless Bounty</span>
          <span className="block text-gradient-sakura">Escrow</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Eliminate trust issues in open bounty platforms with automated escrow
          agents. Secure, transparent, and fully on-chain.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={() => navigate("/create")}
            className="min-w-[200px]"
          >
            Create Service
            <ArrowRight size={16} />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/dashboard/tasks")}
            className="min-w-[200px]"
          >
            View Active Services
          </Button>
        </motion.div>
      </div>

      {/* Bottom stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-12 left-0 right-0 px-6"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-12 md:gap-20">
          {[
            { value: "100%", label: "On-chain Escrow" },
            { value: "0", label: "Trust Required" },
            { value: "<2s", label: "Settlement Time" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="block text-2xl md:text-3xl font-bold text-text-primary">
                {stat.value}
              </span>
              <span className="block text-xs text-text-muted mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-text-muted/30 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-sakura-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ──────────────────── Scroll Story ──────────────────── */
function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const stories = [
    {
      text: "Bounties fail due to lack of trust",
      sub: "Anonymous contributors rarely receive fair compensation.",
    },
    {
      text: "Payments get delayed or disputed",
      sub: "Manual verification creates friction and delays.",
    },
    {
      text: "Escrow agents automate fairness",
      sub: "Smart contracts hold funds until verified delivery.",
    },
  ];

  return (
    <section ref={ref} className="relative py-32 md:py-48">
      <div className="w-full max-w-3xl mx-auto px-6 flex flex-col items-center justify-center gap-40 md:gap-56">
        {stories.map((story, i) => {
          const start = i / stories.length;
          const end = (i + 0.6) / stories.length;
          return (
            <ScrollStoryItem
              key={i}
              text={story.text}
              sub={story.sub}
              progress={scrollYProgress}
              range={[start, end]}
              index={i}
            />
          );
        })}
      </div>
    </section>
  );
}

function ScrollStoryItem({
  text,
  sub,
  progress,
  range,
  index,
}: {
  text: string;
  sub: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  index: number;
}) {
  const opacity = useTransform(
    progress,
    [range[0], range[0] + 0.05, range[1] - 0.05, range[1]],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [range[0], range[1]], [60, -20]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="flex flex-col items-center justify-center text-center w-full"
    >
      <span className="text-xs font-mono text-sakura-400/60 uppercase tracking-widest mb-4 block">
        0{index + 1}
      </span>
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-4">
        {text}
      </h2>
      <p className="text-lg text-text-secondary max-w-lg mx-auto">{sub}</p>
    </motion.div>
  );
}

/* ──────────────────── Features Grid ──────────────────── */
function FeaturesSection() {
  const features = [
    {
      icon: <Shield size={24} />,
      title: "Smart Escrow",
      description:
        "Funds are locked in Algorand smart contracts. Released only after verified task completion.",
    },
    {
      icon: <Zap size={24} />,
      title: "Instant Settlement",
      description:
        "Verified submissions trigger automatic payment release — no manual intervention needed.",
    },
    {
      icon: <Lock size={24} />,
      title: "Trustless by Design",
      description:
        "No intermediaries. The protocol ensures fair outcomes for both creators and contributors.",
    },
  ];

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-mono text-sakura-400/60 uppercase tracking-widest mb-4 block">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
            Built for fairness
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass-card p-8 group"
            >
              <div className="w-12 h-12 rounded-xl bg-sakura-400/10 border border-sakura-400/20 flex items-center justify-center text-sakura-400 mb-6 group-hover:bg-sakura-400/15 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-text-secondary leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── Footer ──────────────────── */
function Footer() {
  return (
    <footer className="relative py-16 px-6 border-t border-border-subtle">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gradient-sakura">
            Bounty Escrow
          </span>
          <span className="text-xs text-text-muted font-mono">Agent</span>
        </div>
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} Bounty Escrow Agent. Built on Algorand.
        </p>
      </div>
    </footer>
  );
}

/* ──────────────────── Landing Page ──────────────────── */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-surface-950">
      <SakuraBackground />
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-gradient-sakura">
                Bounty Escrow
              </span>
              <span className="text-[10px] text-text-muted font-mono mt-1">
                Agent
              </span>
            </a>
            <div className="flex items-center gap-4">
              <a
                href="/login"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Sign in
              </a>
              <Button
                size="sm"
                onClick={() => (window.location.href = "/create")}
              >
                Create Bounty
              </Button>
            </div>
          </div>
        </nav>

        <HeroSection />
        <ScrollStory />
        <FeaturesSection />
        <Footer />
      </div>
    </div>
  );
}
