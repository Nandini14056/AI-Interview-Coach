import { BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

const AICore = () => {
  return (
    <motion.div
      animate={{ scale: [1, 1.03, 1] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative z-20"
    >
      {/* Glow */}
      <div className="absolute inset-0 scale-[1.7] rounded-full bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-sky-500/30 blur-[70px]" />

      {/* Rotating Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -inset-5 rounded-full border border-dashed border-indigo-200"
      />

      {/* Glass Circle */}
      <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-white/70 bg-white/60 backdrop-blur-2xl shadow-[0_25px_90px_rgba(99,102,241,0.25)]">

        <div className="flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 via-violet-500 to-sky-500">

          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-inner">

            <BrainCircuit
              size={54}
              className="text-indigo-600"
            />

          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default AICore;