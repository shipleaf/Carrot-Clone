export const CATEGORY_ICONS = {
  cafe: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h11v5.2a4.8 4.8 0 0 1-4.8 4.8H9.8A4.8 4.8 0 0 1 5 13.2V8Z" />
      <path d="M16 10h1.4a2.6 2.6 0 0 1 0 5.2H16" />
      <path d="M8 5.5c0-.9.7-.9.7-1.8S8 2.8 8 2" />
      <path d="M12 5.5c0-.9.7-.9.7-1.8S12 2.8 12 2" />
      <path d="M4 21h15" />
    </svg>
  `,
  food: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v8" />
      <path d="M4.5 3v6.2A2.5 2.5 0 0 0 7 11.7a2.5 2.5 0 0 0 2.5-2.5V3" />
      <path d="M7 11.7V21" />
      <path d="M16.5 3C19 5.1 20 7.7 20 11.2c0 2.1-1.3 3.7-3.2 4.2V21" />
      <path d="M16.5 3v18" />
    </svg>
  `,
  shop: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10h16l-1.4-5H5.4L4 10Z" />
      <path d="M6 10v9h12v-9" />
      <path d="M9 19v-5h6v5" />
      <path d="M4 10a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
    </svg>
  `,
} as const;

export type CategoryIconKey = keyof typeof CATEGORY_ICONS;
