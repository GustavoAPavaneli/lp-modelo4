"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Zap, Clock, ShieldCheck, Star, CheckCircle, Lock, ArrowRight, Check, Dumbbell } from "lucide-react";

/* ─── Fitness Carousel — CSS-only, loop infinito sem travamentos ─── */
const FITNESS_IMGS = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80&fit=crop",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80&fit=crop",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=80&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80&fit=crop",
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&q=80&fit=crop",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&q=80&fit=crop",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200&q=80&fit=crop",
  "https://images.unsplash.com/photo-1549476464-37392f717541?w=1200&q=80&fit=crop",
];
/* Cada imagem fica visível 4s + 1.5s de fade = 5.5s × 8 imagens = 44s de ciclo */
const CYCLE = 35.2;
const STEP  = CYCLE / FITNESS_IMGS.length; // 4.4s por imagem

function FitnessCarousel() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {FITNESS_IMGS.map((src, i) => (
        <div
          key={src}
          className="fitness-img"
          style={{ animationDelay: `${i * STEP}s` }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="600px"
            priority={i === 0}
          />
        </div>
      ))}
      {/* Overlay para integrar com o fundo escuro da seção */}
      <div className="absolute inset-0 bg-[#071020]/40" />
    </div>
  );
}

/* ─── Reveal hook ─── */
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function R({ children, className = "", delay = 0, dir = "up" }: {
  children: React.ReactNode; className?: string; delay?: number; dir?: "up"|"left"|"right";
}) {
  const ref = useReveal() as React.RefObject<HTMLDivElement>;
  const cls = dir === "left" ? "reveal-left" : dir === "right" ? "reveal-right" : "reveal";
  return (
    <div ref={ref} className={`${cls} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── Counter ─── */
function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect();
      let n = 0; const step = Math.max(1, Math.ceil(to / 70));
      const t = setInterval(() => { n += step; if (n >= to) { setV(to); clearInterval(t); } else setV(n); }, 20);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toLocaleString("pt-BR")}{suffix}</span>;
}



/* ════════════════════════════ PAGE ════════════════════════════ */
export default function Page() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [email, setEmail]       = useState("");
  const [done, setDone]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Produto",     href: "#produto"     },
    { label: "Benefícios",  href: "#beneficios"  },
    { label: "Resultados",  href: "#resultados"  },
    { label: "Avaliações",  href: "#avaliacoes"  },
  ];

  return (
    <div className="bg-white">

      {/* ━━━━━━━━━━━━━━━━━━━━ NAVBAR ━━━━━━━━━━━━━━━━━━━━ */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "nav-blur" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          <a href="#produto" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0a1628] to-[#1d4ed8] flex items-center justify-center shadow-md group-hover:shadow-blue-500/30 transition-shadow">
              <Dumbbell className="w-4 h-4 text-white"/>
            </div>
            <div className="leading-tight">
              <p className="text-[13px] font-black text-[#0a1628] uppercase tracking-widest leading-none">Sua Marca</p>
              <p className="text-[9px] text-blue-500 uppercase tracking-[0.2em] font-bold">Aqui</p>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <a key={l.label} href={l.href} className="nav-link text-[13px] font-semibold text-slate-600 hover:text-[#0a1628] transition-colors">
                {l.label}
              </a>
            ))}
            <a href="#contato" className="btn-primary text-[12px] px-5 py-2.5">Quero Saber Mais</a>
          </nav>

          <button className="md:hidden flex flex-col gap-1.5" onClick={() => setOpen(!open)}>
            <span className={`block w-5 h-[1.5px] bg-[#0a1628] transition-all ${open ? "rotate-45 translate-y-[7px]" : ""}`}/>
            <span className={`block w-5 h-[1.5px] bg-[#0a1628] transition-all ${open ? "opacity-0" : ""}`}/>
            <span className={`block w-5 h-[1.5px] bg-[#0a1628] transition-all ${open ? "-rotate-45 -translate-y-[7px]" : ""}`}/>
          </button>
        </div>

        <div className={`md:hidden bg-white border-t border-slate-100 overflow-hidden transition-all ${open ? "max-h-64" : "max-h-0"}`}>
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map(l => (
              <a key={l.label} href={l.href} className="py-2.5 text-[13px] font-semibold text-slate-700 border-b border-slate-100" onClick={() => setOpen(false)}>{l.label}</a>
            ))}
            <a href="#contato" className="btn-primary mt-2 text-center text-[12px]" onClick={() => setOpen(false)}>Quero Saber Mais</a>
          </div>
        </div>
      </header>


      {/* ━━━━━━━━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━━━━━ */}
      <section id="produto" className="min-h-screen pt-16 bg-[#f4f7ff] flex items-center overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center w-full">

          {/* Visual do produto */}
          <R dir="left" className="flex justify-center">
            <div className="relative w-80 h-96 md:w-[440px] md:h-[500px]">

              {/* Glow de fundo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-300/30 blur-3xl"/>

              {/* Haltere — decorativo, canto superior esquerdo */}
              <div className="absolute -left-4 top-8 -rotate-[30deg] opacity-80 w-28 md:w-36">
                <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-lg">
                  <defs>
                    <linearGradient id="dbar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#94a3b8"/>
                      <stop offset="50%" stopColor="#64748b"/>
                      <stop offset="100%" stopColor="#475569"/>
                    </linearGradient>
                    <linearGradient id="dweight" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#334155"/>
                      <stop offset="100%" stopColor="#1e293b"/>
                    </linearGradient>
                  </defs>
                  {/* Anilhas esquerda */}
                  <rect x="0"  y="4"  width="28" height="52" rx="5" fill="url(#dweight)"/>
                  <rect x="26" y="10" width="16" height="40" rx="4" fill="#475569"/>
                  {/* Barra */}
                  <rect x="40" y="26" width="120" height="8"  rx="4" fill="url(#dbar)"/>
                  {/* Anilhas direita */}
                  <rect x="158" y="10" width="16" height="40" rx="4" fill="#475569"/>
                  <rect x="172" y="4"  width="28" height="52" rx="5" fill="url(#dweight)"/>
                  {/* Reflexo barra */}
                  <rect x="40" y="26" width="120" height="3" rx="2" fill="rgba(255,255,255,0.15)"/>
                </svg>
              </div>

              {/* Bag de suplemento — peça principal */}
              <div className="float absolute left-1/2 top-8 -translate-x-1/2 w-48 md:w-60 z-10" style={{animationDelay:"0s"}}>
                <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-2xl">
                  <defs>
                    <linearGradient id="bag-body" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%"   stopColor="#0c2461"/>
                      <stop offset="45%"  stopColor="#1d4ed8"/>
                      <stop offset="100%" stopColor="#0c2461"/>
                    </linearGradient>
                    <linearGradient id="bag-shine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%"   stopColor="rgba(255,255,255,0)"/>
                      <stop offset="35%"  stopColor="rgba(255,255,255,0.12)"/>
                      <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                    </linearGradient>
                    <linearGradient id="bag-top" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%"   stopColor="#0a1f55"/>
                      <stop offset="50%"  stopColor="#1e3a8a"/>
                      <stop offset="100%" stopColor="#0a1f55"/>
                    </linearGradient>
                    <linearGradient id="seal-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%"   stopColor="#f8fafc"/>
                      <stop offset="100%" stopColor="#e2e8f0"/>
                    </linearGradient>
                    <radialGradient id="label-bg" cx="50%" cy="50%" r="50%">
                      <stop offset="0%"   stopColor="#1e40af"/>
                      <stop offset="100%" stopColor="#1e3a8a"/>
                    </radialGradient>
                    <filter id="bshadow">
                      <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0c2461" floodOpacity="0.5"/>
                    </filter>
                  </defs>

                  {/* ── Corpo do bag (doypack) ── */}
                  <path filter="url(#bshadow)"
                    d="M30 40 C28 20 38 10 100 8 C162 10 172 20 170 40
                       L180 230 C182 256 162 270 100 272 C38 270 18 256 20 230 Z"
                    fill="url(#bag-body)"/>

                  {/* Brilho lateral esquerdo */}
                  <path d="M36 45 C34 28 42 18 70 14 L65 265 C42 260 22 248 24 228 Z"
                    fill="rgba(255,255,255,0.07)"/>

                  {/* Reflexo central */}
                  <path d="M30 40 C28 20 38 10 100 8 C162 10 172 20 170 40 L168 80 C168 80 140 72 100 72 C60 72 32 80 32 80 Z"
                    fill="url(#bag-shine)"/>

                  {/* Selagem do topo */}
                  <path d="M38 38 C38 18 62 8 100 8 C138 8 162 18 162 38 L158 50 C158 50 132 42 100 42 C68 42 42 50 42 50 Z"
                    fill="url(#bag-top)"/>

                  {/* Linha de selagem */}
                  <path d="M42 44 Q100 36 158 44" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none"/>
                  <path d="M44 48 Q100 40 156 48" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none"/>

                  {/* ── Seal circular (logo) ── */}
                  <circle cx="100" cy="155" r="58" fill="url(#seal-grad)" opacity="0.92"/>
                  <circle cx="100" cy="155" r="58" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                  <circle cx="100" cy="155" r="50" fill="none" stroke="rgba(30,58,138,0.15)" strokeWidth="1"/>

                  {/* Interior do seal */}
                  <circle cx="100" cy="155" r="42" fill="url(#label-bg)"/>
                  <circle cx="100" cy="155" r="42" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>

                  {/* Texto no seal */}
                  <text x="100" y="143" textAnchor="middle" fill="rgba(255,255,255,0.5)"
                    fontSize="7" fontWeight="600" fontFamily="system-ui" letterSpacing="3">SUA MARCA</text>
                  <text x="100" y="158" textAnchor="middle" fill="white"
                    fontSize="13" fontWeight="900" fontFamily="system-ui" letterSpacing="1">PRODUTO</text>
                  <line x1="76" y1="164" x2="124" y2="164" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  <text x="100" y="175" textAnchor="middle" fill="rgba(255,255,255,0.45)"
                    fontSize="6.5" fontFamily="system-ui" letterSpacing="2">SUPLEMENTO</text>

                  {/* Gramatura */}
                  <rect x="70" y="240" width="60" height="18" rx="9" fill="rgba(255,255,255,0.12)"/>
                  <text x="100" y="252" textAnchor="middle" fill="rgba(255,255,255,0.6)"
                    fontSize="8" fontWeight="700" fontFamily="system-ui">900g · 30 doses</text>

                  {/* Fundo do bag (gusset) */}
                  <ellipse cx="100" cy="268" rx="76" ry="6" fill="rgba(0,0,0,0.25)"/>
                </svg>
              </div>

              {/* Cápsulas soltas — canto inferior direito */}
              <div className="absolute right-2 bottom-16 flex flex-col gap-1.5 rotate-[15deg]">
                {[0,1,2,3].map(i => (
                  <div key={i} className="flex gap-1">
                    <div className="w-5 h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-sm opacity-80"/>
                    <div className="w-5 h-2.5 rounded-full bg-gradient-to-r from-blue-300 to-blue-500 shadow-sm opacity-70"/>
                  </div>
                ))}
              </div>

              {/* Badge */}
              <div className="absolute top-4 right-4 bg-[#1d4ed8] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 shadow-lg z-20">
                LANÇAMENTO
              </div>
            </div>
          </R>

          {/* Texto */}
          <div className="flex flex-col gap-5">
            <R delay={0}>
              <p className="text-[11px] font-black text-blue-600 uppercase tracking-[.22em]">Proposta clara para o seu cliente</p>
            </R>
            <R delay={60}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#0a1628] uppercase leading-[.95] tracking-tight">
                NOME DO<br/><span className="text-[#1d4ed8]">PRODUTO</span>
              </h1>
            </R>
            <R delay={110}>
              <span className="inline-block bg-[#1d4ed8] text-white text-[11px] font-black uppercase tracking-widest px-4 py-2">
                Texto de apoio / proposta aqui
              </span>
            </R>
            <R delay={160}>
              <p className="text-slate-500 text-[15px] leading-relaxed max-w-md">
                Descreva aqui o benefício central do seu produto. Uma frase objetiva que comunica a transformação que o cliente vai ter.
              </p>
              <p className="text-[#1d4ed8] text-sm font-semibold mt-2 italic">
                "Uma pergunta que conecta diretamente com a dor do seu cliente?"
              </p>
            </R>
            <R delay={200}>
              <div className="w-10 h-[2px] bg-[#1d4ed8]"/>
              <p className="text-[12px] font-black text-[#0a1628] uppercase tracking-widest mt-3">
                Plano de 3 Meses · Acesso Completo
              </p>
            </R>
            <R delay={250}>
              <div className="flex flex-wrap gap-3">
                <a href="#beneficios" className="btn-outline">Saiba Mais</a>
                <a href="#contato" className="btn-primary">Quero Começar <ArrowRight className="w-4 h-4"/></a>
              </div>
            </R>
            <R delay={290}>
              <div className="flex flex-wrap gap-5">
                {["Garantia 30 dias","Entrega Rápida","Suporte Incluso"].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-[12px] text-slate-500">
                    <Check className="w-3.5 h-3.5 text-green-500"/>{t}
                  </span>
                ))}
              </div>
            </R>
          </div>
        </div>
      </section>


      {/* ━━━━━━━━━━━━━━━━━━━━ BENEFÍCIOS ━━━━━━━━━━━━━━━━━━━━ */}
      <section id="beneficios" className="bg-[#071020] overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[480px_1fr]">

          {/* Carrossel fitness */}
          <div className="relative min-h-[500px] lg:min-h-0 overflow-hidden">
            <FitnessCarousel />
            {/* Gradiente de integração com o conteúdo ao lado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#071020] z-10"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#071020]/50 via-transparent to-transparent z-10"/>
          </div>

          {/* Conteúdo */}
          <div className="px-10 md:px-14 py-16 flex flex-col justify-center">
            <R delay={0}>
              <p className="text-blue-500 text-[11px] font-black uppercase tracking-[.2em] mb-3">Mostre ao cliente o que ele precisa</p>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight mb-10">
                PONTO FORTE<br/>DO PRODUTO
              </h2>
            </R>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon:<Zap className="w-5 h-5"/>,         title:"Benefício 1", desc:"Resultado específico que o cliente obtém. Seja direto e concreto." },
                { icon:<Clock className="w-5 h-5"/>,       title:"Benefício 2", desc:"Sem efeitos negativos das alternativas. Mais praticidade real." },
                { icon:<ShieldCheck className="w-5 h-5"/>, title:"Benefício 3", desc:"Resultado específico que o cliente obtém. Seja direto e concreto." },
                { icon:<Star className="w-5 h-5"/>,        title:"Benefício 4", desc:"Transformação real. Como a vida do cliente muda de forma visível." },
              ].map((item, i) => (
                <R key={item.title} delay={60 + i * 60}
                  className="p-5 border border-white/[.08] hover:border-white/20 hover:bg-white/[.03] transition-all duration-200 cursor-default">
                  <div className="text-blue-400 mb-2">{item.icon}</div>
                  <p className="text-white text-[13px] font-bold mb-1">{item.title}</p>
                  <p className="text-slate-500 text-[12px] leading-relaxed">{item.desc}</p>
                </R>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ━━━━━━━━━━━━━━━━━━━━ STATS ━━━━━━━━━━━━━━━━━━━━ */}
      <section id="resultados" className="bg-[#040c18]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[.06]">
          {[
            { n:1200, s:"+", label:"Clientes",   sub:"satisfeitos",    accent:false },
            { n:720,  s:"+", label:"Treinos",    sub:"realizados",     accent:false },
            { n:98,   s:"%", label:"Aprovação",  sub:"dos usuários",   accent:false },
            { n:105,  s:"+", label:"Programas",  sub:"entregues",      accent:true  },
          ].map((st, i) => (
            <R key={i} delay={i * 70}
              className={`px-8 py-12 text-center ${st.accent ? "bg-[#1d4ed8]" : ""}`}>
              <p className="text-4xl md:text-5xl font-black text-white tabular-nums mb-2">
                <Count to={st.n} suffix={st.s}/>
              </p>
              <p className="text-[11px] font-black uppercase tracking-widest text-white/80">{st.label}</p>
              <p className={`text-[11px] mt-0.5 ${st.accent ? "text-blue-200/60" : "text-slate-600"}`}>{st.sub}</p>
            </R>
          ))}
        </div>
      </section>


      {/* ━━━━━━━━━━━━━━━━━━━━ AVALIAÇÕES ━━━━━━━━━━━━━━━━━━━━ */}
      <section id="avaliacoes" className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">

          <R className="text-center mb-16">
            <p className="text-blue-600 text-[11px] font-black uppercase tracking-[.2em] mb-3">Quem já usou aprovou</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a1628] uppercase tracking-tight">ÁREA DE AVALIAÇÕES</h2>
            <div className="w-12 h-[3px] bg-[#1d4ed8] mx-auto mt-5"/>
          </R>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { initial:"A", color:"bg-rose-500",   delay:0   },
              { initial:"B", color:"bg-blue-600",   delay:100 },
              { initial:"C", color:"bg-violet-600", delay:200 },
            ].map((t, i) => (
              <R key={i} delay={t.delay}
                className="card border border-slate-100 p-7 flex flex-col gap-4">

                {/* Topo: avatar + nome + estrelas */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm`}>
                    {t.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0a1628] font-bold text-[14px] leading-tight">Nome do Cliente</p>
                    <p className="text-slate-400 text-[11px] mb-1">Profissão · Cidade</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_,k) => <span key={k} className="text-yellow-400 text-[13px]">★</span>)}
                    </div>
                  </div>
                </div>

                {/* Separador */}
                <div className="h-px bg-slate-100"/>

                {/* Comentário */}
                <p className="text-slate-500 text-[13px] leading-relaxed">
                  Escreva aqui o depoimento real do seu cliente. Seja específico sobre o problema que tinha antes e o resultado obtido após usar o produto.
                </p>
              </R>
            ))}
          </div>
        </div>
      </section>


      {/* ━━━━━━━━━━━━━━━━━━━━ CAPTURA ━━━━━━━━━━━━━━━━━━━━ */}
      <section id="contato" className="bg-[#071020] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[.04]"
          style={{backgroundImage:"radial-gradient(circle, #3b82f6 1px, transparent 1px)",backgroundSize:"32px 32px"}}/>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-3xl rounded-full"/>

        <div className="relative max-w-lg mx-auto px-6 text-center">
          <R>
            <span className="inline-block border border-white/15 text-white/50 text-[10px] font-black uppercase tracking-[.22em] px-4 py-1.5 mb-8">
              Acesso Exclusivo
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight tracking-tight mb-4">
              COMECE SUA<br/><span className="text-blue-400">TRANSFORMAÇÃO</span>
            </h2>
            <div className="w-10 h-[2px] bg-blue-500 mx-auto my-6"/>
            <p className="text-slate-400 text-[15px] leading-relaxed mb-10">
              Cadastre seu e-mail e receba conteúdo exclusivo, acesso antecipado e novidades diretamente na sua caixa de entrada.
            </p>

            {done ? (
              <div className="border border-white/10 p-10">
                <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-4"/>
                <p className="text-white font-black text-lg uppercase tracking-wide mb-2">Cadastrado!</p>
                <p className="text-slate-500 text-sm">Verifique seu e-mail em breve.</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); if(email){ setDone(true); setEmail(""); }}}
                className="flex flex-col sm:flex-row gap-2">
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail..." required className="input-dark"/>
                <button type="submit" className="btn-light whitespace-nowrap">Garantir Acesso</button>
              </form>
            )}

            <p className="text-slate-700 text-[11px] mt-5 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3"/> Sem spam. Seus dados estão seguros.
            </p>
          </R>
        </div>
      </section>


      {/* ━━━━━━━━━━━━━━━━━━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="bg-[#02060e] py-8 border-t border-white/[.04]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#0a1628] to-[#1d4ed8] flex items-center justify-center">
              <Dumbbell className="w-3.5 h-3.5 text-white"/>
            </div>
            <span className="text-white/50 font-bold text-[12px] uppercase tracking-widest">Sua Marca Aqui</span>
          </div>
          <p className="text-slate-700 text-[11px]">© 2025 Sua Empresa. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            {["Privacidade","Termos","Contato"].map(l => (
              <a key={l} href="#" className="text-slate-700 hover:text-slate-500 text-[11px] uppercase tracking-wider transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
