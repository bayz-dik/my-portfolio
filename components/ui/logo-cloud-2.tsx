"use client";

const logos = [
  {
    name: "Hermes Agent",
    href: "https://hermes-agent.nousresearch.com/",
    src: "/icons/hermes-agent.svg",
    className: "logo-cloud-two-icon logo-cloud-two-icon-hermes",
  },
  {
    name: "ChatGPT",
    href: "https://chatgpt.com/",
    src: "/icons/openai.svg",
    className: "logo-cloud-two-icon",
  },
  {
    name: "Claude",
    href: "https://claude.ai/",
    src: "/icons/claude.svg",
    className: "logo-cloud-two-icon",
  },
  {
    name: "21st.dev",
    href: "https://21st.dev/",
    src: "/icons/21st.svg",
    className: "logo-cloud-two-icon",
  },
];

export default function LogoCloudTwo() {
  return (
    <nav className="logo-cloud-two" aria-label="AI and design tools">
      {logos.map(({ name, href, src, className }) => (
        <a
          key={name}
          href={href}
          aria-label={`Open ${name}`}
          title={name}
          target="_blank"
          rel="noopener noreferrer"
          className="logo-cloud-two-link"
        >
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className={className}
            loading="lazy"
            decoding="async"
          />
          <span className="sr-only">{name}</span>
        </a>
      ))}
    </nav>
  );
}
