import HeroBadge from "./HeroBadge";
import HeroButtons from "./HeroButtons";
import HeroTrust from "./HeroTrust";

const HeroContent = () => {
  return (
    <div className="flex max-w-xl flex-col gap-8">
      <HeroBadge />

      <div>
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 lg:text-7xl">
          Practice Smarter.
          <br />

          <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-sky-500 bg-clip-text text-transparent">
            Interview Better.
          </span>
        </h1>
      </div>

      <p className="max-w-lg text-lg leading-8 text-slate-600">
        Practice technical interviews with AI-generated questions,
        personalized feedback, and detailed performance insights to help you
        land your dream job.
      </p>

      <HeroButtons />

      <HeroTrust />
    </div>
  );
};

export default HeroContent;