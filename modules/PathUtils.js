export const stripPrefix = (prefix, string) =>
  string.indexOf(prefix) === 0 ? string.substring(prefix.length) : string
