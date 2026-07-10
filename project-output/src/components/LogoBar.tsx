interface LogoData {
  name: string
  svg: string
  color: string
}

const logos: LogoData[] = [
  {
    name: "Vercel",
    color: "#ffffff",
    svg: `<svg viewBox="0 0 283 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5"><path d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-18-19-18Zm-9.61 13.5c1.38-4 5.11-6.5 9.61-6.5s8.23 2.5 9.61 6.5h-19.22Zm-13.82 3.5c0 7.2-5.54 14-14 14-2.55 0-4.97-.6-7.03-1.67L84.5 39.7l2.77-6.9c1.27.72 2.75 1.1 4.34 1.1 4.39 0 7.93-3.45 7.93-7.93v-22.3h7v4.75c1.47-2.85 4.45-4.75 7.94-4.75 5.12 0 8.53 3.59 8.53 9V33h-7v-9.5c0-3.19-1.94-5.5-5.06-5.5s-5.06 2.31-5.06 5.5v9.5h-7V16.5h-7.56v2.5Zm-37.74-1.76c0-3.19-1.96-5.5-5.04-5.5s-5.03 2.31-5.03 5.5v9.5h-7v-9.5c0-3.19-1.96-5.5-5.04-5.5s-5.03 2.31-5.03 5.5v9.5h-7V16.5h7v2.69c1.47-2.19 3.87-3.19 6.53-3.19 3.33 0 6.07 1.56 7.53 4.06 1.47-2.5 4.21-4.06 7.54-4.06 5.12 0 8.54 3.59 8.54 9V33h-7V17.74ZM0 33V16.5h7v14h17.5v2.5H0Z" fill="currentColor"/></svg>`,
  },
  {
    name: "Linear",
    color: "#5E6AD2",
    svg: `<svg viewBox="0 0 126 126" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-6"><rect x="2" y="2" width="122" height="122" rx="28" fill="#5E6AD2"/><rect x="2" y="2" width="122" height="122" rx="28" stroke="white" stroke-opacity="0.1" stroke-width="4"/><path d="M35 63L63 35L91 63L63 91L35 63Z" fill="white" fill-opacity="0.9"/><path d="M42 63L63 42L84 63L63 84L42 63Z" fill="#5E6AD2"/></svg>`,
  },
  {
    name: "Raycast",
    color: "#FF6363",
    svg: `<svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-6"><rect width="128" height="128" rx="24" fill="#1A1A1A"/><path d="M64 24L104 64L64 104L24 64L64 24Z" fill="#FF6363"/><path d="M64 36L92 64L64 92L36 64L64 36Z" fill="white" fill-opacity="0.9"/><path d="M64 48L80 64L64 80L48 64L64 48Z" fill="#FF6363"/></svg>`,
  },
  {
    name: "Supabase",
    color: "#3ECF8E",
    svg: `<svg viewBox="0 0 109 113" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-6"><path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="#3ECF8E"/><path d="M46.1587 2.28022C48.9967 -1.32064 54.7494 0.658716 54.8612 5.25259L56.5295 72.5039L10.672 72.5039C2.48133 72.5039-2.08689 63.0438 3.00614 56.6292L46.1587 2.28022Z" fill="#3ECF8E"/></svg>`,
  },
  {
    name: "Cal.com",
    color: "#292929",
    svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-6"><rect width="120" height="120" rx="24" fill="#111111"/><rect x="20" y="20" width="80" height="80" rx="12" stroke="white" stroke-opacity="0.9" stroke-width="6"/><path d="M35 55H85" stroke="white" stroke-opacity="0.9" stroke-width="5" stroke-linecap="round"/><path d="M35 70H70" stroke="white" stroke-opacity="0.7" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="45" r="4" fill="#3ECF8E"/></svg>`,
  },
  {
    name: "WorkOS",
    color: "#6366F1",
    svg: `<svg viewBox="0 0 130 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5"><path d="M8 0C3.58 0 0 3.58 0 8V24C0 28.42 3.58 32 8 32H24C28.42 32 32 28.42 32 24V8C32 3.58 28.42 0 24 0H8Z" fill="#6366F1"/><path d="M8 8H24V12H16V16H24V20H16V24H8V8Z" fill="white"/><path d="M38 10V22H42V17H48V22H52V10H48V14H42V10H38Z" fill="currentColor" opacity="0.8"/><path d="M58 10V22H62V14H68V10H58ZM62 18H68V22H62V18Z" fill="currentColor" opacity="0.8"/><path d="M74 10V22H78V17H84V22H88V10H84V14H78V10H74Z" fill="currentColor" opacity="0.8"/><path d="M94 10V22H106V18H98V10H94ZM98 14H102V18H98V14Z" fill="currentColor" opacity="0.8"/></svg>`,
  },
  {
    name: "Notion",
    color: "#ffffff",
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-6"><rect width="100" height="100" rx="12" fill="#111111"/><rect x="8" y="8" width="84" height="84" rx="6" stroke="white" stroke-opacity="0.9" stroke-width="2"/><path d="M26 24H74L78 28V76L74 80H26L22 76V28L26 24Z" fill="white" fill-opacity="0.05"/><path d="M30 30H70V34H30V30Z" fill="white" fill-opacity="0.8"/><path d="M30 40H66V44H30V40Z" fill="white" fill-opacity="0.5"/><path d="M30 50H58V54H30V50Z" fill="white" fill-opacity="0.5"/><path d="M30 60H62V64H30V60Z" fill="white" fill-opacity="0.5"/></svg>`,
  },
  {
    name: "Figma",
    color: "#F24E1E",
    svg: `<svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-6"><path d="M50 300C77.6142 300 100 277.614 100 250V200H50C22.3858 200 0 222.386 0 250C0 277.614 22.3858 300 50 300Z" fill="#F24E1E"/><path d="M0 150C0 122.386 22.3858 100 50 100H100V200H50C22.3858 200 0 177.614 0 150Z" fill="#FF7262"/><path d="M0 50C0 22.3858 22.3858 0 50 0H100V100H50C22.3858 100 0 77.6142 0 50Z" fill="#0ACF83"/><path d="M100 0H150C177.614 0 200 22.3858 200 50C200 77.6142 177.614 100 150 100H100V0Z" fill="#A259FF"/><path d="M200 150C200 177.614 177.614 200 150 200C122.386 200 100 177.614 100 150C100 122.386 122.386 100 150 100C177.614 100 200 122.386 200 150Z" fill="#F24E1E"/></svg>`,
  },
  {
    name: "GitHub",
    color: "#ffffff",
    svg: `<svg viewBox="0 0 98 96" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-6"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0Z" fill="currentColor"/></svg>`,
  },
  {
    name: "Slack",
    color: "#4A154B",
    svg: `<svg viewBox="0 0 270 270" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-6"><path d="M99.4 151.2C99.4 163.1 89.7 172.8 77.8 172.8C65.9 172.8 56.2 163.1 56.2 151.2C56.2 139.3 65.9 129.6 77.8 129.6H99.4V151.2Z" fill="#E01E5A"/><path d="M110.3 151.2C110.3 139.3 120 129.6 131.9 129.6C143.8 129.6 153.5 139.3 153.5 151.2V192.2C153.5 204.1 143.8 213.8 131.9 213.8C120 213.8 110.3 204.1 110.3 192.2V151.2Z" fill="#E01E5A"/><path d="M131.9 99.4C120 99.4 110.3 89.7 110.3 77.8C110.3 65.9 120 56.2 131.9 56.2C143.8 56.2 153.5 65.9 153.5 77.8V99.4H131.9Z" fill="#36C5F0"/><path d="M131.9 110.3C143.8 110.3 153.5 120 153.5 131.9C153.5 143.8 143.8 153.5 131.9 153.5H77.8C65.9 153.5 56.2 143.8 56.2 131.9C56.2 120 65.9 110.3 77.8 110.3H131.9Z" fill="#36C5F0"/><path d="M172.8 131.9C172.8 120 182.5 110.3 194.4 110.3C206.3 110.3 216 120 216 131.9C216 143.8 206.3 153.5 194.4 153.5H172.8V131.9Z" fill="#2EB67D"/><path d="M161.9 131.9C161.9 143.8 152.2 153.5 140.3 153.5C128.4 153.5 118.7 143.8 118.7 131.9V77.8C118.7 65.9 128.4 56.2 140.3 56.2C152.2 56.2 161.9 65.9 161.9 77.8V131.9Z" fill="#2EB67D"/><path d="M140.3 172.8C152.2 172.8 161.9 182.5 161.9 194.4C161.9 206.3 152.2 216 140.3 216C128.4 216 118.7 206.3 118.7 194.4V172.8H140.3Z" fill="#ECB22E"/><path d="M140.3 161.9C128.4 161.9 118.7 152.2 118.7 140.3C118.7 128.4 128.4 118.7 140.3 118.7H194.4C206.3 118.7 216 128.4 216 140.3C216 152.2 206.3 161.9 194.4 161.9H140.3Z" fill="#ECB22E"/></svg>`,
  },
];

export default function LogoBar() {
  return (
    <section className="border-t border-white/[0.04] bg-canvas py-12 md:py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-8 text-center text-[11px] font-medium tracking-[0.12em] text-ink-subtle uppercase">
          Trusted by engineering teams worldwide
        </p>
        <div className="relative overflow-hidden">
          <div className="flex animate-logo-scroll gap-14 md:gap-20 items-center">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex shrink-0 items-center gap-3 opacity-40 transition-opacity duration-300 hover:opacity-70"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${logo.color}15` }}
                  dangerouslySetInnerHTML={{ __html: logo.svg }}
                />
                <span
                  className="text-[14px] font-medium whitespace-nowrap"
                  style={{ color: logo.color, opacity: 0.7 }}
                >
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
