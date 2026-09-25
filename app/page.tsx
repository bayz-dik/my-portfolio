"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CONTENT, LINKS } from "./content.js";
import { GlassFilter } from "@/components/ui/liquid-radio";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { readPreferences, writePreference } from "./preferences.js";

type Language = "id" | "en";
type WorkKey = "indomaret" | "bmc" | "mitra" | "restu";

const jobs: ReadonlyArray<{
  key: WorkKey;
  company: string;
  location: string;
  image: string;
  number: string;
}> = [
  { key: "indomaret", company: "PT Indomarco Prismatama", location: "Yogyakarta", image: "https://web-assets.nousresearch.com/nousnet-web/img/desktop/feature-connect.00398e980c0dd2f8.webp", number: "01" },
  { key: "bmc", company: "BMC Motor", location: "Yogyakarta", image: "https://web-assets.nousresearch.com/nousnet-web/img/desktop/feature-memory.01a45f37b0af6978.webp", number: "02" },
  { key: "mitra", company: "PT Mitrametal Perkasa", location: "Karawang", image: "https://web-assets.nousresearch.com/nousnet-web/img/desktop/feature-automation.d44bac592cfe9298.webp", number: "03" },
  { key: "restu", company: "Restu Computer", location: "Magelang", image: "https://web-assets.nousresearch.com/nousnet-web/img/desktop/feature-tasks.1f1ac2b58490d896.webp", number: "04" },
];

const featureAssets = [
  "https://web-assets.nousresearch.com/nousnet-web/img/desktop/hero-art.7d419eeb314799e0.webp",
  "https://web-assets.nousresearch.com/nousnet-web/img/desktop/feature-memory.01a45f37b0af6978.webp",
  "https://web-assets.nousresearch.com/nousnet-web/img/desktop/feature-automation.d44bac592cfe9298.webp",
  "https://web-assets.nousresearch.com/nousnet-web/img/desktop/feature-tasks.1f1ac2b58490d896.webp",
  "https://web-assets.nousresearch.com/nousnet-web/img/desktop/feature-browse.dc3e16e83609e822.webp",
  "https://web-assets.nousresearch.com/nousnet-web/img/desktop/feature-sandbox.095069d7fe5b76a7.webp",
];

const hermesHero = "/art/hermes-top.png";

export default function Home() {
  const [language, setLanguage] = useState<Language>("id");
  const [openFaq, setOpenFaq] = useState<WorkKey | "">("indomaret");
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const copy = CONTENT[language] as Record<string, string>;
  const t = useCallback((key: string) => copy[key] ?? (CONTENT.id as Record<string, string>)[key], [copy]);
  const heroLines = useMemo(() => t("hero.lines").split("|"), [t]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = readPreferences(localStorage) as { language: Language };
      setLanguage(saved.language);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.theme = "light";
    document.title = t("meta.title");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.description"));

    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const hero = document.querySelector<HTMLElement>(".hero");
    const featureNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-feature-motion]"));
    const transitionNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-image-transition]"));
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = !reduced && "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        }), { threshold: 0.08 })
      : null;

    revealNodes.forEach((node) => observer ? observer.observe(node) : node.classList.add("is-visible"));

    let frame = 0;
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maxScroll = Math.max(1, root.scrollHeight - innerHeight);
        root.style.setProperty("--scroll-progress", String(Math.min(1, Math.max(0, scrollY / maxScroll))));
        root.style.setProperty("--hero-shift", String(Math.min(1, Math.max(0, scrollY / Math.max(1, innerHeight)))));
        header?.classList.toggle("compact", scrollY > 18);
        if (hero) header?.classList.toggle("header-on-blue", hero.getBoundingClientRect().bottom > 72);

        featureNodes.forEach((node) => {
          const rect = node.getBoundingClientRect();
          const delta = ((rect.top + rect.height / 2) - innerHeight / 2) / Math.max(1, innerHeight);
          node.style.setProperty("--feature-shift", String(Math.max(-1, Math.min(1, delta))));
        });
        transitionNodes.forEach((node) => {
          const rect = node.getBoundingClientRect();
          const reveal = Math.max(0, Math.min(1, 1 - rect.top / Math.max(1, innerHeight)));
          node.style.setProperty("--image-reveal", String(reveal));
        });
      });
    };

    sync();
    addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", sync);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", sync);
      removeEventListener("resize", sync);
      observer?.disconnect();
    };
  }, [language, t]);

  const chooseLanguage = (next: Language) => {
    setLanguage(next);
    writePreference(localStorage, "language", next);
    setAnnouncement((CONTENT[next] as Record<string, string>)["announce." + next]);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className="skip" href="#main">{t("a11y.skip")}</a>

      <svg className="hero-art-filter-defs" aria-hidden="true" width="0" height="0" focusable="false">
        <defs>
          <filter id="hero-art-key" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  4 0 0 0 -0.28" />
          </filter>
        </defs>
      </svg>

      <header className="site-header" data-site-header>
        <a className="brand" href="#top" aria-label={t("a11y.backTop")}>BAYU ANDIKA</a>
        <button
          className={"menu-button " + (menuOpen ? "is-open" : "")}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="social-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span></span><span></span><span></span>
        </button>
        <div className="page-progress" aria-hidden="true"><i /></div>
      </header>

      <aside id="social-menu" className={"social-menu " + (menuOpen ? "is-open" : "")} aria-hidden={!menuOpen}>
        <div className="social-menu-inner">
          <div className="social-menu-heading">
            <p className="social-menu-kicker">{t("contact.label")}</p>
            <p>{t("contact.description")}</p>
          </div>
          <nav className="social-icon-grid" aria-label={t("contact.label")}>
            <SocialIcon icon="github" label={t("contact.githubLabel")} href={LINKS.github} onClick={closeMenu} />
            <SocialIcon icon="instagram" label={t("contact.instagramLabel")} href={LINKS.instagram} onClick={closeMenu} />
            <SocialIcon icon="linkedin" label={t("contact.linkedinLabel")} href={LINKS.linkedin} onClick={closeMenu} />
            <SocialIcon icon="facebook" label={t("contact.facebookLabel")} href={LINKS.facebook} onClick={closeMenu} />
            <SocialIcon icon="email" label={t("contact.emailLabel")} href={LINKS.email} onClick={closeMenu} />
            <SocialIcon icon="phone" label={t("contact.phoneLabel")} href={LINKS.phone} onClick={closeMenu} />
          </nav>
        </div>
      </aside>

      <main id="main" tabIndex={-1}>
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="hero-inner">
            <div className="hero-navline">
              <span>{t("hero.role")}</span>
              <span>{t("hero.signal")}</span>
            </div>

            <div className="hero-main">
              <div className="hero-copy">
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

              <div className="hero-art">
                <img src={hermesHero} alt="" loading="eager" />
              </div>
            </div>

            <div className="hero-bottom">
              <a className="scroll-prompt" href="#experience"><span>{t("hero.scrollPrompt")}</span><b>↓</b></a>
            </div>
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

        <section className="feature-story" aria-labelledby="story-title">
          <div className="section-shell feature-heading" data-reveal>
            <p className="eyebrow">{t("capability.label")}</p>
            <h2 id="story-title">{t("capability.title")}</h2>
          </div>

          {jobs.map((job, index) => (
            <article key={job.key} id={"work-" + job.key} className={"feature-row feature-row-" + ((index % 2) + 1)} data-feature-motion>
              <div className="section-shell feature-inner">
                <div className="feature-media">
                  <img src={featureAssets[index]} alt="" loading="lazy" />
                  <span className="feature-index">{job.number}</span>
                </div>
                <div className="feature-copy" data-reveal>
                  <p className="eyebrow">{t("experience." + job.key + ".kicker")}</p>
                  <h3>{t("experience." + job.key + ".role")}</h3>
                  <p className="feature-question">{t("experience." + job.key + ".question")}</p>
                  <p>{t("experience." + job.key + ".body")}</p>
                  <p className="feature-proof">{t("experience." + job.key + ".payoff")}</p>
                </div>
              </div>
            </article>
          ))}

          <article className="feature-row feature-row-1" data-feature-motion>
            <div className="section-shell feature-inner">
              <div className="feature-media"><img src={featureAssets[4]} alt="" loading="lazy" /><span className="feature-index">05</span></div>
              <div className="feature-copy" data-reveal>
                <p className="eyebrow">{t("skills.label")}</p>
                <h3>{t("skills.technical.title")}</h3>
                <p>{t("skills.technical.items").split("|").join(" · ")}</p>
              </div>
            </div>
          </article>

          <article className="feature-row feature-row-2" data-feature-motion>
            <div className="section-shell feature-inner">
              <div className="feature-media"><img src={featureAssets[5]} alt="" loading="lazy" /><span className="feature-index">06</span></div>
              <div className="feature-copy" data-reveal>
                <p className="eyebrow">{t("education.label")}</p>
                <h3>{t("education.title")}</h3>
                <p>{t("education.description")}</p>
              </div>
            </div>
          </article>
        </section>

        <section className="faq-section" aria-labelledby="faq-title">
          <div className="section-shell faq-inner">
            <div className="faq-title" data-reveal>
              <p className="eyebrow">{t("verdict.label")}</p>
              <h2 id="faq-title">{t("verdict.title")}</h2>
            </div>
            <div className="faq-list" data-reveal>
              {faqJobs().map((job) => {
                const open = openFaq === job;
                return (
                  <div className={"faq-item " + (open ? "is-open" : "")} key={job}>
                    <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? "" : job)}>
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

        <section className="education-section" aria-labelledby="education-full-title">
          <div className="section-shell education-inner">
            <div data-reveal>
              <p className="eyebrow">{t("education.label")}</p>
              <p className="education-period">{t("education.period")}</p>
              <h2 id="education-full-title">{t("education.title")}</h2>
            </div>
            <div className="education-copy" data-reveal>
              <h3>{t("education.institution")}</h3>
              <p>{t("education.official")}</p>
              <p className="program">{t("education.program")}</p>
              <p>{t("education.description")}</p>
            </div>
          </div>
          <div className="education-art-divider" aria-hidden="true">
            <span>03</span>
            <span>{t("education.label")}</span>
          </div>
        </section>

        <section className="deity-interlude" data-image-transition aria-label={t("education.label")}>
          <div className="deity-interlude-stage">
            <img className="deity-figure" src="/art/hermes-bottom.png" alt="" loading="lazy" decoding="async" />
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-grid section-shell">
            <div data-reveal>
              <p className="eyebrow">{t("contact.label")}</p>
              <h2 id="contact-title">{t("contact.title")}</h2>
              <p className="contact-description">{t("contact.description")}</p>
            </div>
            <div className="contact-card" data-reveal>
              <div className="contact-card-top"><span>{t("verdict.action")}</span><span>Jakarta, Indonesia</span></div>
              <div className="contact-action-row">
                <div className="contact-actions">
                  <a className="small-button small-button-dark" href={LINKS.email}>{t("contact.emailAction")}</a>
                  <a className="small-button small-button-dark contact-cv-button" href="/Bayu-Andika-CV.pdf" download>{t("common.downloadCv")}</a>
                </div>
                <img className="contact-bayu-card" src="/art/bayu-poster.png" alt="" loading="lazy" decoding="async" />
              </div>
              <PreferenceBar language={language} chooseLanguage={chooseLanguage} t={t} />
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

function faqJobs(): WorkKey[] {
  return ["indomaret", "bmc", "mitra", "restu"];
}

function PreferenceBar({ language, chooseLanguage }: {
  language: Language;
  chooseLanguage: (next: Language) => void;
}) {
  const value = language;

  return (
    <div className="preference-bar">
      <RadioGroup
        value={value}
        onValueChange={(next) => {
          if (next === "id" || next === "en") chooseLanguage(next);
        }}
        className="liquid-language-toggle group relative inline-grid grid-cols-[1fr_1fr] items-center gap-0"
        data-state={value}
      >
        <div
          className="absolute inset-0 isolate -z-10 overflow-hidden rounded-lg"
          style={{ filter: 'url("#radio-glass")' }}
          aria-hidden="true"
        />
        <label className="relative z-10 inline-flex h-9 min-w-12 cursor-pointer select-none items-center justify-center whitespace-nowrap px-3 text-xs font-bold tracking-[0.08em] text-white/65 transition-colors group-data-[state=id]:text-white group-data-[state=en]:text-white/65">
          ID
          <RadioGroupItem id="language-id" value="id" className="sr-only" />
        </label>
        <label className="relative z-10 inline-flex h-9 min-w-12 cursor-pointer select-none items-center justify-center whitespace-nowrap px-3 text-xs font-bold tracking-[0.08em] text-white/65 transition-colors group-data-[state=en]:text-white group-data-[state=id]:text-white/65">
          ENG
          <RadioGroupItem id="language-en" value="en" className="sr-only" />
        </label>
        <GlassFilter />
      </RadioGroup>
    </div>
  );
}

function SocialIcon({ icon, label, href, onClick }: {
  icon: "email" | "phone" | "linkedin" | "github" | "instagram" | "facebook";
  label: string;
  href: string;
  onClick: () => void;
}) {
  const external = href.startsWith("http");
  const paths: Record<string, string> = {
    email: "M4 6h16v12H4z M5 7l7 6 7-6",
    phone: "M8 4l3 5-3 2c2 4 4 6 8 8l2-3 5 3-2 3C13 21 4 12 4 7Z",
    linkedin: "M6 9H3v11h3V9ZM4.5 3A1.8 1.8 0 1 0 4.5 6.6 1.8 1.8 0 0 0 4.5 3ZM21 14c0-3.3-1.8-5-4.3-5-1.8 0-2.8 1-3.3 1.8V9h-3v11h3v-5.5c0-1.5.4-2.9 2.2-2.9 1.8 0 1.9 1.8 1.9 3V20H21Z",
    github: "M12 2.5a9.5 9.5 0 0 0 0 19c.5 0 .7-.2 .7-.5v-2c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-4.7 0-1 .4-1.9 1-2.6.8-1.1.6-2.1.2-2.6 0 0 .8-.3 2.7 1a9.2 9.2 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .4.5.6 1.5.2 2.6.7.7 1 1.6 1 2.6 0 3.7-2.3 4.5-4.6 4.7.4.3.7 1 .7 1.9v2c0 .3.2.5.7.5a9.5 9.5 0 0 0 0-19Z",
    instagram: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm5-1.2h.01",
    facebook: "M14 21v-7h2.5l.4-3H14V9.2c0-.9.3-1.4 1.6-1.4H17V4.4c-.3 0-1.2-.1-2.3-.1-2.5 0-4.2 1.5-4.2 4.3V11H8v3h2.5v7Z",
  };
  return (
    <a className="social-icon-button" href={href} aria-label={label} title={label} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} onClick={onClick}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[icon]} /></svg>
    </a>
  );
}
