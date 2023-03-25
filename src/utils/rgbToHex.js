/**
 * Convert RGB to Hex
 *
 * @param r - red
 * @param g - green
 * @param b - blue
 * @returns
 */
const rgbToHex = (r, g, b) => {
  const hex = [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");
  return "#" + hex;
};

export default rgbToHex;
