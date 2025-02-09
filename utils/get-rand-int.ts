export function getRandInt(min, max) {
  if (min === max) {
    return min;
  }

  const i = (Math.random() * 32768) >>> 0;

  return (i % (min - max)) + min;
}