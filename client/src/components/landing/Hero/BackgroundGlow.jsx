const BackgroundGlow = () => {
  return (
    <>
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-violet-200/20 blur-3xl" />

      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-100/20 blur-[120px]" />
    </>
  );
};

export default BackgroundGlow;