import React from 'react';
import './style.css';

import { useState, useEffect, useRef } from 'react';

/* ─── FONTS injected via style tag ─── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Space+Mono:ital@0;1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --cream: #F5F2EC;
      --ink: #1C1A18;
      --muted: #6B6560;
      --crimson: #8B1A1A;
      --border: rgba(28,26,24,0.12);
      --serif: 'EB Garamond', serif;
      --hand: 'Caveat', cursive;
      --mono: 'Space Mono', monospace;
    }
    html { scroll-behavior: smooth; }
    body {
      background: var(--cream);
      color: var(--ink);
      font-family: var(--serif);
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: var(--crimson); }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes ticker {
      from { transform: translateX(0); }
      to   { transform: translateX(-33.33%); }
    }
    @keyframes blink {
      0%,100% { opacity: 1; } 50% { opacity: 0; }
    }

    .fade-up { animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both; }
    .fade-up-1 { animation-delay: 0.1s; }
    .fade-up-2 { animation-delay: 0.25s; }
    .fade-up-3 { animation-delay: 0.4s; }
    .fade-up-4 { animation-delay: 0.55s; }

    .reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
    }
    .reveal.visible { opacity: 1; transform: none; }

    .project-row {
      border-top: 1px solid var(--border);
      padding: 2.2rem 0;
      display: grid;
      grid-template-columns: 70px 1fr 50px;
      gap: 2rem;
      align-items: start;
      transition: padding-left 0.2s ease;
      cursor: default;
    }
    .project-row:hover { padding-left: 8px; }
    .project-row:last-child { border-bottom: 1px solid var(--border); }

    .contact-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.2rem 0;
      border-bottom: 1px solid var(--border);
      text-decoration: none;
      color: inherit;
      transition: padding-left 0.2s ease;
    }
    .contact-row:hover { padding-left: 8px; }

    .skill-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.45rem 0;
      border-bottom: 1px solid rgba(28,26,24,0.06);
      font-family: var(--serif);
      font-size: 1rem;
      color: var(--ink);
    }

    .nav-link {
      font-family: var(--mono);
      font-size: 0.65rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--muted);
      text-decoration: none;
      transition: color 0.2s;
    }
    .nav-link:hover { color: var(--crimson); }

    .photo-card {
      background: white;
      padding: 8px 8px 26px;
      box-shadow: 2px 4px 20px rgba(28,26,24,0.1);
      position: absolute;
      cursor: grab;
      user-select: none;
      transition: box-shadow 0.2s;
    }
    .photo-card:active { cursor: grabbing; box-shadow: 6px 14px 40px rgba(28,26,24,0.18); }
    .photo-card.dragging { box-shadow: 8px 16px 48px rgba(28,26,24,0.22); z-index: 99 !important; }

    .tag {
      font-family: var(--mono);
      font-size: 0.58rem;
      letter-spacing: 0.08em;
      color: var(--crimson);
      border: 1px solid rgba(139,26,26,0.25);
      padding: 2px 9px;
      border-radius: 2px;
    }

    .cta-btn {
      font-family: var(--mono);
      font-size: 0.68rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--cream);
      background: var(--crimson);
      padding: 0.65rem 1.7rem;
      border-radius: 2px;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .cta-btn:hover { opacity: 0.85; }

    .cta-link {
      font-family: var(--mono);
      font-size: 0.68rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--muted);
      text-decoration: none;
      border-bottom: 1px solid var(--border);
      padding-bottom: 2px;
    }

    .draggable-image {
      cursor: grab;
      user-select: none;
      transition: box-shadow 0.2s;
    }
    .draggable-image.dragging { 
      box-shadow: 8px 16px 48px rgba(28,26,24,0.22); 
      z-index: 50;
    }

    @media (max-width: 640px) {
      .hero-grid { flex-direction: column !important; }
      .about-grid { grid-template-columns: 1fr !important; }
      .skills-grid { grid-template-columns: 1fr 1fr !important; }
      .photo-cluster { display: none; }
      nav { padding: 1rem 1.2rem !important; }
    }
  `}</style>
);

/* ─── DRAGGABLE PHOTO CARD ─── */
function PhotoCard({ style, label, bg, zIndex = 3 }) {
  const ref = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const drag = useRef(false);
  const origin = useRef({ mx: 0, my: 0, cx: 0, cy: 0 });

  useEffect(() => {
    const el = ref.current;
    const onDown = (e) => {
      drag.current = true;
      el.classList.add('dragging');
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      origin.current = {
        mx: clientX,
        my: clientY,
        cx: pos.current.x,
        cy: pos.current.y,
      };
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!drag.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pos.current.x = origin.current.cx + (clientX - origin.current.mx);
      pos.current.y = origin.current.cy + (clientY - origin.current.my);
      el.style.transform = `${style.transform || ''} translate(${
        pos.current.x
      }px, ${pos.current.y}px)`;
    };
    const onUp = () => {
      drag.current = false;
      el.classList.remove('dragging');
    };

    el.addEventListener('mousedown', onDown);
    el.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  return (
    <div ref={ref} className="photo-card" style={{ ...style, zIndex }}>
      <div
        style={{
          width: style.width || 160,
          height: style.height || 190,
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--hand)',
            fontSize: '0.75rem',
            color: 'rgba(28,26,24,0.35)',
            textAlign: 'center',
            padding: '0.5rem',
          }}
        >
          your photo 📸
        </span>
      </div>
      <p
        style={{
          fontFamily: 'var(--hand)',
          fontSize: '0.72rem',
          color: 'var(--muted)',
          textAlign: 'center',
          marginTop: 5,
        }}
      >
        {label}
      </p>
    </div>
  );
}

/* ─── DRAGGABLE IMAGE COMPONENT ─── */
function DraggableImage({ src, alt, width, height }) {
  const ref = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const drag = useRef(false);
  const origin = useRef({ mx: 0, my: 0, cx: 0, cy: 0 });

  useEffect(() => {
    const el = ref.current;
    const onDown = (e) => {
      drag.current = true;
      el.classList.add('dragging');
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      origin.current = {
        mx: clientX,
        my: clientY,
        cx: pos.current.x,
        cy: pos.current.y,
      };
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!drag.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pos.current.x = origin.current.cx + (clientX - origin.current.mx);
      pos.current.y = origin.current.cy + (clientY - origin.current.my);
      el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
    };
    const onUp = () => {
      drag.current = false;
      el.classList.remove('dragging');
    };

    el.addEventListener('mousedown', onDown);
    el.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className="draggable-image"
      style={{
        width,
        height,
        objectFit: 'cover',
        borderRadius: '4px',
        display: 'block',
        position: 'relative',
      }}
    />
  );
}

/* ─── SCROLL REVEAL HOOK ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── NAV ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.2rem 2.5rem',
        borderBottom: scrolled
          ? '1px solid var(--border)'
          : '1px solid transparent',
        background: scrolled ? 'rgba(245,242,236,0.93)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--hand)',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--crimson)',
        }}
      >
        M.
      </span>
      <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none' }}>
        {['Work', 'Skills', 'About', 'Contact'].map((l) => (
          <li key={l}>
            <a href={`#${l.toLowerCase()}`} className="nav-link">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ─── TICKER ─── */
function Ticker() {
  const items = [
    'Open to opportunities',
    '·❋·',
    'Mechanical Engineering & Business',
    '·❋·',
    'Creative & Sustainable Development',
    '·❋·',
    'Calgary → Lahore → World',
    '·❋·',
    'Building things that feel alive',
    '·❋·',
  ];
  const all = [...items, ...items, ...items];
  return (
    <div
      style={{
        overflow: 'hidden',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '0.7rem 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '2rem',
          whiteSpace: 'nowrap',
          animation: 'ticker 24s linear infinite',
        }}
      >
        {all.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: item.includes('·') ? 'serif' : 'var(--mono)',
              fontSize: item.includes('·') ? '1rem' : '0.62rem',
              letterSpacing: item.includes('·') ? 0 : '0.1em',
              textTransform: item.includes('·') ? 'none' : 'uppercase',
              color: item.includes('·') ? 'var(--crimson)' : 'var(--muted)',
              flexShrink: 0,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 2.5rem 4.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Headline */}
      <div style={{ maxWidth: 680, position: 'relative', zIndex: 2 }}>
        <p
          className="fade-up fade-up-1"
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: '1.1rem',
          }}
        >
          Mishal · 2005 · Lahore → Calgary
        </p>
        <h1
          className="fade-up fade-up-2"
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2.4rem,5.5vw,4.2rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            marginBottom: '1.4rem',
          }}
        >
          <em>Mishal</em> is a mechanical engineering and business student based
          in Calgary, AB.
        </h1>
        <p
          className="fade-up fade-up-3"
          style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.05rem',
            color: 'var(--muted)',
            lineHeight: 1.75,
            maxWidth: 460,
            marginBottom: '2rem',
          }}
        >
          Building things at the intersection of engineering, sustainability and
          art — interfaces that are both rigorous and alive.
        </p>
        <div
          className="fade-up fade-up-4"
          style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}
        >
          <a href="#work" className="cta-btn">
            View Work
          </a>
          <a href="#contact" className="cta-link">
            Say Hello →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── WORK ─── */
const projects = [
  {
    year: 'Sept 2024 - Sept 2025',
    index: '01',
    title: 'Cam Roller Prosthetic Testing Stand',
    sub: '3-D Modelling',
    desc: 'A fully functional testing stand designed to observe the motion of a cam for a prosthetic. The finalized product was utilized by the Adaptive Bionics Lab situated in Calgary, AB to dev[...]',
    tags: ['SolidWorks', 'MATLAB', 'Machining and Fabrication'],
  },
];

function Work() {
  return (
    <section
      id="work"
      style={{ padding: '6rem 2.5rem', maxWidth: 900, margin: '0 auto' }}
    >
      <div className="reveal" style={{ marginBottom: '2.5rem' }}>
        <p
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: '0.5rem',
          }}
        >
          Selected Work
        </p>
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(1.8rem,3.5vw,2.8rem)',
            fontWeight: 400,
            fontStyle: 'italic',
          }}
        >
          Projects
        </h2>
      </div>
      <div>
        {projects.map((p, i) => (
          <div
            key={p.title}
            className="project-row reveal"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div>
              <p
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.6rem',
                  color: 'var(--muted)',
                  letterSpacing: '0.08em',
                }}
              >
                {p.year}
              </p>
              <p
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.6rem',
                  color: 'var(--crimson)',
                  marginTop: 4,
                  letterSpacing: '0.08em',
                }}
              >
                {p.index}
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(1.3rem,2.5vw,2rem)',
                  fontWeight: 400,
                  marginBottom: '0.25rem',
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.6rem',
                  color: 'var(--muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.7rem',
                }}
              >
                {p.sub}
              </p>
              <p
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '0.95rem',
                  color: 'var(--muted)',
                  lineHeight: 1.7,
                  maxWidth: 480,
                  marginBottom: '0.9rem',
                }}
              >
                {p.desc}
              </p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.6rem',
                color: 'var(--muted)',
                paddingTop: '0.2rem',
              }}
            >
              View ↗
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── SKILLS ─── */
const skillGroups = [
  {
    cat: 'Software or Programs',
    skills: [
      'Microsoft Suite, including PowerBI, PowerAutomate and PowerApps',
      'ArcGIS',
      'SolidWorks & AutoCAD',
      'Revit',
      'MATLAB',
      'Cortex',
      'Arduino IDE',
    ],
  },
  { cat: 'Languages', skills: ['Python', 'SQL'] },
];

function Skills() {
  return (
    <section
      id="skills"
      style={{
        padding: '6rem 2.5rem',
        borderTop: '1px solid var(--border)',
        maxWidth: 900,
        margin: '0 auto',
      }}
    >
      <div className="reveal" style={{ marginBottom: '2.5rem' }}>
        <p
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: '0.5rem',
          }}
        >
          Capabilities
        </p>
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(1.8rem,3.5vw,2.8rem)',
            fontWeight: 400,
            fontStyle: 'italic',
          }}
        >
          Skills
        </h2>
      </div>
      <div
        className="skills-grid reveal"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(185px,1fr))',
          gap: '2.5rem',
        }}
      >
        {skillGroups.map((g, gi) => (
          <div key={g.cat}>
            <p
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.58rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--crimson)',
                marginBottom: '0.9rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {g.cat}
            </p>
            <ul style={{ listStyle: 'none' }}>
              {g.skills.map((s) => (
                <li key={s} className="skill-item">
                  {s}{' '}
                  <span style={{ color: 'var(--crimson)', fontSize: '0.7rem' }}>
                    —
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── ABOUT ─── */
function About() {
  return (
    <section
      id="about"
      style={{
        padding: '6rem 2.5rem',
        borderTop: '1px solid var(--border)',
        maxWidth: 900,
        margin: '0 auto',
      }}
    >
      <div
        className="about-grid reveal"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'start',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: '0.5rem',
            }}
          >
            About
          </p>
          <h2
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(1.8rem,3.5vw,2.8rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              marginBottom: '1.8rem',
            }}
          >
            Engineer &amp;
            <br />
            Creative
          </h2>
          <div style={{ position: 'relative', width: 220, height: 270 }}>
            <DraggableImage 
              src="/7ed7342267e2bb2d9515aa3e65436167.jpg" 
              alt="Mishal"
              width={220}
              height={270}
            />
          </div>
        </div>
        <div style={{ paddingTop: '3.5rem' }}>
          {[
            'Mishal,  a mechanical engineer, business student and aspiring marathoner born in Lahore in 2005, now based in Calgary.',
            "I'm drawn to the intersection of rigorous engineering and ethical design — building things that work correctly and are beneficial for society (not to mention at least a little bit [...]",
            "When I'm away from the screen, I'm either running, reading, biking, traveling or writing.",
          ].map((t, i) => (
            <p
              key={i}
              style={{
                fontFamily: 'var(--serif)',
                fontSize: '1.05rem',
                lineHeight: 1.8,
                color: i === 0 ? 'var(--ink)' : 'var(--muted)',
                marginBottom: '1.1rem',
              }}
            >
              {i === 0 ? (
                <>
                  <em>Mishal</em>
                  {t.slice(8)}
                </>
              ) : (
                t
              )}
            </p>
          ))}
          <div
            style={{
              marginTop: '1.8rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            {[
              ['Currently', 'Calgary, AB'],
              [
                'Education',
                'University of Calgary · Mechanical Engineering & Business Dual-Degree',
              ],
              [
                'Interests',
                'Sustainable design, ecoarchitecture, biomechanics, F1, running, cycling, reading & more!',
              ],
              ['Status', 'Open to opportunities'],
            ].map(([l, v]) => (
              <div
                key={l}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--crimson)',
                    minWidth: 80,
                  }}
                >
                  {l}
                </span>
                <span
                  style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem' }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─── */
const contactLinks = [
  {
    label: 'Email',
    href: 'mailto:your@email.com',
    display: 'mishalc516@gmail.com',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/',
    display: 'linkedin.com/in/mishal',
  },
];

function Contact() {
  return (
    <section
      id="contact"
      style={{
        padding: '6rem 2.5rem 5rem',
        borderTop: '1px solid var(--border)',
        maxWidth: 900,
        margin: '0 auto',
      }}
    >
      <div className="reveal" style={{ marginBottom: '2.8rem' }}>
        <p
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: '0.5rem',
          }}
        >
          Say Hello
        </p>
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2rem,4vw,3.5rem)',
            fontWeight: 400,
            lineHeight: 1.2,
          }}
        >
          If you like engineering,
          <br />
          <em>let's connect.</em>
        </h2>
      </div>
      <div className="reveal">
        {contactLinks.map((l) => (
          <a key={l.label} href={l.href} className="contact-row">
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.6rem',
                color: 'var(--muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {l.label}
            </span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '1rem' }}>
              {l.display}
            </span>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.6rem',
                color: 'var(--crimson)',
              }}
            >
              ↗
            </span>
          </a>
        ))}
      </div>
      <p
        className="reveal"
        style={{
          fontFamily: 'var(--hand)',
          fontSize: '0.9rem',
          color: 'var(--muted)',
          marginTop: '3rem',
          textAlign: 'center',
        }}
      >
        Made by Mishal · {new Date().getFullYear()}
      </p>
    </section>
  );
}

/* ─── APP ─── */
export default function App() {
  useReveal();
  return (
    <>
      <FontLoader />
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Work />
        <Skills />
        <About />
        <Contact />
      </main>
    </>
  );
}
