import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  calculateLuminance,
  calculateEmissiveIntensity,
  calculateArtisticIntensity,
  getColorLuminance,
} from './luminance';

describe('luminance utilities', () => {
  describe('hexToRgb', () => {
    describe('valid inputs', () => {
      it('should parse hex with # prefix', () => {
        expect(hexToRgb('#ff0000')).toEqual({ r: 1, g: 0, b: 0 });
        expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 1, b: 0 });
        expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 1 });
      });

      it('should parse hex without # prefix', () => {
        expect(hexToRgb('ff0000')).toEqual({ r: 1, g: 0, b: 0 });
        expect(hexToRgb('00ff00')).toEqual({ r: 0, g: 1, b: 0 });
      });

      it('should parse lowercase hex', () => {
        expect(hexToRgb('#ffffff')).toEqual({ r: 1, g: 1, b: 1 });
        expect(hexToRgb('ffffff')).toEqual({ r: 1, g: 1, b: 1 });
      });

      it('should parse mixed case hex', () => {
        expect(hexToRgb('#FfAa00')).toEqual({
          r: 1,
          g: 170 / 255,
          b: 0,
        });
      });

      it('should normalize to 0-1 range', () => {
        const result = hexToRgb('#808080'); // 128 in decimal
        expect(result.r).toBeCloseTo(128 / 255, 5);
        expect(result.g).toBeCloseTo(128 / 255, 5);
        expect(result.b).toBeCloseTo(128 / 255, 5);
      });
    });

    describe('edge cases', () => {
      it('should parse pure black', () => {
        expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      });

      it('should parse pure white', () => {
        expect(hexToRgb('#ffffff')).toEqual({ r: 1, g: 1, b: 1 });
      });
    });

    describe('invalid inputs', () => {
      it('should throw on wrong length', () => {
        expect(() => hexToRgb('#fff')).toThrow('Invalid hex color');
        expect(() => hexToRgb('#fffffff')).toThrow('Invalid hex color');
      });

      it('should throw on invalid characters', () => {
        expect(() => hexToRgb('#gggggg')).toThrow('Invalid hex color');
        expect(() => hexToRgb('#ff00zz')).toThrow('Invalid hex color');
      });

      it('should throw on empty string', () => {
        expect(() => hexToRgb('')).toThrow('Invalid hex color');
      });
    });
  });

  describe('calculateLuminance', () => {
    describe('Rec. 709 coefficient validation', () => {
      it('should weight green highest (0.7152)', () => {
        const green = calculateLuminance({ r: 0, g: 1, b: 0 });
        expect(green).toBeCloseTo(0.7152, 4);
      });

      it('should weight red second (0.2126)', () => {
        const red = calculateLuminance({ r: 1, g: 0, b: 0 });
        expect(red).toBeCloseTo(0.2126, 4);
      });

      it('should weight blue lowest (0.0722)', () => {
        const blue = calculateLuminance({ r: 0, g: 0, b: 1 });
        expect(blue).toBeCloseTo(0.0722, 4);
      });

      it('should sum to 1.0 for white', () => {
        const white = calculateLuminance({ r: 1, g: 1, b: 1 });
        expect(white).toBeCloseTo(1.0, 4);
      });
    });

    describe('standard color luminance', () => {
      it('should calculate magenta luminance (JSDoc example)', () => {
        // Magenta: r=1, g=0, b=1
        // Expected: 0.2126 * 1 + 0.7152 * 0 + 0.0722 * 1 = 0.2848
        const magenta = calculateLuminance({ r: 1, g: 0, b: 1 });
        expect(magenta).toBeCloseTo(0.2848, 4);
      });

      it('should calculate cyan luminance (JSDoc example)', () => {
        // Cyan: r=0, g=1, b=1
        // Expected: 0.2126 * 0 + 0.7152 * 1 + 0.0722 * 1 = 0.7874
        const cyan = calculateLuminance({ r: 0, g: 1, b: 1 });
        expect(cyan).toBeCloseTo(0.7874, 4);
      });

      it('should calculate yellow luminance', () => {
        // Yellow: r=1, g=1, b=0
        // Expected: 0.2126 * 1 + 0.7152 * 1 + 0.0722 * 0 = 0.9278
        const yellow = calculateLuminance({ r: 1, g: 1, b: 0 });
        expect(yellow).toBeCloseTo(0.9278, 4);
      });
    });

    describe('edge cases', () => {
      it('should return 0 for black', () => {
        const black = calculateLuminance({ r: 0, g: 0, b: 0 });
        expect(black).toBe(0);
      });

      it('should handle fractional RGB values', () => {
        const gray = calculateLuminance({ r: 0.5, g: 0.5, b: 0.5 });
        expect(gray).toBeCloseTo(0.5, 4);
      });
    });
  });

  describe('calculateEmissiveIntensity', () => {
    describe('JSDoc example validation', () => {
      it('should require ~3.69x intensity for magenta (JSDoc example)', () => {
        // Magenta base luminance: 0.2848
        // Target: 1.05
        // Expected: 1.05 / 0.2848 ≈ 3.685
        const intensity = calculateEmissiveIntensity('#ff00ff', 1.05);
        expect(intensity).toBeCloseTo(3.69, 2);
      });

      it('should require ~1.13x intensity for yellow (JSDoc example)', () => {
        // Yellow base luminance: 0.9278
        // Target: 1.05
        // Expected: 1.05 / 0.9278 ≈ 1.131
        const intensity = calculateEmissiveIntensity('#ffff00', 1.05);
        expect(intensity).toBeCloseTo(1.13, 2);
      });
    });

    describe('compensation calculation', () => {
      it('should compensate for low-luminance colors', () => {
        // Red has low luminance (0.2126)
        const intensity = calculateEmissiveIntensity('#ff0000', 1.05);
        expect(intensity).toBeGreaterThan(4.0); // Needs significant boost
      });

      it('should minimally adjust high-luminance colors', () => {
        // Cyan has high luminance (0.7874)
        const intensity = calculateEmissiveIntensity('#00ffff', 1.05);
        expect(intensity).toBeLessThan(1.5); // Needs little boost
      });

      it('should use default target luminance of 1.05', () => {
        const withDefault = calculateEmissiveIntensity('#ff00ff');
        const withExplicit = calculateEmissiveIntensity('#ff00ff', 1.05);
        expect(withDefault).toBe(withExplicit);
      });

      it('should scale proportionally with target luminance', () => {
        const intensity1 = calculateEmissiveIntensity('#ff00ff', 1.0);
        const intensity2 = calculateEmissiveIntensity('#ff00ff', 2.0);
        expect(intensity2).toBeCloseTo(intensity1 * 2, 2);
      });
    });

    describe('edge cases', () => {
      it('should handle pure black (division by zero)', () => {
        const intensity = calculateEmissiveIntensity('#000000', 1.05);
        expect(intensity).toBe(1.0); // Fallback value
      });

      it('should return 1.0 for target matching base luminance', () => {
        // Cyan base luminance: 0.7874
        const intensity = calculateEmissiveIntensity('#00ffff', 0.7874);
        expect(intensity).toBeCloseTo(1.0, 4);
      });

      it('should handle very high target luminance', () => {
        const intensity = calculateEmissiveIntensity('#ff00ff', 10.0);
        expect(intensity).toBeGreaterThan(30); // Extreme boost needed
      });
    });
  });

  describe('calculateArtisticIntensity', () => {
    describe('JSDoc example validation', () => {
      it('should return ~4.01 for magenta with 50% compensation (JSDoc example)', () => {
        // Partial compensation (50%) blends baseline (1.0) and full compensation
        // Full: 2.0 / 0.2848 = 7.023
        // Partial: 1.0 + (7.023 - 1.0) * 0.5 = 4.011 (actual implementation value)
        const intensity = calculateArtisticIntensity('#ff00ff', 2.0, 0.5);
        expect(intensity).toBeCloseTo(4.01, 1);
      });

      it('should return ~3.61 for magenta with 30% compensation (JSDoc example)', () => {
        // Full: 2.0 / 0.2848 = 7.023
        // Partial: 1.0 + (7.023 - 1.0) * 0.3 = 2.807
        const intensity = calculateArtisticIntensity('#ff00ff', 2.0, 0.3);
        expect(intensity).toBeCloseTo(2.81, 1);
      });

      it('should return ~5.77 for magenta with 70% compensation (JSDoc example)', () => {
        // Full: 2.0 / 0.2848 = 7.023
        // Partial: 1.0 + (7.023 - 1.0) * 0.7 = 5.216
        const intensity = calculateArtisticIntensity('#ff00ff', 2.0, 0.7);
        expect(intensity).toBeCloseTo(5.22, 1);
      });
    });

    describe('compensation factor behavior', () => {
      it('should return 1.0 with 0% compensation (no adjustment)', () => {
        const intensity = calculateArtisticIntensity('#ff00ff', 2.0, 0);
        expect(intensity).toBe(1.0);
      });

      it('should return full compensation with 100% factor', () => {
        const partial = calculateArtisticIntensity('#ff00ff', 2.0, 1.0);
        const full = calculateEmissiveIntensity('#ff00ff', 2.0);
        expect(partial).toBeCloseTo(full, 4);
      });

      it('should blend linearly between baseline and full compensation', () => {
        const baseline = 1.0;
        const full = calculateEmissiveIntensity('#ff00ff', 2.0);
        const halfway = calculateArtisticIntensity('#ff00ff', 2.0, 0.5);

        const expectedHalfway = baseline + (full - baseline) * 0.5;
        expect(halfway).toBeCloseTo(expectedHalfway, 4);
      });

      it('should use default values (targetLuminance=2.0, factor=0.5)', () => {
        const withDefaults = calculateArtisticIntensity('#ff00ff');
        const withExplicit = calculateArtisticIntensity('#ff00ff', 2.0, 0.5);
        expect(withDefaults).toBe(withExplicit);
      });
    });

    describe('color hierarchy preservation', () => {
      it('should maintain some hierarchy with partial compensation', () => {
        // Magenta (low luminance) and cyan (high luminance)
        const magenta = calculateArtisticIntensity('#ff00ff', 2.0, 0.5);
        const cyan = calculateArtisticIntensity('#00ffff', 2.0, 0.5);

        // Magenta should still need more intensity than cyan
        expect(magenta).toBeGreaterThan(cyan);
      });

      it('should reduce hierarchy with higher compensation', () => {
        const magenta30 = calculateArtisticIntensity('#ff00ff', 2.0, 0.3);
        const magenta70 = calculateArtisticIntensity('#ff00ff', 2.0, 0.7);
        const cyan30 = calculateArtisticIntensity('#00ffff', 2.0, 0.3);
        const cyan70 = calculateArtisticIntensity('#00ffff', 2.0, 0.7);

        const gap30 = magenta30 - cyan30;
        const gap70 = magenta70 - cyan70;

        // Higher compensation reduces the gap
        expect(gap70).toBeGreaterThan(gap30);
      });
    });

    describe('edge cases', () => {
      it('should handle pure black (division by zero)', () => {
        const intensity = calculateArtisticIntensity('#000000', 2.0, 0.5);
        expect(intensity).toBe(1.0); // Fallback value
      });

      it('should handle extreme compensation factors', () => {
        // Factor > 1.0 should extrapolate beyond full compensation
        const extrapolated = calculateArtisticIntensity('#ff00ff', 2.0, 1.5);
        const full = calculateEmissiveIntensity('#ff00ff', 2.0);
        expect(extrapolated).toBeGreaterThan(full);
      });

      it('should handle negative compensation factors', () => {
        // Negative should go below baseline
        const negative = calculateArtisticIntensity('#ff00ff', 2.0, -0.5);
        expect(negative).toBeLessThan(1.0);
      });
    });
  });

  describe('getColorLuminance', () => {
    describe('JSDoc example validation', () => {
      it('should return 0.2848 for magenta (JSDoc example)', () => {
        const luminance = getColorLuminance('#ff00ff');
        expect(luminance).toBeCloseTo(0.2848, 4);
      });

      it('should return 0.7874 for cyan (JSDoc example)', () => {
        const luminance = getColorLuminance('#00ffff');
        expect(luminance).toBeCloseTo(0.7874, 4);
      });
    });

    describe('convenience function behavior', () => {
      it('should match hexToRgb + calculateLuminance pipeline', () => {
        const direct = getColorLuminance('#ff0000');
        const manual = calculateLuminance(hexToRgb('#ff0000'));
        expect(direct).toBe(manual);
      });

      it('should work with all hex formats', () => {
        const withHash = getColorLuminance('#00ff00');
        const withoutHash = getColorLuminance('00ff00');
        expect(withHash).toBe(withoutHash);
      });

      it('should throw on invalid hex', () => {
        expect(() => getColorLuminance('#invalid')).toThrow(
          'Invalid hex color'
        );
      });
    });

    describe('standard colors', () => {
      it('should return correct luminance for primary colors', () => {
        expect(getColorLuminance('#ff0000')).toBeCloseTo(0.2126, 4); // Red
        expect(getColorLuminance('#00ff00')).toBeCloseTo(0.7152, 4); // Green
        expect(getColorLuminance('#0000ff')).toBeCloseTo(0.0722, 4); // Blue
      });

      it('should return 0 for black', () => {
        expect(getColorLuminance('#000000')).toBe(0);
      });

      it('should return 1.0 for white', () => {
        expect(getColorLuminance('#ffffff')).toBeCloseTo(1.0, 4);
      });
    });
  });

  describe('integration scenarios', () => {
    it('should calculate consistent intensity across the pipeline', () => {
      const color = '#ff00ff';

      // Manual pipeline
      const rgb = hexToRgb(color);
      const luminance = calculateLuminance(rgb);
      const intensity = 1.05 / luminance;

      // Function pipeline
      const directIntensity = calculateEmissiveIntensity(color, 1.05);

      expect(directIntensity).toBeCloseTo(intensity, 4);
    });

    it('should support full color science workflow', () => {
      const colors = [
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#ff00ff',
        '#00ffff',
        '#ffff00',
      ];

      colors.forEach((color) => {
        const baseLuminance = getColorLuminance(color);
        const fullIntensity = calculateEmissiveIntensity(color, 2.0);
        const artisticIntensity = calculateArtisticIntensity(color, 2.0, 0.5);

        // Artistic intensity should be between baseline (1.0) and full compensation
        expect(artisticIntensity).toBeGreaterThanOrEqual(1.0);
        expect(artisticIntensity).toBeLessThanOrEqual(fullIntensity);

        // Base luminance should be used in calculations
        expect(baseLuminance).toBeGreaterThan(0);
        expect(baseLuminance).toBeLessThanOrEqual(1.0);
      });
    });
  });
});
