// Helper function to generate a barcode pattern as an SVG data URL
export const generateBarcodePattern = () => {
  const bars = [];
  const totalWidth = 100; // SVG width
  const height = 30; // SVG height
  const numBars = 40; // Number of bars to generate
  const barWidth = totalWidth / (numBars * 1.5); // Calculate width to fill the space

  for (let i = 0; i < numBars; i++) {
    const x = i * (totalWidth / numBars);
    // Vary the width slightly but ensure we fill the space
    const width = Math.random() > 0.6 ? barWidth * 1.2 : barWidth * 0.8;

    bars.push(
      `<rect x="${x}" y="0" width="${width}" height="${height}" fill="black" />`,
    );
  }

  return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}">${bars.join(
    "",
  )}</svg>`;
};
