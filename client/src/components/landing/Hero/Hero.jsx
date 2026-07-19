import BackgroundGlow from "./BackgroundGlow";
import HeroContent from "./HeroContent";
import HeroIllustration from "./HeroIllustration";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <BackgroundGlow />

      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[1400px] grid-cols-1 items-center gap-16 px-8 py-8 lg:grid-cols-2 lg:px-12">
        <HeroContent />

        <HeroIllustration />
      </div>
    </section>
  );
};

export default Hero;