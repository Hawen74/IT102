/**
 * Adds two numbers together.
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The sum of a and b
 */
const add = (a, b) => a + b;

/**
 * Subtracts the second number from the first number.
 * @param {number} a - The minuend (number to subtract from)
 * @param {number} b - The subtrahend (number to subtract)
 * @returns {number} The difference of a and b
 */
const difference = (a, b) => a - b;

/**
 * Multiplies two numbers together.
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The product of a and b
 */
const products = (a, b) => a * b;

/**
 * Divides the first number by the second number.
 * @param {number} a - The dividend (number to be divided)
 * @param {number} b - The divisor (number to divide by)
 * @returns {number|string} The quotient of a and b, or an error message if b is zero
 */
const quotient = (a, b) => b !== 0 ? a / b : 'Error: Division by zero';

module.exports = { add, difference, products, quotient };
