"use client";

const logos = [
  {
    name: "Hermes Agent",
    href: "https://hermes-agent.nousresearch.com/",
    src: "https://hermes-agent.nousresearch.com/docs/img/logo.png",
  },
  {
    name: "ChatGPT",
    href: "https://chatgpt.com/",
    src: "https://cdn.simpleicons.org/openai/ffffff",
  },
  {
    name: "Claude",
    href: "https://claude.ai/",
    src: "https://cdn.simpleicons.org/anthropic/ffffff",
  },
  {
    name: "21st.dev",
    href: "https://21st.dev/",
    src: "https://assets.loftlyy.com/brands/21st/21st-logo-white.svg",
  },
];

export default function LogoCloudTwo() {
  return (
    <nav className="logo-cloud-two" aria-label="AI and design tools">
      {logos.map(({ name, href, src }) => (
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
            className="logo-cloud-two-icon"
            loading="lazy"
            decoding="async"
          />
          <span className="sr-only">{name}</span>
        </a>
      ))}
    </nav>
  );
}
