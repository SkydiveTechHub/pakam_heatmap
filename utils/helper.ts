// Generates n distinct colors using HSL
export function generateColors(count: number): string[] {
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const hue = Math.floor((360 / count) * i); // Spread colors around the color wheel
    const saturation = 70; // You can tweak these for more pastel/vivid
    const lightness = 50;

    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
}



