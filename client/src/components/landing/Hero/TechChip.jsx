import { motion } from "framer-motion";

const TechChip = ({
  icon: Icon,
  label,
  className = "",
  delay = 0,
}) => {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
      }}
      className={`absolute flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-xl ${className}`}
    >
      <Icon
        size={18}
        className="text-indigo-600"
      />

      <span className="text-sm font-medium">
        {label}
      </span>
    </motion.div>
  );
};

export default TechChip;