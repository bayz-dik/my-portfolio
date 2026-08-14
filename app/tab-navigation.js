export function getNextTabIndex(key, currentIndex, total) {
  if (!Number.isInteger(total) || total <= 0 || currentIndex < 0 || currentIndex >= total) return null;
  if (key === "ArrowRight") return (currentIndex + 1) % total;
  if (key === "ArrowLeft") return (currentIndex - 1 + total) % total;
  if (key === "Home") return 0;
  if (key === "End") return total - 1;
  return null;
}
