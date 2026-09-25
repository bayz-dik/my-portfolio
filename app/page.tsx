"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { CONTENT, LINKS } from "./content.js";
import { readPreferences, writePreference } from "./preferences.js";
import { getNextTabIndex } from "./tab-navigation.js";

type Language = "id" | "en";
type Theme = "light" | "dark";
type WorkKey = "indomaret" | "bmc" | "mitra" | "restu";
type ProofKind = "retail" | "admin" | "production" | "technical";
type SkillKey = "technical" | "operations" | "admin" | "retail";

const jobs: ReadonlyArray<{ key: WorkKey; company: string; location: string; proof: ProofKind; skill: SkillKey }> = [
  { key: "indomaret", company: "PT Indomarco Prismatama", location: "Yogyakarta", proof: "retail", skill: "retail" },
  { key: "bmc", company: "BMC Motor", location: "Yogyakarta", proof: "admin", skill: "admin" },
  { key: "mitra", company: "PT Mitrametal Perkasa", location: "Karawang", proof: "production", skill: "operations" },
  { key: "restu", company: "Restu Computer", location: "Magelang", proof: "technical", skill: "technical" },
];
const skills: readonly SkillKey[] = ["technical", "operations", "admin", "retail"];

export default function Home() {
  const [language, setLanguage] = useState<Language>("id");
  const [theme, setTheme] = useState<Theme>("light");
  const [activeWork, setActiveWork] = useState<WorkKey>("indomaret");
  const [activeSkill, setActiveSkill] = useState<SkillKey>("technical");
  const [announcement, setAnnouncement] = useState("");
  const copy = CONTENT[language] as Record<string, string>;
  const t = useCallback((key: string) => copy[key] ?? (CONTENT.id as Record<string, string>)[key], [copy]);
  const heroLines = t("hero.lines").split("|");
  const activeJob = jobs.find((job) => job.key === activeWork) ?? jobs[0];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = readPreferences(localStorage) as { language: Language; theme: Theme };
      setLanguage(saved.language); setTheme(saved.theme);
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
    const root = document.documentElement;
    root.classList.add("js");
    const header = document.querySelector("[data-header]");
    const chapters = Array.from(document.querySelectorAll<HTMLElement>("[data-work]"));
    const decisionItems = Array.from(document.querySelectorAll<HTMLElement>("[data-decision-item]"));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = document.querySelectorAll("[data-reveal]");
    const revealObserver = !reduced && "IntersectionObserver" in window ? new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver?.unobserve(entry.target);
    }), { threshold: .12 }) : null;
    reveals.forEach((node) => revealObserver ? revealObserver.observe(node) : node.classList.add("visible"));

    let frame = 0;
    const syncProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maxScroll = Math.max(1, root.scrollHeight - innerHeight);
        root.style.setProperty("--page-progress", String(Math.min(1, Math.max(0, scrollY / maxScroll))));
        root.style.setProperty("--hero-progress", String(Math.min(1, Math.max(0, scrollY / Math.max(1, innerHeight)))));
        header?.classList.toggle("compact", scrollY > 24);
        let nearestKey: WorkKey = "indomaret";
        let nearestIndex = 0;
        let nearestPhase = "context";
        let lastChapterProgress = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;
        const stickyTop = innerWidth <= 767 ? 0 : 52;
        chapters.forEach((chapter, index) => {
          const rect = chapter.getBoundingClientRect();
          const travel = Math.max(1, rect.height - innerHeight + stickyTop);
          const progress = Math.min(1, Math.max(0, (stickyTop - rect.top) / travel));
          chapter.style.setProperty("--chapter-progress", String(progress));
          chapter.dataset.phase = progress < .34 ? "context" : progress < .68 ? "actions" : "capability";
          if (index === chapters.length - 1) lastChapterProgress = progress;
          const distance = Math.abs(rect.top + rect.height / 2 - innerHeight / 2);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestKey = chapter.dataset.work as WorkKey;
            nearestIndex = index;
            nearestPhase = chapter.dataset.phase;
          }
        });
        decisionItems.forEach((item, index) => {
          const allComplete = lastChapterProgress >= 1;
          const state = allComplete || index < nearestIndex || (index === nearestIndex && nearestPhase === "capability")
            ? "proven"
            : index === nearestIndex ? "active" : "pending";
          item.dataset.decisionState = state;
        });
        setActiveWork(nearestKey);
      });
    };
    syncProgress();
    addEventListener("scroll", syncProgress, { passive: true });
    addEventListener("resize", syncProgress);
    return () => { removeEventListener("scroll", syncProgress); removeEventListener("resize", syncProgress); cancelAnimationFrame(frame); revealObserver?.disconnect(); };
  }, []);

  const chooseLanguage = (next: Language) => { setLanguage(next); writePreference(localStorage, "language", next); setAnnouncement((CONTENT[next] as Record<string, string>)[`announce.${next}`]); };
  const chooseTheme = (next: Theme) => { setTheme(next); writePreference(localStorage, "theme", next); setAnnouncement(t(`announce.${next}`)); };
  const chooseSkill = (next: SkillKey) => { setActiveSkill(next); setAnnouncement(t("capability.announcement").replace("{capability}", t(`skills.${next}.title`))); };

  return <>
    <a className="skip" href="#main">{t("a11y.skip")}</a>
    <header className="header" data-header><a className="wordmark" href="#top" aria-label={t("a11y.backTop")}>BAYU ANDIKA</a><span className="header-active" aria-live="polite">0{jobs.indexOf(activeJob) + 1} · {t(`bridge.${activeJob.proof}`)}</span><a className="header-contact" href="#contact">{t("verdict.action")} <span aria-hidden="true">→</span></a><span className="page-progress" aria-hidden="true"><i /></span></header>
    <main id="main" tabIndex={-1}>
      <section id="top" className="hero-stage" aria-labelledby="hero-title"><div className="hero-wrap"><div className="hero-art-layer"><AphroditeArt variant="hero" /></div><div className="hero-topline"><p>{t("hero.role")}</p><p>{t("hero.signal")}</p></div><h1 id="hero-title" aria-label={t("hero.title")}>{heroLines.map((line, index) => <span className={index > 1 ? "outline-line" : ""} key={`${language}-${line}`} aria-hidden="true"><i>{line}</i></span>)}</h1><div className="hero-bottom"><div><p className="hero-copy">{t("hero.description")}</p><div className="actions"><a className="btn primary" href="#experience">{t("hero.experienceAction")} <span aria-hidden="true">↘</span></a><a className="btn secondary" href="/Bayu-Andika-CV.pdf" download>{t("common.downloadCv")}</a></div></div><ol className="hero-scan" aria-label={t("hero.signal")}>{t("hero.scan").split("|").map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></div><a className="scroll-invite" href="#scan"><span>{t("hero.scrollPrompt")}</span><b aria-hidden="true">↓</b></a></div></section>
      <RecruiterScan t={t} />
      <section id="experience" className="experience" data-active-work={activeWork} aria-labelledby="experience-title"><div className="experience-intro wrap"><div data-reveal><p className="label">{t("experience.label")}</p><h2 id="experience-title">{t("experience.title")}</h2></div><div data-reveal><p className="intro">{t("experience.intro")}</p></div></div><div className="decision-route-shell wrap"><CareerRoute activeWork={activeWork} t={t} /></div><div className="proof-track">{jobs.map((job, index) => <ProofChapter key={job.key} job={job} index={index} language={language} t={t} />)}</div></section>
      <CapabilityConsole activeSkill={activeSkill} chooseSkill={chooseSkill} t={t} />
      <section id="education" className="education-strip"><div className="wrap education-grid" data-reveal><p className="label">{t("education.label")}</p><div><p className="education-period">{t("education.period")}</p><h2>{t("education.title")}</h2></div><div><h3>{t("education.institution")}</h3><p className="education-official">{t("education.official")}</p><p className="program">{t("education.program")}</p><p>{t("education.description")}</p></div></div></section>
      <section id="contact" className="verdict-section" aria-labelledby="verdict-title"><div className="verdict-orbit" aria-hidden="true">01 · 02 · 03 · 04 ·</div><div className="wrap verdict-grid"><div><p className="label">{t("verdict.label")}</p><DecisionSummary t={t} /><h2 id="verdict-title">{t("verdict.title")}</h2><p className="verdict-copy">{t("verdict.description")}</p></div><div className="contact-command"><a className="verdict-action" href={LINKS.email}>{t("verdict.action")} <span aria-hidden="true">→</span></a><nav className="contact-links" aria-label={t("contact.label")}><ContactIcon icon="email" label={t("contact.emailLabel")} href={LINKS.email} /><ContactIcon icon="phone" label={t("contact.phoneLabel")} href={LINKS.phone} /><ContactIcon icon="linkedin" label={t("contact.linkedinLabel")} href={LINKS.linkedin} /><ContactIcon icon="github" label={t("contact.githubLabel")} href={LINKS.github} /><ContactIcon icon="instagram" label={t("contact.instagramLabel")} href={LINKS.instagram} /><ContactIcon icon="facebook" label={t("contact.facebookLabel")} href={LINKS.facebook} /></nav><a className="contact-location" href={LINKS.maps} target="_blank" rel="noopener noreferrer"><ContactGlyph icon="location" /><span>{t("contact.locationLabel")}: Magelang, Indonesia</span></a><div className="contact-actions"><a className="btn black" href={LINKS.email}>{t("contact.emailAction")}</a><a className="btn outline" href="/Bayu-Andika-CV.pdf" download>{t("common.downloadCv")}</a></div><PreferenceBar language={language} theme={theme} chooseLanguage={chooseLanguage} chooseTheme={chooseTheme} t={t} /></div><p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p></div></section>
    </main>
    <footer><strong>BAYU ANDIKA</strong><span>{t("footer.role")}</span><span>© 2026</span></footer>
  </>;
}

function RecruiterScan({ t }: { t: (key: string) => string }) { const points = t("scan.points").split("|"); return <section id="scan" className="recruiter-scan" aria-labelledby="scan-title"><div className="wrap scan-grid"><div data-reveal><p className="label">{t("scan.label")}</p><h2 id="scan-title">{t("scan.title")}</h2></div><div data-reveal><p className="scan-description">{t("scan.description")}</p><ol className="scan-points">{points.map((point, index) => <li key={point}><span>0{index + 1}</span><p>{point}</p></li>)}</ol></div></div><div className="kinetic-marquee" aria-hidden="true"><div>{[0, 1, 2].map((item) => <span key={item}>{t("scan.marquee")}</span>)}</div></div></section>; }
function CareerRoute({ activeWork, t }: { activeWork: WorkKey; t: (key: string) => string }) { return <nav aria-label={t("experience.title")}><ol className="career-route" data-decision-route>{jobs.map((job, index) => <li key={job.key} data-decision-item={job.key} data-active={activeWork === job.key ? "true" : "false"}><a href={`#proof-${job.key}`}><span>0{index + 1}</span><b>{t(`decision.${job.key}`)}</b><em className="sr-only">{t(`bridge.${job.proof}`)}</em></a></li>)}</ol></nav>; }

function ProofChapter({ job, index, language, t }: { job: (typeof jobs)[number]; index: number; language: Language; t: (key: string) => string }) { const proofItems = t(`experience.${job.key}.proof`).split("|"); const phaseLabels = language === "id" ? ["KONTEKS", "TINDAKAN", "KEMAMPUAN"] : ["CONTEXT", "ACTIONS", "CAPABILITY"]; return <article id={`proof-${job.key}`} className="proof-chapter" data-proof-chapter={job.key} data-work={job.key} data-proof={job.proof} data-phase="context"><div className="chapter-shell"><AphroditeArt variant="chapter" /><div className="chapter-question" data-recruiter-question><span className="chapter-number">0{index + 1}</span><p className="proof-kicker">{t(`experience.${job.key}.kicker`)}</p><h3>{t(`experience.${job.key}.question`)}</h3><span className="question-mark" aria-hidden="true">?</span></div><div className="proof-interface"><div className="interface-top"><span>{t("proof.label")} / 0{index + 1}</span><span className="live-status"><i /> {t("capability.status")}</span></div><div className="job-meta"><div><strong>{job.company}</strong><span>{job.location}</span></div><time>{t(`experience.${job.key}.period`)}</time></div><div className="phase-block phase-context"><p className="phase-label">01 / {phaseLabels[0]}</p><h4>{t(`experience.${job.key}.role`)}</h4><p>{t(`experience.${job.key}.body`)}</p></div><div className="phase-block phase-actions"><p className="phase-label">02 / {phaseLabels[1]}</p><ProofFormat kind={job.proof} items={proofItems} /></div><div className="phase-block phase-capability" data-capability-unlock><p className="phase-label">03 / {phaseLabels[2]}</p><div className="unlock-row"><span>{t("proof.unlocked")}</span><b>{t("proof.proven")}</b></div><h4>{t(`experience.${job.key}.unlock`)}</h4><p>{t(`experience.${job.key}.payoff`)}</p></div><span className="chapter-progress" aria-hidden="true"><i /></span></div></div></article>; }

function ProofFormat({ kind, items }: { kind: ProofKind; items: string[] }) { if (kind === "admin") return <ol className="proof-format proof-format-admin">{items.map((item, index) => <li key={item} style={{ "--item-index": index } as CSSProperties}><span>0{index + 1}</span><b>{item}</b></li>)}</ol>; if (kind === "production") return <ul className="proof-format proof-format-production">{items.map((item, index) => <li key={item} style={{ "--item-index": index } as CSSProperties}><span aria-hidden="true">✓</span>{item}</li>)}</ul>; if (kind === "technical") return <ol className="proof-format proof-format-technical">{items.map((item, index) => <li key={item} style={{ "--item-index": index } as CSSProperties}><b>{index + 1}</b><span>{item}</span></li>)}</ol>; return <ul className="proof-format proof-format-retail">{items.map((item, index) => <li key={item} style={{ "--item-index": index } as CSSProperties}><span>0{index + 1}</span>{item}</li>)}</ul>; }

function DecisionSummary({ t }: { t: (key: string) => string }) { return <ol className="decision-summary" data-decision-summary data-reveal>{jobs.map((job, index) => <li key={job.key} style={{ "--item-index": index } as CSSProperties}><span aria-hidden="true">0{index + 1}</span><b>{t(`decision.${job.key}`)}</b></li>)}</ol>; }

function CapabilityConsole({ activeSkill, chooseSkill, t }: { activeSkill: SkillKey; chooseSkill: (key: SkillKey) => void; t: (key: string) => string }) { const items = t(`skills.${activeSkill}.items`).split("|"); const moveSkillFocus = (event: KeyboardEvent<HTMLButtonElement>, index: number) => { const nextIndex = getNextTabIndex(event.key, index, skills.length); if (nextIndex === null) return; event.preventDefault(); chooseSkill(skills[nextIndex]); event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus(); }; return <section id="capabilities" className="capability-section" aria-labelledby="capability-title"><div className="wrap"><div className="capability-heading" data-reveal><p className="label">{t("capability.label")}</p><h2 id="capability-title">{t("capability.title")}</h2><p className="intro">{t("capability.intro")}</p></div><div className="capability-art"><AphroditeArt variant="small" /></div><div className="capability-console" data-capability-console data-active-skill={activeSkill}><div className="console-bar"><span>{t("capability.system")}</span><span><i /> {t("capability.online")}</span></div><div className="capability-tabs" role="tablist" aria-label={t("capability.label")}>{skills.map((skill, index) => <button key={skill} type="button" role="tab" id={`tab-${skill}`} aria-controls="capability-panel" aria-selected={activeSkill === skill} tabIndex={activeSkill === skill ? 0 : -1} onClick={() => chooseSkill(skill)} onKeyDown={(event) => moveSkillFocus(event, index)}><span>0{index + 1}</span>{t(`skills.${skill}.title`)}</button>)}</div><div id="capability-panel" className="capability-panel" role="tabpanel" aria-labelledby={`tab-${activeSkill}`} aria-live="polite"><div className="panel-title"><div><p>{t(`skills.${activeSkill}.source`)}</p><h3>{t(`skills.${activeSkill}.title`)}</h3></div><span className="proven-stamp">{t("capability.status")}</span></div><ol>{items.map((item, index) => <li key={item}><span>0{index + 1}</span><p>{item}</p></li>)}</ol></div></div></div></section>; }

function PreferenceBar({ language, theme, chooseLanguage, chooseTheme, t }: { language: Language; theme: Theme; chooseLanguage: (next: Language) => void; chooseTheme: (next: Theme) => void; t: (key: string) => string }) { return <div className="preference-bar"><fieldset className="switch-track theme-switch" data-switch="theme" data-active={theme}><legend className="sr-only">{t("preferences.appearance")}</legend><button type="button" data-theme-option="light" aria-label={t("preferences.light")} aria-pressed={theme === "light"} onClick={() => chooseTheme("light")}><svg data-icon="sun" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button><button type="button" data-theme-option="dark" aria-label={t("preferences.dark")} aria-pressed={theme === "dark"} onClick={() => chooseTheme("dark")}><svg data-icon="moon" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 15.2A8.4 8.4 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z"/></svg></button></fieldset><fieldset className="switch-track language-switch" data-switch="language" data-active={language}><legend className="sr-only">{t("preferences.language")}</legend><button type="button" data-language="id" aria-label={t("preferences.id")} aria-pressed={language === "id"} onClick={() => chooseLanguage("id")}>ID</button><button type="button" data-language="en" aria-label={t("preferences.eng")} aria-pressed={language === "en"} onClick={() => chooseLanguage("en")}>ENG</button></fieldset></div>; }

type ContactIconName = "email" | "phone" | "linkedin" | "github" | "instagram" | "facebook" | "location";

function AphroditeArt({ variant = "hero" }: { variant?: "hero" | "chapter" | "small" }) {
  return (
    <div className={`aphrodite-art aphrodite-art--${variant}`} aria-hidden="true">
      <svg viewBox="0 0 520 760" role="presentation">
        <defs>
          <radialGradient id={`aphroditeGlow-${variant}`} cx="50%" cy="45%" r="58%">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".22" />
            <stop offset="72%" stopColor="currentColor" stopOpacity=".05" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`aphroditeMarble-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity=".98" />
            <stop offset="48%" stopColor="#d8e4ff" stopOpacity=".94" />
            <stop offset="100%" stopColor="#7d8fc9" stopOpacity=".9" />
          </linearGradient>
          <filter id={`aphroditeShadow-${variant}`} x="-30%" y="-20%" width="160%" height="160%">
            <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#10163d" floodOpacity=".28" />
          </filter>
        </defs>
        <circle className="aphrodite-glow" cx="260" cy="350" r="250" fill={`url(#aphroditeGlow-${variant})`} />
        <g className="aphrodite-orbits">
          <ellipse cx="260" cy="350" rx="230" ry="92" fill="none" stroke="currentColor" strokeOpacity=".32" strokeWidth="1" />
          <ellipse cx="260" cy="350" rx="215" ry="145" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="1" transform="rotate(-26 260 350)" />
          <ellipse cx="260" cy="350" rx="220" ry="165" fill="none" stroke="currentColor" strokeOpacity=".18" strokeWidth="1" transform="rotate(24 260 350)" />
          <path d="M26 350C92 170 422 132 494 350C422 568 92 530 26 350Z" fill="none" stroke="currentColor" strokeOpacity=".13" />
          <g className="aphrodite-rays">
            {Array.from({ length: 18 }).map((_, i) => <path key={i} d="M260 350L260 78" transform={`rotate(${i * 20} 260 350)`} />)}
          </g>
        </g>
        <g className="aphrodite-figure" filter={`url(#aphroditeShadow-${variant})`}>
          <path d="M145 728C151 642 166 574 205 514C220 490 230 467 232 440L288 440C291 468 301 492 316 516C355 576 370 642 376 728Z" fill={`url(#aphroditeMarble-${variant})`} />
          <path d="M205 514C174 556 145 592 121 636C109 658 92 676 72 688C105 701 137 699 164 683C185 670 202 649 218 623L244 565Z" fill="#dbe5ff" fillOpacity=".9" />
          <path d="M315 516C346 556 375 592 399 636C411 658 428 676 448 688C415 701 383 699 356 683C335 670 318 649 302 623L276 565Z" fill="#c9d6fb" fillOpacity=".92" />
          <path d="M214 496C229 475 238 455 240 427H280C282 455 291 475 306 496C292 516 278 528 260 532C242 528 228 516 214 496Z" fill="#eef3ff" />
          <ellipse cx="260" cy="320" rx="78" ry="104" fill={`url(#aphroditeMarble-${variant})`} />
          <path d="M185 317C182 242 211 196 261 195C310 195 339 242 335 317C321 278 302 254 260 248C218 254 199 278 185 317Z" fill="#c9d6fb" />
          <path d="M184 286C166 256 170 217 193 190C209 171 232 159 260 158C288 159 311 171 327 190C350 217 354 256 336 286C327 249 313 219 286 202C278 226 244 239 217 225C202 241 192 261 184 286Z" fill="#dce6ff" />
          <path d="M228 318C239 326 249 329 260 329C271 329 281 326 292 318" fill="none" stroke="#6f80b6" strokeWidth="4" strokeLinecap="round" />
          <path d="M231 300C242 294 250 294 257 298M263 298C270 294 278 294 289 300" fill="none" stroke="#6575aa" strokeWidth="3" strokeLinecap="round" />
          <path d="M258 300L254 321L264 323" fill="none" stroke="#7383b9" strokeWidth="3" strokeLinecap="round" />
          <path d="M206 371C224 390 240 399 260 399C280 399 296 390 314 371" fill="none" stroke="#7181b7" strokeWidth="4" strokeLinecap="round" />
          <path d="M196 422C215 447 233 460 260 463C287 460 305 447 324 422" fill="none" stroke="#6f80b6" strokeWidth="5" strokeLinecap="round" />
          <path d="M201 475C220 490 239 497 260 498C281 497 300 490 319 475" fill="none" stroke="#8392c0" strokeWidth="4" />
          <path d="M212 560C230 579 246 588 260 590C274 588 290 579 308 560" fill="none" stroke="#7282b7" strokeWidth="5" opacity=".8" />
          <path d="M182 600C211 620 235 632 260 634C285 632 309 620 338 600" fill="none" stroke="#7b8bc0" strokeWidth="5" opacity=".72" />
          <path d="M151 654C196 674 226 684 260 686C294 684 324 674 369 654" fill="none" stroke="#7b8bc0" strokeWidth="5" opacity=".65" />
          <path d="M200 235C187 202 197 174 221 157M320 235C333 202 323 174 299 157" fill="none" stroke="#f8fbff" strokeWidth="12" strokeLinecap="round" />
          <path d="M205 181C217 144 242 125 260 125C278 125 303 144 315 181" fill="none" stroke="#f7faff" strokeWidth="7" strokeLinecap="round" />
          <path d="M191 410C170 437 155 468 151 505M329 410C350 437 365 468 369 505" fill="none" stroke="#f6f9ff" strokeWidth="11" strokeLinecap="round" />
          <path d="M147 505C118 518 93 542 77 570" fill="none" stroke="#d8e4ff" strokeWidth="8" strokeLinecap="round" />
          <path d="M373 505C402 518 427 542 443 570" fill="none" stroke="#cbd8fc" strokeWidth="8" strokeLinecap="round" />
        </g>
        <g className="aphrodite-shell">
          <path d="M225 122C243 104 277 104 295 122C282 116 270 112 260 112C250 112 238 116 225 122Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M215 116C230 94 247 84 260 82C273 84 290 94 305 116" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 7" />
        </g>
      </svg>
    </div>
  );
}

function ContactIcon({ icon, label, href }: { icon: ContactIconName; label: string; href: string }) { const external = href.startsWith("http"); return <a className="contact-icon" href={href} aria-label={label} title={label} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}><ContactGlyph icon={icon} /></a>; }
function ContactGlyph({ icon }: { icon: ContactIconName }) { switch (icon) { case "email": return <svg data-contact-icon={icon} aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>; case "phone": return <svg data-contact-icon={icon} aria-hidden="true" viewBox="0 0 24 24"><path d="M8.1 3.6 10 8.1 7.6 9.5a15.3 15.3 0 0 0 6.9 6.9L15.9 14l4.5 1.9-.2 3.1c-.1 1.1-1 2-2.2 2C9.7 21 3 14.3 3 6c0-1.1.9-2.1 2-2.2l3.1-.2Z"/></svg>; case "linkedin": return <svg data-contact-icon={icon} aria-hidden="true" viewBox="0 0 24 24"><path d="M6.5 8.4H3.2V19h3.3V8.4ZM4.8 3A1.9 1.9 0 1 0 4.8 6.8 1.9 1.9 0 0 0 4.8 3ZM20.8 13c0-3.2-1.7-4.9-4.1-4.9-1.9 0-2.8 1.1-3.3 1.8V8.4h-3.3V19h3.3v-5.2c0-1.4.3-2.8 2.1-2.8 1.8 0 1.8 1.7 1.8 2.9V19h3.5v-6Z"/></svg>; case "github": return <svg data-contact-icon={icon} aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2.8a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-4.7 0-1 .4-1.9 1-2.6-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.2 9.2 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.7.7 1 1.6 1 2.6 0 3.7-2.3 4.5-4.6 4.7.4.3.7 1 .7 1.9v2.8c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.8Z"/></svg>; case "instagram": return <svg data-contact-icon={icon} aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle className="fill-dot" cx="17.4" cy="6.7" r="1"/></svg>; case "facebook": return <svg data-contact-icon={icon} aria-hidden="true" viewBox="0 0 24 24"><path d="M13.7 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5H17V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.5V13h2.8v8h3.4Z"/></svg>; case "location": return <svg data-contact-icon={icon} aria-hidden="true" viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>; } }
