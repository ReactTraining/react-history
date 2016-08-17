export const createKey = (length) =>
  Math.random().toString(36).substr(2, length)
