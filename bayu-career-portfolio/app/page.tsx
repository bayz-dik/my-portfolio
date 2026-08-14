"use client";

import { useCallback, useEffect, useState } from "react";
import { CONTENT, LINKS } from "./content.js";
import { readPreferences, writePreference } from "./preferences.js";

type Language = "id" | "en";
type Theme = "light" | "dark";

const jobs = [
  ["indomaret", "PT Indomarco Prismatama", "Yogyakarta"],
  ["bmc", "BMC Motor", "Yogyakarta"],
  ["mitra", "PT Mitra Metal Perkasa", "Karawang"],
  ["restu", "Restu Computer", "Magelang"],
] as const;

const skills = ["technical", "operations", "admin", "retail"] as const;

export default function Home() {
  const [language, setLanguage] = useState<Language>("id");
  const [theme, setTheme] = useState<Theme>("light");
  const [announcement, setAnnouncement] = useState("");
  const copy = CONTENT[language] as Record<string, string>;
  const t = useCallback((key: string) => copy[key] ?? (CONTENT.id as Record<string, string>)[key], [copy]);
  const heroLines = t("hero.lines").split("|");

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
  }, [language, theme, t]);

  useEffect(() => {
    document.documentElement.classList.add("js");
    const header = document.querySelector("[data-header]");
    const syncHeader = () => header?.classList.toggle("compact", scrollY > 24);
    addEventListener("scroll", syncHeader, { passive: true });

    const reveal = document.querySelectorAll("[data-reveal]");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = !reduced && "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }), { threshold: 0.14 })
      : null;
    reveal.forEach((node) => observer ? observer.observe(node) : node.classList.add("visible"));

    const workItems = Array.from(document.querySelectorAll<HTMLElement>("[data-work]"));
    let workFrame = 0;
    const syncWorkProgress = () => {
      cancelAnimationFrame(workFrame);
      workFrame = requestAnimationFrame(() => {
        const viewport = innerHeight;
        const enterStart = viewport * .94;
        const enterEnd = viewport * .7;
        const leaveStart = Math.min(150, viewport * .2);
        const leaveEnd = -Math.min(120, viewport * .14);
        workItems.forEach((item) => {
          const rect = item.getBoundingClientRect();
          let opacity = 1;
          if (rect.top > enterEnd) opacity = (enterStart - rect.top) / (enterStart - enterEnd);
          if (rect.bottom < leaveStart) opacity = (rect.bottom - leaveEnd) / (leaveStart - leaveEnd);
          item.style.setProperty("--work-opacity", String(Math.max(.06, Math.min(1, opacity))));
        });
      });
    };
    if (reduced) workItems.forEach((item) => item.style.setProperty("--work-opacity", "1"));
    else {
      syncWorkProgress();
      addEventListener("scroll", syncWorkProgress, { passive: true });
      addEventListener("resize", syncWorkProgress);
    }

    return () => {
      removeEventListener("scroll", syncHeader);
      removeEventListener("scroll", syncWorkProgress);
      removeEventListener("resize", syncWorkProgress);
      cancelAnimationFrame(workFrame);
      observer?.disconnect();
    };
  }, []);

  const chooseLanguage = (next: Language) => {
    setLanguage(next);
    writePreference(localStorage, "language", next);
    setAnnouncement((CONTENT[next] as Record<string, string>)[`announce.${next}`]);
  };

  const chooseTheme = (next: Theme) => {
    setTheme(next);
    writePreference(localStorage, "theme", next);
    setAnnouncement(t(`announce.${next}`));
  };

  return <>
    <a className="skip" href="#main">{t("a11y.skip")}</a>
    <header className="header" data-header>
      <a href="#top" aria-label={t("a11y.backTop")}>BAYU ANDIKA</a>
      <span aria-hidden="true" />
    </header>

    <main id="main" tabIndex={-1}>
      <section id="top" className="hero wrap" aria-labelledby="hero-title">
        <p className="label hero-label">{t("hero.role")}</p>
        <h1 id="hero-title" aria-label={t("hero.title")}>
          {heroLines.map((line, index) => <span key={`${language}-${index}`} aria-hidden="true"><i>{line}</i></span>)}
        </h1>
        <p className="hero-copy">{t("hero.description")}</p>
        <div className="actions">
          <a className="btn primary" href="#experience">{t("hero.experienceAction")}</a>
          <a className="btn secondary" href="/Bayu-Andika-CV.pdf" download>{t("common.downloadCv")}</a>
        </div>
      </section>

      <section id="profile" className="soft">
        <div className="wrap split">
          <div data-reveal>
            <p className="label">{t("profile.label")}</p>
            <p className="profile-bridge">{t("profile.bridge")}</p>
            <h2>{t("profile.title")}</h2>
          </div>
          <div className="profile-copy" data-reveal>
            <p className="intro">{t("profile.description")}</p>
            {["technical", "process", "service"].map((key) => <div className="profile-row" key={key}>
              <h3>{t(`profile.${key}.title`)}</h3><p>{t(`profile.${key}.body`)}</p>
            </div>)}
          </div>
        </div>
      </section>

      <section id="experience" className="dark">
        <div className="wrap experience-grid">
          <div className="sticky" data-reveal>
            <p className="label">{t("experience.label")}</p>
            <h2>{t("experience.title")}</h2>
            <p className="intro">{t("experience.intro")}</p>
          </div>
          <div className="jobs-track">{jobs.map(([key, company, location]) => <article className="job" key={key} data-reveal data-work>
            <div className="job-card">
              <SnakeArrow />
              <div className="meta"><strong>{company}</strong><span>{location}</span><time>{t(`experience.${key}.period`)}</time></div>
              <div className="job-copy"><h3>{t(`experience.${key}.role`)}</h3><p>{t(`experience.${key}.body`)}</p></div>
            </div>
          </article>)}</div>
        </div>
      </section>

      <section id="skills" className="wrap skills-section">
        <div data-reveal>
          <p className="label">{t("skills.label")}</p>
          <h2>{t("skills.title")}</h2>
          <p className="intro">{t("skills.intro")}</p>
        </div>
        <div className="skill-grid">{skills.map((key, index) => <section className="skill" key={key} data-reveal>
          <span>0{index + 1}</span><h3>{t(`skills.${key}.title`)}</h3>
          <ul>{t(`skills.${key}.items`).split("|").map((item) => <li key={item}>{item}</li>)}</ul>
        </section>)}</div>
      </section>

      <section id="education" className="soft">
        <div className="wrap split education">
          <div className="period" data-reveal>{t("education.period")}</div>
          <div data-reveal>
            <p className="label">{t("education.label")}</p>
            <h2>{t("education.title")}</h2>
            <h3 className="school">{t("education.institution")}</h3>
            <p className="education-official">{t("education.official")}</p>
            <p className="program">{t("education.program")}</p>
            <p className="intro">{t("education.description")}</p>
          </div>
        </div>
      </section>

      <section id="contact" className="coral">
        <div className="wrap contact-grid">
          <div data-reveal>
            <p className="label">{t("contact.label")}</p>
            <h2>{t("contact.title")}</h2>
            <p className="intro">{t("contact.description")}</p>
          </div>
          <div className="contact-panel" data-reveal>
            <nav className="contact-links" aria-label={t("contact.label")}>
              <ContactIcon icon="email" label={t("contact.emailLabel")} href={LINKS.email} />
              <ContactIcon icon="phone" label={t("contact.phoneLabel")} href={LINKS.phone} />
              <ContactIcon icon="linkedin" label={t("contact.linkedinLabel")} href={LINKS.linkedin} />
              <ContactIcon icon="github" label={t("contact.githubLabel")} href={LINKS.github} />
              <ContactIcon icon="instagram" label={t("contact.instagramLabel")} href={LINKS.instagram} />
              <ContactIcon icon="facebook" label={t("contact.facebookLabel")} href={LINKS.facebook} />
            </nav>
            <p className="contact-location"><ContactGlyph icon="location" /><span>{t("contact.locationLabel")}: Magelang, Indonesia</span></p>
          </div>
          <div className="contact-actions" data-reveal>
            <a className="btn black" href={LINKS.email}>{t("contact.emailAction")}</a>
            <a className="btn outline" href="/Bayu-Andika-CV.pdf" download>{t("common.downloadCv")}</a>
          </div>
          <div className="preference-bar" data-reveal>
            <fieldset className="switch-track theme-switch" data-switch="theme" data-active={theme}>
              <legend className="sr-only">{t("preferences.appearance")}</legend>
              <button type="button" data-theme-option="light" aria-label={t("preferences.light")} aria-pressed={theme === "light"} onClick={() => chooseTheme("light")}><svg data-icon="sun" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>
              <button type="button" data-theme-option="dark" aria-label={t("preferences.dark")} aria-pressed={theme === "dark"} onClick={() => chooseTheme("dark")}><svg data-icon="moon" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 15.2A8.4 8.4 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z"/></svg></button>
            </fieldset>
            <fieldset className="switch-track language-switch" data-switch="language" data-active={language}>
              <legend className="sr-only">{t("preferences.language")}</legend>
              <button type="button" data-language="id" aria-label={t("preferences.id")} aria-pressed={language === "id"} onClick={() => chooseLanguage("id")}>ID</button>
              <button type="button" data-language="en" aria-label={t("preferences.eng")} aria-pressed={language === "en"} onClick={() => chooseLanguage("en")}>ENG</button>
            </fieldset>
          </div>
          <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
        </div>
      </section>
    </main>

    <footer className="site-footer"><strong>BAYU ANDIKA</strong><span>{t("footer.role")}</span><span>© 2026</span></footer>
  </>;
}

type ContactIconName = "email" | "phone" | "linkedin" | "github" | "instagram" | "facebook" | "location";

function SnakeArrow() {
  return <svg className="job-arrow" aria-hidden="true" viewBox="0 0 28 104">
    <path d="M8 3c17 12-7 27 10 41S7 70 19 88" />
    <path d="m12 83 7 6 2-10" />
  </svg>;
}

function ContactIcon({ icon, label, href }: { icon: ContactIconName; label: string; href: string }) {
  const external = href.startsWith("http");
  return <a className="contact-icon" href={href} aria-label={label} title={label} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
    <ContactGlyph icon={icon} />
  </a>;
}

function ContactGlyph({ icon }: { icon: ContactIconName }) {
  switch (icon) {
    case "email":
      return <svg data-contact-icon={icon} aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>;
    case "phone":
      return <svg data-contact-icon={icon} aria-hidden="true" viewBox="0 0 24 24"><path d="M8.1 3.6 10 8.1 7.6 9.5a15.3 15.3 0 0 0 6.9 6.9L15.9 14l4.5 1.9-.2 3.1c-.1 1.1-1 2-2.2 2C9.7 21 3 14.3 3 6c0-1.1.9-2.1 2-2.2l3.1-.2Z"/></svg>;
    case "linkedin":
      return <svg data-contact-icon={icon} aria-hidden="true" viewBox="0 0 24 24"><path d="M6.5 8.4H3.2V19h3.3V8.4ZM4.8 3A1.9 1.9 0 1 0 4.8 6.8 1.9 1.9 0 0 0 4.8 3ZM20.8 13c0-3.2-1.7-4.9-4.1-4.9-1.9 0-2.8 1.1-3.3 1.8V8.4h-3.3V19h3.3v-5.2c0-1.4.3-2.8 2.1-2.8 1.8 0 1.8 1.7 1.8 2.9V19h3.5v-6Z"/></svg>;
    case "github":
      return <svg data-contact-icon={icon} aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2.8a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-4.7 0-1 .4-1.9 1-2.6-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.2 9.2 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.7.7 1 1.6 1 2.6 0 3.7-2.3 4.5-4.6 4.7.4.3.7 1 .7 1.9v2.8c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.8Z"/></svg>;
    case "instagram":
      return <svg data-contact-icon={icon} aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle className="fill-dot" cx="17.4" cy="6.7" r="1"/></svg>;
    case "facebook":
      return <svg data-contact-icon={icon} aria-hidden="true" viewBox="0 0 24 24"><path d="M13.7 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5H17V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.5V13h2.8v8h3.4Z"/></svg>;
    case "location":
      return <svg data-contact-icon={icon} aria-hidden="true" viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
  }
}
