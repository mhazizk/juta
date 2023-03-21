// import rgbToHex from "./rgbToHex";

/**
 * Get color shades for chart
 *
 * @param totalColorToGenerate  - Total number of shades to generate
 * @param baseColorInHex - Base color in hex
 * @param opacity - Opacity of the color
 * @returns an object with `lighterColorShades` and `darkerColorShades`
 *
 * @example
 * const { lighterColorShades, darkerColorShades } = getColorShadesForChart(5, '#000000', 1);
 */
const getColorShadesForChart = (
  totalColorToGenerate = 1,
  baseColorInHex,
  opacity = 1
) => {
  const baseColorR = hexToRgb(baseColorInHex).r;
  const baseColorG = hexToRgb(baseColorInHex).g;
  const baseColorB = hexToRgb(baseColorInHex).b;

  const lighterColorShades = [];
  const darkerColorShades = [];

  for (let i = 0; i < totalColorToGenerate; i++) {
    const maxNumberFromBaseColor = Math.max(baseColorR, baseColorG, baseColorB);

    const x = i * 1;
    const step = 30;

    const rLight = baseColorR + x * step > 255 ? 255 : baseColorR + x * step;
    const gLight = baseColorG + x * step > 255 ? 255 : baseColorG + x * step;
    const bLight = baseColorB + x * step > 255 ? 255 : baseColorB + x * step;

    const rDark = baseColorR - x * step < 0 ? 0 : baseColorR - x * step;
    const gDark = baseColorG - x * step < 0 ? 0 : baseColorG - x * step;
    const bDark = baseColorB - x * step < 0 ? 0 : baseColorB - x * step;

    const lighterColor = rgbToHex(rLight, gLight, bLight);
    const darkerColor = rgbToHex(rDark, gDark, bDark);
    lighterColorShades.push(lighterColor);
    darkerColorShades.push(darkerColor);
  }

  console.log(JSON.stringify(lighterColorShades, null, 2));
  return {
    lighterColorShades,
    darkerColorShades,
  };
};

export default getColorShadesForChart;

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
