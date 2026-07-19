import { motion } from "framer-motion";

const OrbitLines = () => {
  return (
    <>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 80,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute h-[430px] w-[430px] rounded-full border border-slate-200/30"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute h-[330px] w-[330px] rounded-full border border-slate-200/20"
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute h-[250px] w-[250px] rounded-full border border-slate-200/10"
      />
    </>
  );
};

export default OrbitLines;