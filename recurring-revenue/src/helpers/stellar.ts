export const truncateString = (str: string) =>
  str ? `${str.slice(0, 4)}…${str.slice(-4)}` : "";
