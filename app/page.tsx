"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CONTENT, LINKS } from "./content.js";
import { readPreferences, writePreference } from "./preferences.js";

type Language = "id" | "en";
type Theme = "light" | "dark";
type WorkKey = "indomaret" | "bmc" | "mitra" | "restu";

const jobs: ReadonlyArray<{ key: WorkKey; company: string; location: string; proof: "retail" | "admin" | "production" | "technical"; number: string }> = [
  { key: "indomaret", company: "PT Indomarco Prismatama", location: "Yogyakarta", proof: "retail", number: "01" },
  { key: "bmc", company: "BMC Motor", location: "Yogyakarta", proof: "admin", number: "02" },
  { key: "mitra", company: "PT Mitrametal Perkasa", location: "Karawang", proof: "production", number: "03" },
  { key: "restu", company: "Restu Computer", location: "Magelang", proof: "technical", number: "04" },
];

const faqJobs: WorkKey[] = ["indomaret", "bmc", "mitra", "restu"];

export default function Home() {
  const [language, setLanguage] = useState<Language>("id");
  const [theme, setTheme] = useState<Theme>("light");
  const [openFaq, setOpenFaq] = useState<WorkKey | "">("indomaret");
  const [announcement, setAnnouncement] = useState("");

  const copy = CONTENT[language] as Record<string, string>;
  const t = useCallback((key: string) => copy[key] ?? (CONTENT.id as Record<string, string>)[key], [copy]);
  const heroLines = useMemo(() => t("hero.lines").split("|"), [t]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = readPreferences(localStorage) as { language: Language; theme: Theme };
      setLanguage(saved.language);
      setTheme(saved.theme);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.theme = theme;
    document.title = t("meta.title");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.description"));

    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const hero = document.querySelector<HTMLElement>(".hero");
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealObserver = !reduced && "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver?.unobserve(entry.target);
          });
        }, { threshold: 0.1 })
      : null;

    revealNodes.forEach((node) => revealObserver ? revealObserver.observe(node) : node.classList.add("is-visible"));

    const onScroll = () => {
      const maxScroll = Math.max(1, root.scrollHeight - innerHeight);
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      const heroProgress = Math.min(1, Math.max(0, scrollY / Math.max(1, innerHeight)));
      root.style.setProperty("--scroll-progress", String(progress));
      root.style.setProperty("--hero-shift", String(heroProgress));
      header?.classList.toggle("compact", scrollY > 18);
      if (hero) header?.classList.toggle("header-on-blue", hero.getBoundingClientRect().bottom > 72);
    };

    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      revealObserver?.disconnect();
    };
  }, [language, theme, t]);

  const chooseLanguage = (next: Language) => {
    setLanguage(next);
    writePreference(localStorage, "language", next);
    setAnnouncement((CONTENT[next] as Record<string, string>)["announce." + next]);
  };

  const chooseTheme = (next: Theme) => {
    setTheme(next);
    writePreference(localStorage, "theme", next);
    setAnnouncement(t("announce." + next));
  };

  return (
    <>
      <a className="skip" href="#main">{t("a11y.skip")}</a>

      <header className="site-header" data-site-header>
        <a className="brand" href="#top" aria-label={t("a11y.backTop")}>
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>BAYU ANDIKA</span>
        </a>
        <div className="header-right">
          <a className="header-cta" href="#contact">{t("verdict.action")} <span>→</span></a>
          <button className="menu-button" type="button" aria-label={t("a11y.backTop")} onClick={() => document.querySelector("#experience")?.scrollIntoView({ behavior: "smooth" })}>
            <span></span><span></span><span></span>
          </button>
        </div>
        <div className="page-progress" aria-hidden="true"><i /></div>
      </header>

      <main id="main" tabIndex={-1}>
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="hero-rings" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
          <div className="hero-art" aria-hidden="true"><AphroditeArt /></div>
          <div className="hero-inner">
            <div className="hero-navline">
              <span>{t("hero.role")}</span>
              <span>{t("hero.signal")}</span>
            </div>

            <div className="hero-content">
              <div className="hero-copy-column">
                <h1 id="hero-title">
                  {heroLines.map((line, index) => (
                    <span key={line} className={index > 1 ? "hero-outline" : ""}><i>{line}</i></span>
                  ))}
                </h1>
                <p className="hero-description">{t("hero.description")}</p>
                <div className="hero-actions">
                  <a className="hero-button hero-button-primary" href="#experience">{t("hero.experienceAction")} <span>↘</span></a>
                  <a className="hero-button hero-button-light" href="/Bayu-Andika-CV.pdf" download>{t("common.downloadCv")}</a>
                </div>
              </div>

              <div className="hero-terminal">
                <div className="terminal-tabs" role="list">
                  {t("hero.scan").split("|").map((item, index) => <span key={item} className={index === 0 ? "active" : ""}>{item}</span>)}
                </div>
                <div className="terminal-window">
                  <span className="terminal-prompt" aria-hidden="true">›</span>
                  <p>{t("hero.signal")}</p>
                  <div className="terminal-marquee">
                    {t("hero.scan").split("|").map((item) => <span key={item}>{item}</span>)}
                  </div>
                </div>
              </div>
            </div>

            <a className="scroll-prompt" href="#experience"><span>{t("hero.scrollPrompt")}</span><b>↓</b></a>
          </div>
        </section>

        <section className="experience-intro" id="experience" aria-labelledby="experience-title">
          <div className="section-shell intro-grid">
            <div data-reveal>
              <p className="eyebrow">{t("experience.label")}</p>
              <h2 id="experience-title">{t("experience.title")}</h2>
            </div>
            <div data-reveal className="intro-copy"><p>{t("experience.intro")}</p></div>
          </div>
        </section>

        <section className="work-stack" aria-label={t("experience.label")}>
          {jobs.map((job, index) => (
            <article key={job.key} className={"work-panel work-" + job.proof} data-reveal>
              <div className="section-shell work-grid">
                <div className="work-copy">
                  <div className="work-number">{job.number}</div>
                  <p className="eyebrow">{t("experience." + job.key + ".kicker")}</p>
                  <h2>{t("experience." + job.key + ".role")}</h2>
                  <p className="work-company">{job.company} · {job.location}</p>
                  <p className="work-question">{t("experience." + job.key + ".question")}</p>
                  <p className="work-body">{t("experience." + job.key + ".body")}</p>
                  <a className="inline-link" href={"#proof-" + job.key}>{t("hero.experienceAction")} <span>→</span></a>
                </div>
                <div className="work-art-card" id={"proof-" + job.key}>
                  <div className="work-card-top">
                    <span>{t("proof.label")} / {job.number}</span>
                    <span>{t("experience." + job.key + ".period")}</span>
                  </div>
                  <div className="work-art-stage">
                    <div className={"work-art work-art-" + (index + 1)}><AphroditeArt /></div>
                    <div className="work-art-index">{job.number}</div>
                  </div>
                  <div className="work-proof">
                    <span>{t("proof.proven")}</span>
                    <strong>{t("experience." + job.key + ".unlock")}</strong>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="capability-section" id="capabilities" aria-labelledby="capability-title">
          <div className="capability-backdrop" aria-hidden="true"><AphroditeArt /></div>
          <div className="section-shell">
            <div className="capability-intro" data-reveal>
              <p className="eyebrow">{t("capability.label")}</p>
              <h2 id="capability-title">{t("capability.title")}</h2>
              <p>{t("capability.intro")}</p>
            </div>

            <CapabilityBoard t={t} />
          </div>
        </section>

        <section className="education-section" id="education" aria-labelledby="education-title">
          <div className="section-shell education-grid" data-reveal>
            <div className="education-art"><AphroditeArt /></div>
            <div>
              <p className="eyebrow">{t("education.label")}</p>
              <p className="education-period">{t("education.period")}</p>
              <h2 id="education-title">{t("education.title")}</h2>
            </div>
            <div className="education-copy">
              <h3>{t("education.institution")}</h3>
              <p className="education-official">{t("education.official")}</p>
              <p className="program">{t("education.program")}</p>
              <p>{t("education.description")}</p>
            </div>
          </div>
        </section>

        <section className="faq-section" aria-labelledby="faq-title">
          <div className="section-shell">
            <div className="faq-head" data-reveal>
              <p className="eyebrow">{t("verdict.label")}</p>
              <h2 id="faq-title">{t("verdict.title")}</h2>
            </div>
            <div className="faq-list" data-reveal>
              {faqJobs.map((job) => {
                const open = openFaq === job;
                return (
                  <div className={"faq-item " + (open ? "is-open" : "")} key={job}>
                    <button type="button" onClick={() => setOpenFaq(open ? "" : job)}>
                      <span>{jobs.find((item) => item.key === job)?.number}</span>
                      <strong>{t("experience." + job + ".question")}</strong>
                      <b>{open ? "−" : "+"}</b>
                    </button>
                    <div className="faq-answer"><p>{t("experience." + job + ".payoff")}</p></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-orbit" aria-hidden="true"><AphroditeArt /></div>
          <div className="section-shell contact-grid">
            <div data-reveal>
              <p className="eyebrow">{t("contact.label")}</p>
              <h2 id="contact-title">{t("contact.title")}</h2>
              <p className="contact-description">{t("contact.description")}</p>
              <a className="contact-main-button" href={LINKS.email}>{t("contact.emailAction")} <span>→</span></a>
            </div>
            <div className="contact-card" data-reveal>
              <div className="contact-card-top"><span>{t("verdict.action")}</span><span>© 2026</span></div>
              <div className="contact-icons">
                <ContactIcon icon="email" label={t("contact.emailLabel")} href={LINKS.email} />
                <ContactIcon icon="phone" label={t("contact.phoneLabel")} href={LINKS.phone} />
                <ContactIcon icon="linkedin" label={t("contact.linkedinLabel")} href={LINKS.linkedin} />
                <ContactIcon icon="github" label={t("contact.githubLabel")} href={LINKS.github} />
                <ContactIcon icon="instagram" label={t("contact.instagramLabel")} href={LINKS.instagram} />
                <ContactIcon icon="facebook" label={t("contact.facebookLabel")} href={LINKS.facebook} />
              </div>
              <a className="contact-location" href={LINKS.maps} target="_blank" rel="noopener noreferrer">{t("contact.locationLabel")}: Magelang, Indonesia</a>
              <div className="contact-actions">
                <a className="small-button small-button-dark" href={LINKS.email}>{t("contact.emailAction")}</a>
                <a className="small-button small-button-light" href="/Bayu-Andika-CV.pdf" download>{t("common.downloadCv")}</a>
              </div>
              <PreferenceBar language={language} theme={theme} chooseLanguage={chooseLanguage} chooseTheme={chooseTheme} t={t} />
            </div>
          </div>
          <p className="sr-only" aria-live="polite">{announcement}</p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell footer-inner">
          <strong>BAYU ANDIKA</strong>
          <span>{t("footer.role")}</span>
          <span>© 2026</span>
        </div>
      </footer>
    </>
  );
}

function CapabilityBoard({ t }: { t: (key: string) => string }) {
  const [skill, setSkill] = useState<"technical" | "operations" | "admin" | "retail">("technical");
  const skills = ["technical", "operations", "admin", "retail"] as const;
  const items = t("skills." + skill + ".items").split("|");

  return (
    <div className="capability-board" data-reveal>
      <div className="capability-board-bar">
        <span>{t("capability.system")}</span>
        <span className="status-dot"><i /> {t("capability.online")}</span>
      </div>
      <div className="capability-tabs" role="tablist">
        {skills.map((item, index) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={skill === item}
            className={skill === item ? "is-active" : ""}
            onClick={() => setSkill(item)}
          >
            <span>0{index + 1}</span>
            {t("skills." + item + ".title")}
          </button>
        ))}
      </div>
      <div className="capability-panel" role="tabpanel">
        <div className="capability-panel-title">
          <span>{t("skills." + skill + ".source")}</span>
          <h3>{t("skills." + skill + ".title")}</h3>
          <span className="capability-proven">{t("capability.status")}</span>
        </div>
        <ol>
          {items.map((item, index) => <li key={item}><b>0{index + 1}</b><span>{item}</span></li>)}
        </ol>
      </div>
    </div>
  );
}

function AphroditeArt() {
  const rays = Array.from({ length: 24 });
  const arms = [
    "M188 304C138 271 91 226 57 177",
    "M332 304C382 271 429 226 463 177",
    "M176 390C124 402 75 425 39 463",
    "M344 390C396 402 445 425 481 463",
  ];

  return (
    <div className="aphrodite-svg-wrap">
      <svg viewBox="0 0 520 620" className="aphrodite-svg">
        <defs>
          <linearGradient id="aphroditeBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="64%" stopColor="#e0e7ff" />
            <stop offset="100%" stopColor="#7e8ddd" />
          </linearGradient>
        </defs>

        <g className="aphrodite-rays">
          {rays.map((_, i) => <path key={i} d="M260 310L260 22" transform={"rotate(" + (i * 15) + " 260 310)"} />)}
        </g>

        <g className="aphrodite-halo">
          <circle cx="260" cy="310" r="214" />
          <ellipse cx="260" cy="310" rx="228" ry="110" transform="rotate(-18 260 310)" />
          <ellipse cx="260" cy="310" rx="210" ry="144" transform="rotate(18 260 310)" />
        </g>

        <g className="aphrodite-figure">
          <path d="M201 580C209 512 219 461 240 422C250 403 258 384 260 364C262 384 270 403 280 422C301 461 311 512 319 580Z" fill="url(#aphroditeBody)" />
          <path d="M184 576C151 543 133 493 126 445C156 463 185 475 215 478L240 422L202 580Z" fill="#eaf0ff" />
          <path d="M336 576C369 543 387 493 394 445C364 463 335 475 305 478L280 422L336 576Z" fill="#d5defc" />
          {arms.map((d, i) => <path key={i} d={d} fill="none" stroke="#eef3ff" strokeWidth="28" strokeLinecap="round" />)}
          {arms.map((d, i) => <path key={"line-" + i} d={d} fill="none" stroke="#6d7db7" strokeWidth="3" strokeLinecap="round" opacity=".88" />)}

          <ellipse cx="260" cy="245" rx="70" ry="86" fill="url(#aphroditeBody)" />
          <path d="M196 244C190 188 214 145 260 145C306 145 330 188 324 244C309 213 290 193 260 187C230 193 211 213 196 244Z" fill="#c6d1f6" />
          <path d="M197 211C182 185 190 146 216 123C230 110 245 103 260 101C275 103 290 110 304 123C330 146 338 185 323 211C315 180 300 157 277 145C272 165 245 177 221 168C211 180 202 195 197 211Z" fill="#eef2ff" />
          <path d="M214 250C228 243 240 243 251 247M269 247C280 243 292 243 306 250" fill="none" stroke="#6878b2" strokeWidth="4" strokeLinecap="round" />
          <path d="M258 248L254 276L266 278" fill="none" stroke="#7180b9" strokeWidth="3" strokeLinecap="round" />
          <path d="M232 300C246 309 274 309 288 300" fill="none" stroke="#6877ad" strokeWidth="4" strokeLinecap="round" />
          <path d="M211 348C226 369 244 380 260 382C276 380 294 369 309 348" fill="none" stroke="#7484bc" strokeWidth="5" strokeLinecap="round" />
          <path d="M214 407C232 422 246 429 260 431C274 429 288 422 306 407" fill="none" stroke="#8793c4" strokeWidth="4" />
          <path d="M190 148C175 118 181 92 206 70M330 148C345 118 339 92 314 70" fill="none" stroke="#f7f9ff" strokeWidth="12" strokeLinecap="round" />
          <path d="M207 77C223 43 246 26 260 26C274 26 297 43 313 77" fill="none" stroke="#f3f6ff" strokeWidth="7" strokeLinecap="round" />
          <path d="M119 446C95 463 74 485 63 513M401 446C425 463 446 485 457 513" fill="none" stroke="#cbd6ff" strokeWidth="8" strokeLinecap="round" />
          <path d="M220 117C233 95 247 82 260 79C273 82 287 95 300 117" fill="none" stroke="#6878b2" strokeWidth="2" />
          <path d="M205 533C224 548 243 554 260 555C277 554 296 548 315 533" fill="none" stroke="#7c8bc1" strokeWidth="4" />
          <path d="M194 555C220 570 240 579 260 581C280 579 300 570 326 555" fill="none" stroke="#7080b8" strokeWidth="4" opacity=".8" />
        </g>

        <g className="aphrodite-shell">
          <path d="M97 355C143 307 190 285 260 281C330 285 377 307 423 355" fill="none" stroke="currentColor" strokeOpacity=".36" strokeWidth="1.2" strokeDasharray="3 8" />
          <circle cx="260" cy="310" r="186" fill="none" stroke="currentColor" strokeOpacity=".24" />
        </g>
      </svg>
    </div>
  );
}

function ContactIcon({ icon, label, href }: { icon: "email" | "phone" | "linkedin" | "github" | "instagram" | "facebook"; label: string; href: string }) {
  const external = href.startsWith("http");
  const paths: Record<string, string> = {
    email: "M4 6h16v12H4z M5 7l7 6 7-6",
    phone: "M8.2 4.1l2 4.6-2.6 1.6a12.9 12.9 0 0 0 6.1 6.1l1.6-2.6 4.6 2-.2 3c-7.2.5-13.7-5-13.3-12.2l3-.5Z",
    linkedin: "M6 8.5H3V20h3V8.5ZM4.5 3A1.8 1.8 0 1 0 4.5 6.6 1.8 1.8 0 0 0 4.5 3ZM21 13.2c0-3.3-1.8-5-4.3-5-1.8 0-2.8 1-3.3 1.8V8.5h-3V20h3v-5.7c0-1.5.4-2.9 2.2-2.9 1.8 0 1.9 1.8 1.9 3V20H21v-6.8Z",
    github: "M12 2.5A9.5 9.5 0 0 0 9 21v-2c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-4.7 0-1 .4-1.9 1-2.6-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.7-.7 1-1.6 1-2.6 0-3.7-2.3-4.5-4.6-4.7.4-.3.7-1 .7-1.9v-2a9.5 9.5 0 0 0-2.9-18.5Z",
    instagram: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm5-1.2h.01",
    facebook: "M14 21v-7h2.5l.4-3H14V9.1c0-.9.3-1.4 1.6-1.4H17V4.4c-.3 0-1.2-.1-2.3-.1-2.5 0-4.2 1.5-4.2 4.3V11H8v3h2.5v7H14Z",
  };

  return (
    <a className="contact-icon" href={href} aria-label={label} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[icon]} /></svg>
    </a>
  );
}

function PreferenceBar({ language, theme, chooseLanguage, chooseTheme, t }: {
  language: Language;
  theme: Theme;
  chooseLanguage: (next: Language) => void;
  chooseTheme: (next: Theme) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="preference-bar">
      <button type="button" className={"pref-button " + (theme === "light" ? "is-active" : "")} onClick={() => chooseTheme("light")} aria-pressed={theme === "light"}>{t("preferences.light")}</button>
      <button type="button" className={"pref-button " + (theme === "dark" ? "is-active" : "")} onClick={() => chooseTheme("dark")} aria-pressed={theme === "dark"}>{t("preferences.dark")}</button>
      <button type="button" className={"pref-button " + (language === "id" ? "is-active" : "")} onClick={() => chooseLanguage("id")} aria-pressed={language === "id"}>ID</button>
      <button type="button" className={"pref-button " + (language === "en" ? "is-active" : "")} onClick={() => chooseLanguage("en")} aria-pressed={language === "en"}>ENG</button>
    </div>
  );
}
