export default function Hero({ stats }) {
  return (
    <section className="relative pt-16 min-h-screen flex flex-col">
      <div className="absolute inset-0 pt-16">
        <img
          loading="lazy"
          decoding="async"
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&h=900&fit=crop&auto=format"
          alt="Students in classroom with teacher presenting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1c2b4a]/70" />
      </div>

      <div className="relative flex-1 max-w-7xl mx-auto px-6 flex flex-col justify-end pb-20 pt-32">
        <div className="max-w-2xl">
          <p className="text-[#b5813a] text-xs tracking-[0.2em] uppercase mb-6 font-medium">
            Elmwood Academy · Since 1884
          </p>
          <h1
            className="text-[#f7f4ef] text-5xl md:text-7xl font-semibold leading-[1.05] mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Where curiosity
            <br />
            <em className="italic font-normal">becomes</em> character.
          </h1>
          <p className="text-[#f7f4ef]/75 text-lg leading-relaxed mb-10 max-w-md">
            A K–12 institution committed to academic rigour, creative
            expression, and the development of principled citizens.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#"
              className="bg-[#b5813a] text-[#f7f4ef] px-8 py-3.5 text-sm font-medium hover:bg-[#9e6f2e] transition-colors"
            >
              Explore Our Programmes
            </a>
            <a
              href="#"
              className="border border-[#f7f4ef]/50 text-[#f7f4ef] px-8 py-3.5 text-sm hover:bg-[#f7f4ef]/10 transition-colors"
            >
              Schedule a Visit
            </a>
          </div>
        </div>
      </div>

      <div className="relative bg-[#1c2b4a] py-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div
                className="text-[#b5813a] text-3xl font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.value}
              </div>
              <div className="text-[#f7f4ef]/60 text-xs tracking-wide mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
