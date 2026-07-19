import AICore from "./AICore";
import FeatureCard from "./FeatureCard";
import OrbitLines from "./OrbitLines";
import TechChip from "./TechChip";
import {
  Atom,
  Server,
  Database,
  Puzzle,
  FileCode,
  Sparkles,
  ChartSpline,
  MessageSquare,
} from "lucide-react";

const HeroIllustration = () => {
  return (
    <div className="relative flex h-[650px] w-full items-center justify-center">

      <OrbitLines />

      <AICore />

      <>
  <div className="absolute top-28 left-44 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_20px_#6366f1]" />

  <div className="absolute top-40 right-32 h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_20px_#8b5cf6]" />

  <div className="absolute bottom-44 left-24 h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_20px_#0ea5e9]" />

  <div className="absolute bottom-32 right-40 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_20px_#6366f1]" />
</>

      {/* Top */}

      <TechChip
    icon={Atom}
    label="React"
    className="-top-2 left-1/2 -translate-x-1/2"
    delay={0}
/>

<TechChip
    icon={Server}
    label="Node.js"
    className="left-0 top-1/2 -translate-y-1/2"
    delay={0.2}
/>

<TechChip
    icon={Database}
    label="SQL"
    className="right-0 top-1/2 -translate-y-1/2"
    delay={0.4}
/>

<TechChip
    icon={FileCode}
    label="JavaScript"
    className="bottom-16 left-12"
    delay={0.6}
/>

<TechChip
    icon={Puzzle}
    label="DSA"
    className="bottom-2 left-1/2 -translate-x-1/2"
    delay={0.8}
/>

      {/* Cards */}

     <FeatureCard
    icon={Sparkles}
    title="AI Feedback"
    className="top-8 right-4"
/>

<FeatureCard
    icon={MessageSquare}
    title="Mock Interviews"
    className="bottom-15 right-0"
/>

<FeatureCard
    icon={ChartSpline}
    title="Performance Analytics"
    className="left-3 top-26"
/>

    </div>
  );
};

export default HeroIllustration;