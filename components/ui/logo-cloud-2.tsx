"use client";

type Logo = {
  name: string;
  src: string;
  href: string;
};

const logos: Logo[] = [
  {
    name: "Hermes Agent",
    src: "https://hermes-agent.nousresearch.com/favicon.ico",
    href: "https://hermes-agent.nousresearch.com/",
  },
  {
    name: "ChatGPT",
    src: "https://chatgpt.com/favicon.ico",
    href: "https://chatgpt.com/",
  },
  {
    name: "Claude",
    src: "https://claude.ai/favicon.ico",
    href: "https://claude.ai/",
  },
  {
    name: "21st.dev",
    src: "https://21st.dev/favicon.ico",
    href: "https://21st.dev/",
  },
];

export default function LogoCloudTwo() {
  return (
    <div
      className="flex w-full items-center justify-center py-2"
      aria-label="AI and design tools"
    >
      <div className="flex items-center justify-center gap-7 sm:gap-9">
        {logos.map((logo) => (
          <a
            key={logo.name}
            href={logo.href}
            aria-label={logo.name}
            title={logo.name}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-9 w-9 items-center justify-center transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <img
              src={logo.src}
              alt=""
              width={36}
              height={36}
              loading="lazy"
              decoding="async"
              className="h-7 w-7 object-contain brightness-0 invert opacity-80 transition-opacity duration-200 group-hover:opacity-100 sm:h-8 sm:w-8"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
