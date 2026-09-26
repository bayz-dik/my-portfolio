"use client";

type LogoProps = { className?: string };

const HermesLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 48 48" aria-hidden="true" className={className} fill="none">
    <path d="M8 13h28L30 18H13l-5-5Zm4 9h24l-6 5H17l-5-5Zm5 9h18l-7 6H24l-7-6Z" fill="currentColor"/>
    <path d="M9 13c4 2 8 5 11 9 3 4 5 8 6 13" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
);

const ChatGPTLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 48 48" aria-hidden="true" className={className} fill="none">
    <path d="M24 8.5a8.2 8.2 0 0 1 7.8 5.7 8.2 8.2 0 0 1 7.1 8.1 8.2 8.2 0 0 1-3.8 7 8.2 8.2 0 0 1-4.1 8.7 8.2 8.2 0 0 1-8.3-.2 8.2 8.2 0 0 1-8.1 1.2 8.2 8.2 0 0 1-5.2-6.4 8.2 8.2 0 0 1-5.1-6.5 8.2 8.2 0 0 1 3.8-8 8.2 8.2 0 0 1 4.1-8.6 8.2 8.2 0 0 1 8.3.2A8.2 8.2 0 0 1 24 8.5Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
    <path d="m16 16 16 9m-16 0 16-9M16 16v18m16-18v18m-16 9 16-9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/>
  </svg>
);

const ClaudeLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 48 48" aria-hidden="true" className={className} fill="currentColor">
    <path d="M24 3.5 27 18l8.9-11.1-4.1 14.2L46 17l-12.4 9.3L46 35l-14.2-4.1L36 45l-9.2-12.3L24 47l-3-14.3L12 43l4.1-14.2L2 31l12.4-9.3L2 13l14.2 4.1L12 3l9.2 12.3L24 3.5Z"/>
  </svg>
);

const TwentyFirstLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 48 48" aria-hidden="true" className={className} fill="none">
    <circle cx="19" cy="24" r="12" fill="currentColor"/>
    <circle cx="29" cy="24" r="12" fill="currentColor" fillOpacity=".58"/>
  </svg>
);

const logos = [
  { name: "Hermes Agent", href: "https://hermes-agent.nousresearch.com/", Icon: HermesLogo },
  { name: "ChatGPT", href: "https://chatgpt.com/", Icon: ChatGPTLogo },
  { name: "Claude", href: "https://claude.ai/", Icon: ClaudeLogo },
  { name: "21st.dev", href: "https://21st.dev/", Icon: TwentyFirstLogo },
];

export default function LogoCloudTwo() {
  return (
    <nav className="logo-cloud-two" aria-label="AI and design tools">
      {logos.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          aria-label={`Open ${name}`}
          title={name}
          target="_blank"
          rel="noopener noreferrer"
          className="logo-cloud-two-link"
        >
          <Icon className="logo-cloud-two-icon" />
          <span className="sr-only">{name}</span>
        </a>
      ))}
    </nav>
  );
}
