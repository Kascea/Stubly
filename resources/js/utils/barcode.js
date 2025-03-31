// Helper function to generate a barcode pattern as an SVG data URL
export const generateBarcodePattern = () => {
  const bars = [];
  const totalWidth = 100; // SVG width
  const height = 30; // SVG height
  let currentX = 0;
  const numBars = 30; // Approximate number of bars

  for (let i = 0; i < numBars; i++) {
    // Ensure we don't exceed the total width
    if (currentX >= totalWidth) break;

    // Random width, biased towards thin bars
    const width = Math.random() > 0.7 ? 3 : 1;
    const barWidth = Math.min(width, totalWidth - currentX); // Prevent exceeding bounds

    bars.push(
      `<rect x="${currentX}" y="0" width="${barWidth}" height="${height}" fill="black" />`,
    );
    currentX += barWidth + (Math.random() > 0.5 ? 1 : 0); // Add a small random gap sometimes
  }

  return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}">${bars.join(
    "",
  )}</svg>`;
};
