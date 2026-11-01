// The LCD is monochrome, so tracks are told apart on screen by line style.
// Track colors only appear off-screen: deck LEDs and segment-key stripes.
const TRACK_DASHES = [undefined, '8 4', '2 4', '12 4 3 4'] as const;

export const trackDash = (row: number) => TRACK_DASHES[row % TRACK_DASHES.length];

export const trackColor = (row: number) => `var(--color-track-${(row % 4) + 1})`;
