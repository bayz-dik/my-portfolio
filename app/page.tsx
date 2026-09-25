"use client";

import { useCallback, useEffect, useState } from "react";
import { CONTENT, LINKS } from "./content.js";
import { readPreferences, writePreference } from "./preferences.js";

type Language = "id" | "en";
type Theme = "light" | "dark";
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
  "https://web-assets.nousresearch.com/nousnet-web/img/desktop/feature-connect.00398e980c0dd2f8.webp",
  "https://web-assets.nousresearch.com/nousnet-web/img/desktop/feature-memory.01a45f37b0af6978.webp",
  "https://web-assets.nousresearch.com/nousnet-web/img/desktop/feature-automation.d44bac592cfe9298.webp",
  "https://web-assets.nousresearch.com/nousnet-web/img/desktop/feature-tasks.1f1ac2b58490d896.webp",
  "https://web-assets.nousresearch.com/nousnet-web/img/desktop/feature-browse.dc3e16e83609e822.webp",
  "https://web-assets.nousresearch.com/nousnet-web/img/desktop/feature-sandbox.095069d7fe5b76a7.webp",
];

const aphroditeSrc = "https://upload.wikimedia.org/wikipedia/commons/e/ea/Venus_Genetrix.jpg";

export default function Home() {
  const [language, setLanguage] = useState<Language>("id");
  const [theme, setTheme] = useState<Theme>("light");
  const [openFaq, setOpenFaq] = useState<WorkKey | "">("indomaret");
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const copy = CONTENT[language] as Record<string, string>;
  const t = useCallback((key: string) => copy[key] ?? (CONTENT.id as Record<string, string>)[key], [copy]);

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
    const featureNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-feature-motion]"));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealObserver = !reduced && "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver?.unobserve(entry.target);
          });
        }, { threshold: 0.08 })
      : null;

    revealNodes.forEach((node) => revealObserver ? revealObserver.observe(node) : node.classList.add("is-visible"));

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maxScroll = Math.max(1, root.scrollHeight - innerHeight);
        root.style.setProperty("--scroll-progress", String(Math.min(1, Math.max(0, scrollY / maxScroll))));
        root.style.setProperty("--hero-shift", String(Math.min(1, Math.max(0, scrollY / Math.max(1, innerHeight)))));
        header?.classList.toggle("compact", scrollY > 18);
        if (hero) header?.classList.toggle("header-on-blue", hero.getBoundingClientRect().bottom > 72);

        featureNodes.forEach((node) => {
          const rect = node.getBoundingClientRect();
          const center = innerHeight * 0.5;
          const distance = (rect.top + rect.height * 0.5) - center;
          const drift = Math.max(-1, Math.min(1, distance / Math.max(1, innerHeight)));
          node.style.setProperty("--feature-shift", String(drift));
        });
      });
    };

    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
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

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className="skip" href="#main">{t("a11y.skip")}</a>

      <header className="site-header" data-site-header>
        <a className="brand" href="#top" aria-label={t("a11y.backTop")}>
          <span>BAYU ANDIKA</span>
        </a>
        <div className="header-right">
          <a className="header-cta" href="#contact">{t("verdict.action")} <span>→</span></a>
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
        </div>
        <div className="page-progress" aria-hidden="true"><i /></div>
      </header>

      <aside id="social-menu" className={"social-menu " + (menuOpen ? "is-open" : "")} aria-hidden={!menuOpen}>
        <div className="social-menu-inner">
          <div>
            <p className="social-menu-kicker">{t("contact.label")}</p>
            <p className="social-menu-note">{t("contact.description")}</p>
          </div>
          <nav className="social-list" aria-label={t("contact.label")}>
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>GitHub <span>↗</span></a>
            <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Instagram <span>↗</span></a>
            <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>LinkedIn <span>↗</span></a>
            <a href={LINKS.facebook} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Facebook <span>↗</span></a>
            <a href={LINKS.email} onClick={closeMenu}>Email <span>→</span></a>
            <a href={LINKS.phone} onClick={closeMenu}>Phone <span>→</span></a>
          </nav>
          <div className="social-menu-bottom">
            <a href="#contact" onClick={closeMenu}>{t("verdict.action")} <span>→</span></a>
            <button type="button" onClick={closeMenu}>Close</button>
          </div>
        </div>
      </aside>

      <main id="main" tabIndex={-1}>
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true"></div>
          <div className="hero-rings" aria-hidden="true"><span></span><span></span><span></span></div>
          <div className="hero-inner">
            <div className="hero-navline">
              <span>{t("hero.role")}</span>
              <span>{t("hero.signal")}</span>
            </div>
            <div className="hero-main">
              <div className="hero-copy">
                <p className="hero-kicker">{t("hero.role")}</p>
                <h1 id="hero-title">
                  {t("hero.lines").split("|").map((line, index) => (
                    <span key={line} className={index > 1 ? "hero-outline" : ""}><i>{line}</i></span>
                  ))}
                </h1>
                <p className="hero-description">{t("hero.description")}</p>
                <div className="hero-actions">
                  <a className="hero-button hero-button-primary" href="#experience">{t("hero.experienceAction")} <span>↘</span></a>
                  <a className="hero-button hero-button-light" href="/Bayu-Andika-CV.pdf" download>{t("common.downloadCv")}</a>
                </div>
              </div>

              <div className="hero-deity">
                <img src={aphroditeSrc} alt="" loading="eager" />
                <span className="deity-ring deity-ring-a"></span>
                <span className="deity-ring deity-ring-b"></span>
                <span className="deity-ring deity-ring-c"></span>
              </div>
            </div>

            <div className="hero-bottom">
              <div className="hero-marquee"><span>{t("hero.signal")}</span><span>{t("hero.signal")}</span><span>{t("hero.signal")}</span></div>
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

        <section className="platform-section" aria-label={t("experience.label")}>
          <div className="section-shell platform-shell">
            <div className="platform-heading" data-reveal>
              <p className="eyebrow">{t("hero.role")}</p>
              <h2>{t("experience.title")}</h2>
            </div>
            <div className="platform-grid">
              {jobs.map((job) => (
                <a key={job.key} className="platform-card" href={"#work-" + job.key} data-reveal>
                  <div className="platform-image"><img src={job.image} alt="" loading="lazy" /></div>
                  <div className="platform-meta">
                    <span>{job.number}</span>
                    <strong>{t("experience." + job.key + ".role")}</strong>
                    <small>{job.company}</small>
                  </div>
                </a>
              ))}
            </div>
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
                  <div className="feature-deity"><img src={aphroditeSrc} alt="" loading="lazy" /></div>
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
              <div className="feature-media">
                <img src={featureAssets[4]} alt="" loading="lazy" />
                <span className="feature-index">05</span>
              </div>
              <div className="feature-copy" data-reveal>
                <p className="eyebrow">{t("skills.technical.source")}</p>
                <h3>{t("skills.technical.title")}</h3>
                <p>{t("skills.technical.items").split("|").join(" · ")}</p>
              </div>
            </div>
          </article>

          <article className="feature-row feature-row-2" data-feature-motion>
            <div className="section-shell feature-inner">
              <div className="feature-media">
                <img src={featureAssets[5]} alt="" loading="lazy" />
                <span className="feature-index">06</span>
              </div>
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

        <section className="portal-section" id="education" aria-labelledby="portal-title">
          <div className="section-shell portal-inner">
            <div className="portal-art"><img src="https://web-assets.nousresearch.com/nousnet-web/img/desktop/portal-figure.1a7331fc19b39242.webp" alt="" loading="lazy" /></div>
            <div className="portal-copy" data-reveal>
              <p className="eyebrow">{t("education.label")}</p>
              <h2 id="portal-title">{t("education.title")}</h2>
              <p>{t("education.description")}</p>
              <a className="portal-button" href="#contact">{t("verdict.action")} <span>→</span></a>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-orbit" aria-hidden="true"><img src={aphroditeSrc} alt="" loading="lazy" /></div>
          <div className="section-shell contact-grid">
            <div data-reveal>
              <p className="eyebrow">{t("contact.label")}</p>
              <h2 id="contact-title">{t("contact.title")}</h2>
              <p className="contact-description">{t("contact.description")}</p>
              <a className="contact-main-button" href={LINKS.email}>{t("contact.emailAction")} <span>→</span></a>
            </div>
            <div className="contact-card" data-reveal>
              <div className="contact-card-top"><span>{t("verdict.action")}</span><span>© 2026</span></div>
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

function faqJobs(): WorkKey[] {
  return ["indomaret", "bmc", "mitra", "restu"];
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
