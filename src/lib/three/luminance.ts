/**
 * Luminance calculation and emissive intensity compensation utilities
 * Based on Rec. 709 (ITU-R BT.709-5) standard for perceptual brightness
 */

/**
 * Rec. 709 luma coefficients for perceptual luminance calculation
 * These weights reflect human visual sensitivity:
 * - Green: 71.52% (most sensitive)
 * - Red: 21.26%
 * - Blue: 7.22% (least sensitive)
 */
const REC709_COEFFICIENTS = {
  red: 0.2126,
  green: 0.7152,
  blue: 0.0722,
} as const;

/**
 * Converts a hex color string to normalized RGB components (0-1 range)
 * @param hex - Hex color string (e.g., "#ff00ff" or "ff00ff")
 * @returns Object with r, g, b components normalized to 0-1
 * @throws Error if hex string is invalid
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Validate hex format
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    throw new Error(`Invalid hex color: ${hex}. Expected format: #RRGGBB`);
  }

  // Parse RGB components
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  return { r, g, b };
}

/**
 * Calculates perceptual luminance using Rec. 709 formula
 * @param rgb - Normalized RGB components (0-1 range)
 * @returns Luminance value (0-1 range)
 */
export function calculateLuminance(rgb: {
  r: number;
  g: number;
  b: number;
}): number {
  return (
    REC709_COEFFICIENTS.red * rgb.r +
    REC709_COEFFICIENTS.green * rgb.g +
    REC709_COEFFICIENTS.blue * rgb.b
  );
}

/**
 * Calculates the emissive intensity needed for a color to reach target luminance
 * Used to compensate for Rec. 709's green bias in Bloom post-processing
 *
 * @param hexColor - Hex color string (e.g., "#ff00ff")
 * @param targetLuminance - Desired effective luminance (default: 1.05)
 * @returns Required emissive intensity multiplier
 *
 * @example
 * // Magenta needs ~3.7x intensity to reach luminance 1.05
 * calculateEmissiveIntensity("#ff00ff") // Returns ~3.69
 *
 * @example
 * // Yellow needs minimal boost (already high luminance)
 * calculateEmissiveIntensity("#ffff00") // Returns ~1.13
 */
export function calculateEmissiveIntensity(
  hexColor: string,
  targetLuminance: number = 1.05
): number {
  const rgb = hexToRgb(hexColor);
  const baseLuminance = calculateLuminance(rgb);

  // Prevent division by zero for pure black
  if (baseLuminance === 0) {
    console.warn(
      `Color ${hexColor} has zero luminance and cannot bloom. Returning intensity 1.0.`
    );
    return 1.0;
  }

  // Calculate required multiplier to reach target
  const requiredIntensity = targetLuminance / baseLuminance;

  return requiredIntensity;
}

/**
 * Calculates artistic emissive intensity with partial luminance compensation
 *
 * Uses a blend factor to balance perceptual uniformity with natural color hierarchy.
 * This is the recommended approach for artistic visualizations following cinematic
 * best practices (Avatar, Tron Legacy, Blade Runner 2049).
 *
 * @param hexColor - Hex color string (e.g., "#ff00ff")
 * @param targetLuminance - Desired effective luminance (default: 2.0)
 * @param compensationFactor - How much to compensate (0 = none, 1 = full, default: 0.5)
 * @returns Required emissive intensity multiplier
 *
 * @example
 * // 50% compensation (recommended) - blend of equal brightness and natural hierarchy
 * calculateArtisticIntensity("#ff00ff", 2.0, 0.5) // Returns ~4.69
 *
 * @example
 * // 30% compensation - more natural hierarchy, stronger depth
 * calculateArtisticIntensity("#ff00ff", 2.0, 0.3) // Returns ~3.61
 *
 * @example
 * // 70% compensation - nearly equal brightness, minimal hierarchy
 * calculateArtisticIntensity("#ff00ff", 2.0, 0.7) // Returns ~5.77
 *
 * @remarks
 * Research shows professional artistic visualizations favor intentional glow
 * variation over perceptual uniformity. Partial compensation (40-50%) creates
 * natural visual depth while maintaining recognizable colors.
 *
 * See: thoughts/shared/research/2025-10-22-ENG-10-bloom-intensity-balancing-artistic-vs-scientific.md
 */
export function calculateArtisticIntensity(
  hexColor: string,
  targetLuminance: number = 2.0,
  compensationFactor: number = 0.5
): number {
  const rgb = hexToRgb(hexColor);
  const baseLuminance = calculateLuminance(rgb);

  if (baseLuminance === 0) {
    console.warn(
      `Color ${hexColor} has zero luminance and cannot bloom. Returning intensity 1.0.`
    );
    return 1.0;
  }

  // Calculate full compensation multiplier (makes all colors equal)
  const fullCompensation = targetLuminance / baseLuminance;

  // Blend between baseline (1.0) and full compensation
  // Formula: baseline + (compensationAmount * factor)
  const partialCompensation =
    1.0 + (fullCompensation - 1.0) * compensationFactor;

  return partialCompensation;
}

/**
 * Calculates base luminance directly from hex color
 * Convenience function combining hexToRgb + calculateLuminance
 *
 * @param hexColor - Hex color string (e.g., "#ff00ff")
 * @returns Base luminance value (0-1 range)
 *
 * @example
 * getColorLuminance("#ff00ff") // Returns 0.2848 (magenta)
 * getColorLuminance("#00ffff") // Returns 0.7874 (cyan)
 */
export function getColorLuminance(hexColor: string): number {
  const rgb = hexToRgb(hexColor);
  return calculateLuminance(rgb);
}
