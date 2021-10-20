export const getRandom = (max: number, min = 0) =>
  Math.floor(Math.random() * max) + min;
