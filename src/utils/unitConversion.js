// Conversion factor: 1 US fluid ounce = 29.5735 milliliters
const ML_TO_OZ = 29.5735;

/**
 * Converts milliliters to ounces
 * @param {number} ml - Value in milliliters
 * @returns {number} Value in ounces, rounded to 1 decimal place
 */
export function mlToOz(ml) {
  if (!Number.isFinite(ml) || ml < 0) return 0;
  return Math.round((ml / ML_TO_OZ) * 10) / 10;
}

/**
 * Converts ounces to milliliters
 * @param {number} oz - Value in ounces
 * @returns {number} Value in milliliters, rounded to nearest integer
 */
export function ozToMl(oz) {
  if (!Number.isFinite(oz) || oz < 0) return 0;
  return Math.round(oz * ML_TO_OZ);
}

/**
 * Formats a quantity value with the appropriate unit label
 * @param {number} value - The numeric value
 * @param {string} unit - Either 'ml' or 'oz'
 * @returns {string} Formatted string with unit
 */
export function formatQuantity(value, unit) {
  if (unit === 'oz') {
    return `${value} oz`;
  }
  return `${value} ml`;
}

