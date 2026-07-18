import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-8 lg:px-12">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 shadow-lg">
          <BrainCircuit className="h-6 w-6 text-white" />
        </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              AI Interview Coach
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            How it Works
          </a>
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="ghost">
            Login
          </Button>

          <Button>
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;