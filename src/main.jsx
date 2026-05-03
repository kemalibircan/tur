import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Facebook,
  Headphones,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plane,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
  Youtube,
  Bot
} from "lucide-react";
import { dictionary, getContent, getTours } from "./mockData";
import "./styles.css";

const paths = ["/", "/turlar", "/hakkimizda", "/blog", "/sss", "/iletisim", "/ai-chatbot"];
const languages = [
  ["tr", "Türkçe"],
  ["en", "English"],
  ["ar", "العربية"],
];

function useRouter() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return { path, navigate };
}

function useLanguage() {
  const [lang, setLang] = useState(localStorage.getItem("rotanova-lang") || "tr");
  useEffect(() => {
    localStorage.setItem("rotanova-lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dictionary[lang].dir;
  }, [lang]);
  return { lang, setLang };
}

function App() {
  const { path, navigate } = useRouter();
  const { lang, setLang } = useLanguage();
  const content = useMemo(() => getContent(lang), [lang]);
  const { d } = content;

  useEffect(() => {
    const tour = content.tours.find((item) => path === `/turlar/${item.slug}`);
    const titles = {
      "/": `RotaNova Travel | ${lang === "tr" ? "Güvenilir Kültür ve Tatil Turları" : lang === "en" ? "Trusted Culture and Holiday Tours" : "جولات ثقافية وعطلات موثوقة"}`,
      "/turlar": `${d.nav[1]} | RotaNova Travel`,
      "/hakkimizda": `${d.nav[2]} | RotaNova Travel`,
      "/blog": `${d.nav[3]} | RotaNova Travel`,
      "/iletisim": `${d.nav[5]} | RotaNova Travel`,
      "/rezervasyon": `${d.reserve} | RotaNova Travel`,
      "/sss": `${d.nav[4]} | RotaNova Travel`,
      "/blog-detay": `${content.blogPosts[0].title} | RotaNova Travel`,
      "/ai-chatbot": `${d.aiChatbot.whyUse} | RotaNova Travel`,
    };
    document.title = tour ? `${tour.title} | RotaNova Travel` : titles[path] || titles["/"];
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", tour?.description || d.heroText);
  }, [path, lang, content, d]);

  const tourFromPath = content.tours.find((item) => path === `/turlar/${item.slug}`);
  const page =
    path === "/" ? <HomePage content={content} navigate={navigate} /> :
    path === "/turlar" ? <ToursPage content={content} navigate={navigate} /> :
    tourFromPath ? <TourDetailPage content={content} tour={tourFromPath} navigate={navigate} /> :
    path === "/hakkimizda" ? <AboutPage content={content} /> :
    path === "/blog" ? <BlogPage content={content} navigate={navigate} /> :
    path === "/blog-detay" ? <BlogDetailPage content={content} navigate={navigate} /> :
    path === "/iletisim" ? <ContactPage content={content} /> :
    path === "/rezervasyon" ? <ReservationPage content={content} /> :
    path === "/sss" ? <FAQPage content={content} /> :
    path === "/ai-chatbot" ? <AIChatbotPage content={content} navigate={navigate} /> :
    <HomePage content={content} navigate={navigate} />;

  return (
    <div className="min-h-screen bg-cloud text-ink">
      <Header content={content} path={path} navigate={navigate} lang={lang} setLang={setLang} />
      <div key={path} className="animate-fade-in">
        {page}
      </div>
      <Footer content={content} navigate={navigate} />
      <WhatsAppButton />
      <AIChatbot content={content} navigate={navigate} />
    </div>
  );
}

function Header({ content, path, navigate, lang, setLang }) {
  const { d } = content;
  const [open, setOpen] = useState(false);
  const go = (to) => {
    navigate(to);
    setOpen(false);
  };
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => go("/")} className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500 text-white shadow-soft">
            <Plane size={22} />
          </span>
          <span className="text-left rtl:text-right">
            <span className="block text-lg font-extrabold text-ink">RotaNova</span>
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Travel</span>
          </span>
        </button>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {paths.map((item, index) => (
            <button
              key={item}
              type="button"
              onClick={() => go(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                path === item ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {d.nav[index]}
            </button>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSelect lang={lang} setLang={setLang} />
          <LinkButton to="/rezervasyon" navigate={navigate}>{d.reserve}</LinkButton>
        </div>
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-ink lg:hidden"
        >
          <Menu size={22} />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-ink/40 lg:hidden" role="dialog" aria-modal="true">
          <div className="ms-auto h-full w-full max-w-sm bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold text-ink">RotaNova Travel</span>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <div className="mt-6"><LanguageSelect lang={lang} setLang={setLang} /></div>
            <nav className="mt-6 grid gap-2" aria-label="Mobile">
              {paths.map((item, index) => (
                <button key={item} type="button" onClick={() => go(item)} className="rounded-2xl px-4 py-3 text-left font-semibold text-slate-800 hover:bg-brand-50 rtl:text-right">
                  {d.nav[index]}
                </button>
              ))}
            </nav>
            <LinkButton to="/rezervasyon" navigate={navigate} className="mt-6 w-full">{d.reserve}</LinkButton>
          </div>
        </div>
      )}
    </header>
  );
}

function LanguageSelect({ lang, setLang }) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">
      <span>{dictionary[lang].langLabel}</span>
      <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent outline-none">
        {languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
      </select>
    </label>
  );
}

function LinkButton({ to, children, variant = "primary", className = "", navigate }) {
  const styles =
    variant === "secondary" ? "bg-white text-brand-700 hover:bg-brand-50" :
    variant === "outline" ? "border border-slate-300 bg-white text-ink hover:border-brand-500 hover:text-brand-700" :
    "bg-brand-500 text-white hover:bg-brand-600";
  return (
    <button type="button" onClick={() => navigate(to)} className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${styles} ${className}`}>
      {children}
    </button>
  );
}

function Footer({ content, navigate }) {
  const { d, tours } = content;
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500"><Plane size={22} /></span>
            <div>
              <p className="text-xl font-extrabold">RotaNova Travel</p>
              <p className="text-sm text-slate-300">Dünyayı keşfet, anılarını büyüt.</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">{d.heroText}</p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, index) => (
              <button key={index} type="button" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-brand-500" aria-label="Social media">
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>
        <FooterColumn title={d.nav[0]} items={paths.map((p, i) => [d.nav[i], p])} navigate={navigate} />
        <FooterColumn title={d.popularTours} items={tours.slice(0, 4).map((tour) => [tour.title, `/turlar/${tour.slug}`])} navigate={navigate} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-100">{d.nav[5]}</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <span>+90 212 000 00 00</span>
            <span>info@rotanova.com</span>
            <span>İstanbul, Türkiye</span>
          </div>
          <form className="mt-6 flex overflow-hidden rounded-full bg-white">
            <label className="sr-only" htmlFor="newsletter">Newsletter</label>
            <input id="newsletter" type="email" placeholder="E-posta / Email" className="min-w-0 flex-1 px-4 py-3 text-sm text-ink outline-none" />
            <button type="button" className="bg-amber-500 px-4 text-sm font-bold text-ink">OK</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-slate-400">© 2026 RotaNova Travel. Tüm hakları saklıdır.</div>
    </footer>
  );
}

function FooterColumn({ title, items, navigate }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-100">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.map(([label, path]) => (
          <button key={`${label}-${path}`} type="button" onClick={() => navigate(path)} className="text-left text-sm text-slate-300 transition hover:text-white rtl:text-right">
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function HomePage({ content, navigate }) {
  const { d, tours, destinations, testimonials, blogPosts, heroImage } = content;
  return (
    <>
      <section className="relative isolate min-h-[720px] overflow-hidden">
        <img src={heroImage} alt="Travel landscape" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/52 to-ink/20 rtl:bg-gradient-to-l" />
        <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-center px-4 pb-20 pt-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur"><ShieldCheck size={18} /> {d.heroTrust}</p>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">{d.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">{d.heroText}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <LinkButton to="/turlar" navigate={navigate} className="bg-amber-500 text-ink hover:bg-amber-600">{d.discoverTours}<ArrowRight size={18} /></LinkButton>
              <LinkButton to="/rezervasyon" navigate={navigate} variant="secondary">{d.reserve}</LinkButton>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {d.stats.map((item) => <div key={item} className="rounded-3xl border border-white/20 bg-white/12 p-4 backdrop-blur"><p className="text-sm font-bold">{item}</p></div>)}
            </div>
          </div>
        </div>
      </section>
      <main>
        <Section title={d.popularTitle} eyebrow={d.popularTours} text={d.popularText}><TourGrid items={tours} navigate={navigate} d={d} /></Section>
        <Section title={d.whyTitle} eyebrow={d.why} white>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[BadgeCheck, ShieldCheck, Check, Users, Headphones, CalendarDays].map((Icon, index) => (
              <article key={d.whyCards[index]} className="rounded-3xl bg-cloud p-6 ring-1 ring-slate-200">
                <Icon className="text-brand-600" size={28} />
                <h3 className="mt-5 text-xl font-extrabold text-ink">{d.whyCards[index]}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{d.whyCardText}</p>
              </article>
            ))}
          </div>
        </Section>
        <Section title={d.destinationTitle} eyebrow={d.destinations}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{destinations.map((destination) => <DestinationCard key={destination.name} destination={destination} />)}</div>
        </Section>
        <Section title={d.howTitle} eyebrow={d.how} white>
          <div className="grid gap-5 md:grid-cols-3">
            {d.steps.map((step, index) => <article key={step} className="rounded-3xl border border-slate-200 p-6"><span className="grid h-12 w-12 place-items-center rounded-full bg-amber-500 text-lg font-extrabold text-ink">{index + 1}</span><h3 className="mt-5 text-xl font-extrabold text-ink">{step}</h3><p className="mt-3 leading-7 text-slate-600">{d.stepText}</p></article>)}
          </div>
        </Section>
        <Section title={d.testimonialsTitle} eyebrow={d.testimonials}><div className="grid gap-5 md:grid-cols-3">{testimonials.map((item) => <TestimonialCard key={item.name} item={item} />)}</div></Section>
        <Section title={d.blogTitle} eyebrow={d.blog} white><div className="grid gap-6 md:grid-cols-3">{blogPosts.slice(0, 3).map((post) => <BlogCard key={post.title} post={post} navigate={navigate} d={d} />)}</div></Section>
        <CTASection d={d} navigate={navigate} />
      </main>
    </>
  );
}

function Section({ eyebrow, title, text, white = false, children }) {
  return (
    <section className={`section ${white ? "bg-white" : ""}`}>
      <div className="mx-auto mb-10 max-w-3xl text-center">
        {eyebrow && <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</p>}
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h2>
        {text && <p className="mt-4 text-base leading-7 text-slate-600">{text}</p>}
      </div>
      {children}
    </section>
  );
}

function TourCard({ tour, navigate, d }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-soft">
      <button type="button" onClick={() => navigate(`/turlar/${tour.slug}`)} className="block w-full text-left rtl:text-right">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={tour.image} alt={tour.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-brand-700 rtl:left-auto rtl:right-4">{tour.badge}</span>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div><h3 className="text-xl font-extrabold text-ink">{tour.title}</h3><p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><MapPin size={16} /> {tour.location}</p></div>
            <p className="rounded-2xl bg-amber-500/15 px-3 py-2 text-sm font-extrabold text-amber-600">{tour.price}</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{tour.description}</p>
          <div className="mt-5 flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Clock size={16} /> {tour.duration}</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-bold text-white">{d.details}<ArrowRight size={16} /></span>
          </div>
        </div>
      </button>
    </article>
  );
}

function TourGrid({ items, navigate, d }) {
  return <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((tour) => <TourCard key={tour.slug} tour={tour} navigate={navigate} d={d} />)}</div>;
}

function DestinationCard({ destination }) {
  return (
    <article className="group relative min-h-64 overflow-hidden rounded-3xl">
      <img src={destination.image} alt={destination.name} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
      <h3 className="absolute bottom-5 left-5 text-2xl font-extrabold text-white rtl:left-auto rtl:right-5">{destination.name}</h3>
    </article>
  );
}

function TestimonialCard({ item }) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex gap-1 text-amber-500">{Array.from({ length: item.rating }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}</div>
      <p className="mt-5 leading-7 text-slate-700">“{item.text}”</p>
      <div className="mt-6 border-t border-slate-100 pt-4"><p className="font-extrabold text-ink">{item.name}</p><p className="text-sm text-brand-700">{item.tour}</p></div>
    </article>
  );
}

function BlogCard({ post, navigate, d }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-soft">
      <img src={post.image} alt={post.title} className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-700"><span>{post.category}</span><span className="h-1 w-1 rounded-full bg-slate-300" /><span>{post.date}</span></div>
        <h3 className="mt-3 text-xl font-extrabold text-ink">{post.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
        <button type="button" onClick={() => navigate("/blog-detay")} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-brand-700">{d.continue}<ArrowRight size={16} /></button>
      </div>
    </article>
  );
}

function CTASection({ d, navigate }) {
  return (
    <section className="bg-brand-700 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div><h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{d.ctaTitle}</h2><p className="mt-3 text-lg text-brand-50">{d.ctaText}</p></div>
        <LinkButton to="/iletisim" navigate={navigate} className="bg-amber-500 text-ink hover:bg-amber-600">{d.contactNow}</LinkButton>
      </div>
    </section>
  );
}

function ToursPage({ content, navigate }) {
  const { d, tours } = content;
  const [filters, setFilters] = useState({ search: "", region: "", category: "", duration: "", price: "" });
  const [mobileFilters, setMobileFilters] = useState(false);
  const filtered = useMemo(() => {
    return tours.filter((tour) => {
      const text = `${tour.title} ${tour.location} ${tour.category}`.toLowerCase();
      const days = Number(tour.duration.match(/\d+/)?.[0] || 0);
      return text.includes(filters.search.toLowerCase()) &&
        (!filters.region || tour.category.toLowerCase().includes(filters.region.toLowerCase())) &&
        (!filters.category || tour.category.toLowerCase().includes(filters.category.toLowerCase())) &&
        (!filters.duration || (filters.duration === "short" ? days <= 4 : days >= 5)) &&
        (!filters.price || (filters.price === "local" ? tour.price.includes("₺") : tour.price.includes("€")));
    });
  }, [filters, tours]);
  return (
    <main className="section">
      <PageIntro title={d.nav[1]} text={d.pageToursText} />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">{d.search}</span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 rtl:left-auto rtl:right-4" size={20} />
          <input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder={d.search} className="input pl-12 rtl:pl-4 rtl:pr-12" />
        </label>
        <button type="button" onClick={() => setMobileFilters(!mobileFilters)} className="rounded-full border border-slate-300 bg-white px-5 py-3 font-bold lg:hidden">{d.filters}</button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className={`${mobileFilters ? "block" : "hidden"} lg:block`}><FilterSidebar d={d} filters={filters} setFilters={setFilters} /></div>
        <div><p className="mb-4 text-sm font-semibold text-slate-600">{filtered.length} {d.listed}</p><TourGrid items={filtered} navigate={navigate} d={d} /></div>
      </div>
    </main>
  );
}

function FilterSidebar({ d, filters, setFilters }) {
  const categories = ["Culture", "Nature", "Gastronomy", "Premium", "City", "Kültür", "Doğa", "Gastronomi", "Şehir", "ثقافة", "طبيعة", "طعام"];
  return (
    <aside className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-extrabold text-ink">{d.filters}</h2>
      <div className="mt-5 grid gap-5">
        <Field label={d.route}><select className="input" value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })}><option value="">{d.all}</option><option>Yurt İçi</option><option>Domestic</option><option>داخلي</option><option>Yurt Dışı</option><option>International</option><option>خارجي</option></select></Field>
        <Field label="Kategori / Category"><select className="input" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}><option value="">{d.all}</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></Field>
        <Field label={d.duration}><select className="input" value={filters.duration} onChange={(e) => setFilters({ ...filters, duration: e.target.value })}><option value="">{d.all}</option><option value="short">1-4</option><option value="long">5+</option></select></Field>
        <Field label={d.startingPrice}><select className="input" value={filters.price} onChange={(e) => setFilters({ ...filters, price: e.target.value })}><option value="">{d.all}</option><option value="local">₺</option><option value="euro">€</option></select></Field>
      </div>
    </aside>
  );
}

function TourDetailPage({ content, tour, navigate }) {
  const { d, tours, faqs } = content;
  const similar = tours.filter((item) => item.slug !== tour.slug).slice(0, 3);
  return (
    <main>
      <section className="relative min-h-[560px] overflow-hidden">
        <img src={tour.image} alt={tour.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-transparent rtl:bg-gradient-to-l" />
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-end px-4 pb-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">{tour.category}</p>
            <h1 className="text-4xl font-extrabold sm:text-6xl">{tour.title}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-100">{tour.summary}</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[[d.duration, tour.duration], [d.route, tour.route], [d.startingPrice, tour.price], [d.departures, tour.departures]].map(([label, value]) => (
                <div key={label} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-2 font-extrabold text-ink">{value}</p></div>
              ))}
            </div>
            <DetailBlock title={d.tourSummary}>{tour.summary}</DetailBlock>
            <DetailBlock title={d.itinerary}><ol className="grid gap-3">{tour.itinerary.map((day) => <li key={day} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">{day}</li>)}</ol></DetailBlock>
            <div className="grid gap-5 md:grid-cols-2">
              {[[d.included, tour.included], [d.excluded, tour.excluded], [d.accommodation, tour.accommodation], [d.transport, tour.transport], [d.documents, tour.documents]].map(([title, items]) => (
                <DetailBlock key={title} title={title}><ul className="grid gap-2">{items.map((item) => <li key={item} className="flex gap-2 text-slate-700"><Check className="mt-1 shrink-0 text-brand-600" size={17} /> {item}</li>)}</ul></DetailBlock>
              ))}
            </div>
            <DetailBlock title={d.cancellation}>{tour.cancellation}</DetailBlock>
            <DetailBlock title={d.nav[4]}><FAQAccordion items={faqs.slice(0, 4)} /></DetailBlock>
            <DetailBlock title={d.similarTours}><TourGrid items={similar} navigate={navigate} d={d} /></DetailBlock>
          </div>
          <aside className="h-fit rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200 lg:sticky lg:top-28">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">{d.startingPrice}</p>
            <p className="mt-2 text-4xl font-extrabold text-ink">{tour.price}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{d.priceNote}</p>
            <LinkButton to="/rezervasyon" navigate={navigate} className="mt-6 w-full">{d.reserve}</LinkButton>
            <div className="mt-6 grid gap-3 text-sm text-slate-700">{tour.included.slice(0, 3).map((item) => <span key={item} className="flex items-center gap-2"><Check size={17} className="text-brand-600" /> {item}</span>)}</div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function DetailBlock({ title, children }) {
  return <section className="rounded-3xl bg-cloud p-6 ring-1 ring-slate-200"><h2 className="text-2xl font-extrabold text-ink">{title}</h2><div className="mt-4 leading-7 text-slate-700">{children}</div></section>;
}

function AboutPage({ content }) {
  const { d, aboutImage } = content;
  const values = {
    tr: ["Şeffaf planlama", "Yerel deneyim", "Sorumlu turizm"],
    en: ["Transparent planning", "Local experience", "Responsible tourism"],
    ar: ["تخطيط شفاف", "تجربة محلية", "سياحة مسؤولة"],
  }[document.documentElement.lang || "tr"];
  return (
    <main className="section">
      <PageIntro title={d.nav[2]} text={d.pageAboutText} />
      <div className="grid gap-8 lg:grid-cols-2">
        <img src={aboutImage} alt="RotaNova team" className="h-full min-h-96 rounded-3xl object-cover shadow-soft" />
        <div className="grid content-center gap-6">
          <DetailBlock title={d.nav[2]}>RotaNova Travel; güvenilir operasyon, samimi iletişim ve iyi kurgulanmış rotalarla misafirlerine keyifli seyahatler sunar.</DetailBlock>
          <DetailBlock title="Misyon / Mission">Her yolculuğu güvenli, planlı ve ilham verici bir deneyime dönüştürmek.</DetailBlock>
          <DetailBlock title="Vizyon / Vision">Dünya rotalarını daha erişilebilir, anlaşılır ve konforlu hale getirmek.</DetailBlock>
        </div>
      </div>
      <div className="mt-14"><StatsSection /></div>
      <Section title={d.whyTitle} eyebrow={d.why}>{<div className="grid gap-5 md:grid-cols-3">{values.map((item) => <article key={item} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><h3 className="text-xl font-extrabold text-ink">{item}</h3><p className="mt-3 leading-7 text-slate-600">{d.whyCardText}</p></article>)}</div>}</Section>
    </main>
  );
}

function StatsSection() {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["12.000+", "misafir / guests"], ["50+", "destinasyon / destinations"], ["300+", "tur / tours"], ["98%", "memnuniyet / satisfaction"]].map(([value, label]) => <div key={label} className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200"><p className="text-4xl font-extrabold text-brand-700">{value}</p><p className="mt-2 text-sm font-semibold text-slate-600">{label}</p></div>)}</div>;
}

function BlogPage({ content, navigate }) {
  const { d, blogPosts } = content;
  const [category, setCategory] = useState(d.all);
  const categories = [d.all, ...new Set(blogPosts.map((post) => post.category))];
  const posts = category === d.all ? blogPosts : blogPosts.filter((post) => post.category === category);
  return (
    <main className="section">
      <PageIntro title={d.nav[3]} text={d.pageBlogText} />
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${category === item ? "bg-brand-500 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}>{item}</button>)}</div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <BlogCard key={post.title} post={post} navigate={navigate} d={d} />)}</div>
    </main>
  );
}

function BlogDetailPage({ content, navigate }) {
  const { d, blogPosts } = content;
  const tips = {
    tr: ["Pasaport sürenizi kontrol edin.", "Vize durumunu erken araştırın.", "Seyahat sigortası yaptırın.", "Bavulunuzu hava durumuna göre hazırlayın.", "Havalimanına erken gidin.", "Yerel para birimini planlayın.", "Telefon ve internet kullanımını ayarlayın.", "Belgelerin dijital kopyasını saklayın.", "Kültürel farklılıklara saygı gösterin.", "Tur şirketiyle seyahat ederek destek alın."],
    en: ["Check your passport validity.", "Research visa requirements early.", "Get travel insurance.", "Pack according to the weather.", "Arrive at the airport early.", "Plan local currency needs.", "Arrange phone and internet use.", "Keep digital copies of documents.", "Respect cultural differences.", "Travel with a tour company for support."],
    ar: ["تحقق من صلاحية جواز السفر.", "ابحث عن متطلبات التأشيرة مبكرا.", "احصل على تأمين سفر.", "جهز حقيبتك حسب الطقس.", "اذهب إلى المطار مبكرا.", "خطط للعملة المحلية.", "رتب استخدام الهاتف والإنترنت.", "احتفظ بنسخ رقمية من الوثائق.", "احترم الاختلافات الثقافية.", "سافر مع شركة جولات للحصول على دعم."],
  }[document.documentElement.lang || "tr"];
  return (
    <main>
      <section className="relative min-h-[480px] overflow-hidden">
        <img src={blogPosts[0].image} alt={blogPosts[0].title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="relative mx-auto flex min-h-[480px] max-w-4xl items-end px-4 pb-14 text-white sm:px-6 lg:px-8">
          <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-100">{blogPosts[0].category}</p><h1 className="mt-4 text-4xl font-extrabold sm:text-6xl">{blogPosts[0].title}</h1><p className="mt-5 text-slate-100">{blogPosts[0].date}</p></div>
        </div>
      </section>
      <article className="section mx-auto max-w-4xl">
        <p className="text-xl leading-9 text-slate-700">{blogPosts[0].excerpt}</p>
        <ol className="mt-10 grid gap-5">{tips.map((tip, index) => <li key={tip} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><h2 className="text-xl font-extrabold text-ink">{index + 1}. {tip}</h2><p className="mt-3 leading-7 text-slate-600">{tip}</p></li>)}</ol>
      </article>
      <CTASection d={d} navigate={navigate} />
    </main>
  );
}

function ContactPage({ content }) {
  const { d } = content;
  const contact = [["Telefon", "+90 212 000 00 00", Phone], ["E-posta", "info@rotanova.com", Mail], ["Adres", "İstanbul, Türkiye", MapPin], ["Çalışma Saatleri", "Pazartesi - Cumartesi, 09:00 - 18:00", Clock]];
  return (
    <main className="section">
      <PageIntro title={d.nav[5]} text={d.pageContactText} />
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <ContactForm d={d} />
        <aside className="grid gap-5">
          {contact.map(([title, text, Icon]) => <div key={title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><Icon className="text-brand-600" /><h2 className="mt-4 font-extrabold text-ink">{title}</h2><p className="mt-2 text-slate-600">{text}</p></div>)}
          <div className="grid min-h-64 place-items-center rounded-3xl bg-slate-200 text-center font-bold text-slate-500">Map placeholder</div>
          <a href="https://wa.me/902120000000" className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 font-extrabold text-white"><MessageCircle size={20} /> WhatsApp</a>
        </aside>
      </div>
    </main>
  );
}

function ContactForm({ d }) {
  const [sent, setSent] = useState(false);
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid gap-4 rounded-3xl bg-white p-6 shadow-soft">
      <Field label={d.form.name}><input required className="input" /></Field>
      <Field label={d.form.email}><input required type="email" className="input" /></Field>
      <Field label={d.form.phone}><input required pattern="^\\+?[0-9\\s()-]{10,}$" className="input" /></Field>
      <Field label="Mesaj / Message"><textarea required className="input min-h-32 resize-y" /></Field>
      <button className="rounded-full bg-brand-500 px-6 py-3 font-extrabold text-white hover:bg-brand-600">{d.form.submit}</button>
      {sent && <p className="rounded-2xl bg-brand-50 p-4 text-sm font-semibold text-brand-700">{d.form.success}</p>}
    </form>
  );
}

function ReservationPage({ content }) {
  const { d } = content;
  return <main className="section"><PageIntro title={d.reserve} text={d.pageReservationText} /><div className="mx-auto max-w-4xl"><ReservationForm content={content} /></div></main>;
}

function ReservationForm({ content }) {
  const { d, tours } = content;
  const [form, setForm] = useState({ name: "", email: "", phone: "", tour: "", guests: "", date: "", notes: "", kvkk: false });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (key, value) => { setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: "" })); };
  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = d.form.requiredName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = d.form.requiredEmail;
    if (!/^\+?[0-9\s()-]{10,}$/.test(form.phone)) next.phone = d.form.requiredPhone;
    if (!form.tour) next.tour = d.form.requiredTour;
    if (!form.guests || Number(form.guests) < 1) next.guests = d.form.requiredGuests;
    if (!form.date) next.date = d.form.requiredDate;
    if (!form.kvkk) next.kvkk = d.form.requiredKvkk;
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = (event) => {
    event.preventDefault();
    setStatus("");
    if (!validate()) return;
    setLoading(true);
    window.setTimeout(() => { setLoading(false); setStatus(d.form.success); setForm({ name: "", email: "", phone: "", tour: "", guests: "", date: "", notes: "", kvkk: false }); }, 650);
  };
  return (
    <form onSubmit={submit} className="grid gap-5 rounded-3xl bg-white p-6 shadow-soft">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label={d.form.name} error={errors.name}><input value={form.name} onChange={(e) => update("name", e.target.value)} className="input" /></Field>
        <Field label={d.form.email} error={errors.email}><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="input" /></Field>
        <Field label={d.form.phone} error={errors.phone}><input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="input" /></Field>
        <Field label={d.form.tour} error={errors.tour}><select value={form.tour} onChange={(e) => update("tour", e.target.value)} className="input"><option value="">{d.form.chooseTour}</option>{tours.map((tour) => <option key={tour.slug}>{tour.title}</option>)}</select></Field>
        <Field label={d.form.guests} error={errors.guests}><input type="number" min="1" value={form.guests} onChange={(e) => update("guests", e.target.value)} className="input" /></Field>
        <Field label={d.form.date} error={errors.date}><input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="input" /></Field>
      </div>
      <Field label={d.form.notes}><textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} className="input min-h-32 resize-y" placeholder={d.form.notesPlaceholder} /></Field>
      <label className="flex items-start gap-3 text-sm text-slate-700"><input type="checkbox" checked={form.kvkk} onChange={(e) => update("kvkk", e.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600" /><span>{d.form.kvkk}</span></label>
      {errors.kvkk && <p className="text-sm font-semibold text-red-600">{errors.kvkk}</p>}
      <button type="submit" className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 font-extrabold text-white hover:bg-brand-600 disabled:opacity-70" disabled={loading}>{loading ? d.form.loading : d.form.submit}</button>
      {status && <p className="rounded-2xl bg-brand-50 p-4 text-sm font-semibold text-brand-700">{status}</p>}
    </form>
  );
}

function FAQPage({ content }) {
  const { d, faqs } = content;
  return <main className="section"><PageIntro title={d.nav[4]} text={d.pageFaqText} /><FAQAccordion items={faqs} /></main>;
}

function FAQAccordion({ items }) {
  const [active, setActive] = useState(0);
  return (
    <div className="mx-auto max-w-4xl divide-y divide-slate-200 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
      {items.map((item, index) => (
        <div key={item.question}>
          <button type="button" onClick={() => setActive(active === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-extrabold text-ink rtl:text-right" aria-expanded={active === index}>
            {item.question}<ChevronDown className={`shrink-0 transition ${active === index ? "rotate-180" : ""}`} size={20} />
          </button>
          {active === index && <p className="px-5 pb-5 leading-7 text-slate-600">{item.answer}</p>}
        </div>
      ))}
    </div>
  );
}

function Field({ label, error, children }) {
  return <label className="grid gap-2 text-sm font-bold text-ink"><span>{label}</span>{children}{error && <span className="font-semibold text-red-600">{error}</span>}</label>;
}

function PageIntro({ title, text }) {
  return (
    <section className="mb-10 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">RotaNova Travel</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{text}</p>
    </section>
  );
}

function WhatsAppButton() {
  return <a href="https://wa.me/902120000000" className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-green-600 text-white shadow-soft transition hover:scale-105 rtl:left-5 rtl:right-auto" aria-label="WhatsApp"><MessageCircle size={26} /></a>;
}

function AIChatbot({ content, navigate }) {
  const { d } = content;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: d.aiChatbot.welcome }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: d.aiChatbot.reply }]);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-24 right-5 z-40 grid h-16 w-16 origin-center place-items-center rounded-full bg-gradient-to-r from-brand-500 to-indigo-600 text-white shadow-soft transition-all duration-300 rtl:left-5 rtl:right-auto ${
          open ? "scale-50 opacity-0 pointer-events-none" : "scale-100 opacity-100 hover:scale-105"
        }`}
        aria-label="AI Chatbot"
      >
        <Bot size={28} />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex h-4 w-4 rounded-full bg-indigo-500"></span>
        </span>
      </button>

      <div 
        className={`fixed bottom-24 right-5 z-50 flex flex-col overflow-hidden rounded-3xl bg-white/95 backdrop-blur shadow-2xl ring-1 ring-black/5 transition-all duration-300 origin-bottom-right rtl:left-5 rtl:right-auto ${
          open ? "scale-100 opacity-100 pointer-events-auto h-[500px] max-h-[80vh] w-[calc(100vw-40px)] sm:w-[380px]" : "scale-50 opacity-0 pointer-events-none h-[500px] w-[calc(100vw-40px)] sm:w-[380px]"
        }`}
        role="dialog" 
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-brand-50 to-indigo-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-sm">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-ink">{d.aiChatbot.title}</h2>
              <p className="text-xs font-semibold text-brand-600 flex items-center gap-1">
                <Sparkles size={12} /> {d.aiChatbot.status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition hover:bg-white hover:text-ink hover:shadow-sm"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "ai" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "ai" 
                    ? "bg-slate-100 text-slate-800 rounded-tl-sm" 
                    : "bg-brand-500 text-white rounded-tr-sm shadow-sm"
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={d.aiChatbot.placeholder}
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none transition focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-500 text-white shadow-sm transition hover:bg-brand-600 disabled:opacity-50"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </form>
          <div className="mt-3 text-center">
             <button
              type="button"
              onClick={() => { setOpen(false); navigate("/ai-chatbot"); }}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 transition"
            >
              {d.aiChatbot.whyUse}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function AIChatbotPage({ content, navigate }) {
  const { d } = content;
  return (
    <main className="section">
      <PageIntro title={d.aiChatbot.whyUse} text={d.aiChatbot.pageText} />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="grid content-center gap-6">
          <DetailBlock title={d.aiChatbot.features[0].title}>{d.aiChatbot.features[0].text}</DetailBlock>
          <DetailBlock title={d.aiChatbot.features[1].title}>{d.aiChatbot.features[1].text}</DetailBlock>
          <DetailBlock title={d.aiChatbot.features[2].title}>{d.aiChatbot.features[2].text}</DetailBlock>
        </div>
        <div className="relative flex min-h-[400px] items-center justify-center rounded-3xl bg-gradient-to-br from-brand-100 to-indigo-100 p-8 shadow-inner overflow-hidden">
          <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
             <div className="bg-gradient-to-r from-brand-500 to-indigo-600 p-4 text-white flex items-center gap-3">
                <Bot size={24} />
                <span className="font-extrabold">{d.aiChatbot.title}</span>
             </div>
             <div className="p-5 grid gap-4 bg-slate-50">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 w-5/6">
                  {d.aiChatbot.welcome}
                </div>
                <div className="bg-brand-500 p-3 rounded-2xl rounded-tr-none shadow-sm text-sm text-white w-3/4 ml-auto">
                  {document.documentElement.lang === 'tr' ? 'Kapadokya turu hakkında bilgi alabilir miyim?' : document.documentElement.lang === 'en' ? 'Can I get information about the Cappadocia tour?' : 'هل يمكنني الحصول على معلومات حول جولة كابادوكيا؟'}
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 w-5/6">
                  {d.aiChatbot.reply}
                </div>
             </div>
          </div>
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/20 blur-3xl"></div>
        </div>
      </div>
      <div className="mt-14 text-center">
         <LinkButton to="/rezervasyon" navigate={navigate} className="bg-indigo-600 text-white hover:bg-indigo-700">{d.aiChatbot.tryNow}</LinkButton>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
