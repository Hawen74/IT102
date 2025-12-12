const { add, difference, products, quotient } = require('./math');

describe('Arithmetic Functions', () => {
  describe('add', () => {
    test('adds two positive numbers', () => {
      expect(add(5, 3)).toBe(8);
    });

    test('adds negative numbers', () => {
      expect(add(-5, -3)).toBe(-8);
    });

    test('adds positive and negative numbers', () => {
      expect(add(10, -4)).toBe(6);
    });

    test('adds zero', () => {
      expect(add(5, 0)).toBe(5);
    });

    test('adds two zeros', () => {
      expect(add(0, 0)).toBe(0);
    });
  });

  describe('difference', () => {
    test('subtracts two positive numbers', () => {
      expect(difference(10, 4)).toBe(6);
    });

    test('subtracts resulting in negative number', () => {
      expect(difference(5, 10)).toBe(-5);
    });

    test('subtracts negative numbers', () => {
      expect(difference(-10, -4)).toBe(-6);
    });

    test('subtracts zero', () => {
      expect(difference(5, 0)).toBe(5);
    });
  });

  describe('products', () => {
    test('multiplies two positive numbers', () => {
      expect(products(6, 7)).toBe(42);
    });

    test('multiplies negative numbers', () => {
      expect(products(-5, -3)).toBe(15);
    });

    test('multiplies positive and negative numbers', () => {
      expect(products(5, -3)).toBe(-15);
    });

    test('multiplies by zero', () => {
      expect(products(5, 0)).toBe(0);
    });

    test('multiplies by one', () => {
      expect(products(5, 1)).toBe(5);
    });
  });

  describe('quotient', () => {
    test('divides two positive numbers', () => {
      expect(quotient(20, 5)).toBe(4);
    });

    test('divides resulting in decimal', () => {
      expect(quotient(10, 4)).toBe(2.5);
    });

    test('divides by negative number', () => {
      expect(quotient(10, -2)).toBe(-5);
    });

    test('divides by zero returns error message', () => {
      expect(quotient(10, 0)).toBe('Error: Division by zero');
    });

    test('divides zero by non-zero number', () => {
      expect(quotient(0, 5)).toBe(0);
    });

    test('divides negative by negative', () => {
      expect(quotient(-10, -2)).toBe(5);
    });
  });
});
