/** Brand marks used by the footer and the quiz share buttons. */

type IconProps = { size?: number };

export function XIcon({ size = 15 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2.5h3.3l-7.2 8.2 8.4 11.1h-6.6l-5.2-6.8-5.9 6.8H2.4l7.7-8.8L2 2.5h6.8l4.7 6.2 5.4-6.2Zm-1.2 17.4h1.8L7.4 4.3H5.5l12.2 15.6Z" />
    </svg>
  );
}

export function LinkedInIcon({ size = 15 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.4 21.5h5.2V9.2H2.4v12.3Zm7.6 0h5.2v-6.7c0-1.8.3-3.5 2.5-3.5s2.2 2 2.2 3.6v6.6h5.2v-7.6c0-4.4-2.4-6.5-5.5-6.5-2.5 0-3.6 1.4-4.3 2.4h-.1V9.2H10v12.3Z" />
    </svg>
  );
}

export function GitHubIcon({ size = 15 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 22.29 24 17.8 24 12.5 24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}
