"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import SurrealCanvas from "./SurrealCanvas";
import { contato, whatsappLink } from "@/data/site";
import { hubLinks, perfil } from "@/data/hub";

const PASSO = 120; // ms entre os grupos da entrada
const DURACAO = 900; // ms de cada item
const easeOutCubic = (p: number) => 1 - (1 - p) ** 3;

/** Grupos da entrada: 0 logo · 2 nome+descrição · 3-5 cards · 6 rodapé */
const atraso = (grupo: number) => ({ "--d": `${grupo * PASSO}ms` } as CSSProperties);

type Tilt = { x: number; y: number; alvoX: number; alvoY: number };

export default function SurrealHub() {
  const nome = useRef<HTMLHeadingElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);

  const tilts = useRef<Tilt[]>(
    hubLinks.map(() => ({ x: 0, y: 0, alvoX: 0, alvoY: 0 }))
  );
  const podeHover = useRef(false);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    podeHover.current = matchMedia("(hover: hover)").matches;

    const inicio = performance.now();
    let raf = 0;

    const loop = () => {
      const agora = performance.now();
      const s = reduce ? 0 : agora / 1000;
      const decorrido = agora - inicio;

      // --- Nome: brilho percorrendo o gradiente ---
      if (nome.current) {
        nome.current.style.backgroundPosition = `${((s * 12) % 100) * 1.5}% 0`;
      }

      // --- Cards: entrada + flutuação + tilt num transform só ---
      for (let i = 0; i < cards.current.length; i++) {
        const el = cards.current[i];
        if (!el) continue;

        const t = tilts.current[i];
        t.x += (t.alvoX - t.x) * 0.1;
        t.y += (t.alvoY - t.y) * 0.1;

        const p = reduce
          ? 1
          : Math.min(1, Math.max(0, (decorrido - (3 + i) * PASSO) / DURACAO));
        const e = easeOutCubic(p);

        const flutua = Math.sin(s * 0.9 + i * 1.4) * 4;
        const y = (1 - e) * 30 + flutua;
        const rx = (1 - e) * 18 + t.x;

        el.style.opacity = String(e);
        el.style.filter = e < 1 ? `blur(${(1 - e) * 8}px)` : "";
        el.style.transform = `translateY(${y}px) rotateX(${rx}deg) rotateY(${t.y}deg)`;

        // aura pulsando só no card em destaque
        if (hubLinks[i].destaque && !reduce) {
          const pulso = Math.sin(s * 1.6);
          el.style.boxShadow = `0 0 ${42 + pulso * 14}px -12px rgba(232,190,80,${
            0.24 + pulso * 0.1
          })`;
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="surreal">
      {/* Os cards entram animados a partir de opacity 0; sem JS, mostra tudo */}
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            "<style>.surreal-card{opacity:1!important;filter:none!important}.surreal-enter{opacity:1!important;animation:none!important}</style>",
        }}
      />
      <div className="surreal-backdrop" aria-hidden="true" />
      <div className="surreal-hero" aria-hidden="true">
        <Image
          src={perfil.foto}
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      {/* brilho atrás da foto */}
      <SurrealCanvas intensity={0.3} camada="brilho" z={0} />
      {/* estrelinhas por cima da foto */}
      <SurrealCanvas intensity={0.3} camada="poeira" z={1} />
      <div className="surreal-fade" aria-hidden="true" />

      <main className="surreal-main">
        {/* Logo */}
        <Link
          href="/"
          className="surreal-logo surreal-enter"
          style={atraso(0)}
          aria-label="Ramon Silva Barbearia"
        >
          <Image
            src="/img/logo-white.webp"
            alt="Ramon Silva Barbearia"
            width={1851}
            height={626}
            priority
          />
        </Link>

        {/* Espaço da foto que sangra no topo */}
        <div className="surreal-hero-spacer" aria-hidden="true" />

        {/* Nome e descrição */}
        <div
          className="surreal-enter flex flex-col items-center"
          style={atraso(2)}
        >
          <p className="surreal-label">{perfil.titulo}</p>
          <h1 className="surreal-name" ref={nome}>
            {perfil.nome}
          </h1>
          <p className="surreal-desc">{perfil.bio}</p>
        </div>

        {/* Cards */}
        <nav className="surreal-cards">
          {hubLinks.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => {
                cards.current[i] = el;
              }}
              {...(item.externo
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={`surreal-card ${
                item.destaque ? "surreal-card--hero" : "surreal-card--normal"
              }`}
              style={{ opacity: 0 }}
              onPointerMove={(ev) => {
                if (!podeHover.current) return;
                const r = ev.currentTarget.getBoundingClientRect();
                const px = (ev.clientX - r.left) / r.width;
                const py = (ev.clientY - r.top) / r.height;
                tilts.current[i].alvoX = (py - 0.5) * -10;
                tilts.current[i].alvoY = (px - 0.5) * 12;
                ev.currentTarget.style.setProperty("--spx", `${px * 100}%`);
                ev.currentTarget.style.setProperty("--spy", `${py * 100}%`);
              }}
              onPointerLeave={() => {
                tilts.current[i].alvoX = 0;
                tilts.current[i].alvoY = 0;
              }}
            >
              <span className="surreal-card-photo" aria-hidden="true">
                <Image
                  src={item.imagem}
                  alt=""
                  fill
                  sizes="(max-width: 480px) 100vw, 460px"
                />
              </span>
              <span className="surreal-card-veil" aria-hidden="true" />
              <span className="surreal-spot" aria-hidden="true" />
              {item.destaque && <span className="surreal-glint" aria-hidden="true" />}

              <span className="surreal-card-body">
                <span
                  className={`surreal-badge ${
                    item.destaque ? "surreal-badge--hero" : "surreal-badge--normal"
                  }`}
                >
                  {item.etiqueta}
                </span>
                <span className="surreal-card-title block">{item.titulo}</span>
                <span className="surreal-card-desc block">{item.descricao}</span>
              </span>

              <span
                className={`surreal-arrow ${
                  item.destaque ? "surreal-arrow--hero" : "surreal-arrow--normal"
                }`}
                aria-hidden="true"
              >
                <SetaIcon />
              </span>
            </Link>
          ))}
        </nav>

        {/* Rodapé */}
        <div
          className="surreal-enter flex flex-col items-center w-full"
          style={atraso(6)}
        >
          <div className="surreal-divider" aria-hidden="true" />

          <div className="surreal-socials">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="surreal-pill"
            >
              <WhatsIcon />
              WhatsApp
            </a>
            <a
              href={contato.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="surreal-pill"
            >
              <InstagramIcon />
              Instagram
            </a>
          </div>

          <p className="surreal-city">{contato.cidade.replace(" - ", " · ")}</p>
          <p className="surreal-copy">
            © {new Date().getFullYear()} Ramon Silva Barbearia
          </p>
        </div>
      </main>
    </div>
  );
}

function SetaIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={17}
      height={17}
      aria-hidden="true"
    >
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function WhatsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={15} height={15} aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.7.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      width={15}
      height={15}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
