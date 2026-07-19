import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";

const HeroButtons = () => {
  return (
    <div className="mt-10 flex flex-wrap gap-4">
      <Button size="lg" className="gap-2 rounded-xl">
        Start Free
        <ArrowRight size={18} />
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="gap-2 rounded-xl"
      >
        <PlayCircle size={18} />
        Watch Demo
      </Button>
    </div>
  );
};

export default HeroButtons;