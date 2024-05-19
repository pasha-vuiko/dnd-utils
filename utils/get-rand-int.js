export function getRandInt(min, max) {
  const i = (Math.random() * 32768) >>> 0;
  return (i % (min - max)) + min;
}