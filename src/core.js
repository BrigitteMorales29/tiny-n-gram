/**
 * N-gram generation utilities.
 *
 * Design decision: n-grams are produced as arrays of tokens (strings).
 * Character n-grams operate on the raw string without normalisation;
 * word n-grams split on runs of whitespace. This keeps the library small
 * and predictable: callers who need case-folding or punctuation stripping
 * can preprocess the input themselves.
 *
 * Edge case: when n is larger than the number of tokens, the result is an
 * empty array. When n is zero or negative, a RangeError is thrown.
 */

/**
 * Generate overlapping n-grams from an array of tokens.
 *
 * @param {string[]} tokens - The sequence to slice into n-grams.
 * @param {number} n - The length of each n-gram. Must be a positive integer.
 * @returns {string[][]} An array of n-grams, each an array of n tokens.
 * @throws {RangeError} If n is not a positive integer.
 */
export function generateNGrams(tokens, n) {
  if (!Number.isInteger(n) || n <= 0) {
    throw new RangeError('n must be a positive integer');
  }
  if (!Array.isArray(tokens)) {
    throw new TypeError('tokens must be an array');
  }
  const result = [];
  for (let i = 0; i + n <= tokens.length; i++) {
    result.push(tokens.slice(i, i + n));
  }
  return result;
}

/**
 * Generate overlapping character n-grams from a string.
 *
 * The string is treated as a sequence of UTF-16 code units; surrogate pairs
 * are not combined. This matches JavaScript's native string indexing and is
 * the simplest consistent behaviour. For Unicode-aware grapheme handling,
 * preprocess the string into an array of code points or graphemes and use
 * generateNGrams directly.
 *
 * @param {string} text - The input text.
 * @param {number} n - The length of each n-gram. Must be a positive integer.
 * @returns {string[]} An array of character n-grams.
 * @throws {RangeError} If n is not a positive integer.
 */
export function generateCharacterNGrams(text, n) {
  if (typeof text !== 'string') {
    throw new TypeError('text must be a string');
  }
  const chars = Array.from(text);
  return generateNGrams(chars, n).map((gram) => gram.join(''));
}

/**
 * Generate overlapping word n-grams from a string.
 *
 * Words are defined as maximal runs of non-whitespace characters. Whitespace
 * is stripped and not part of any n-gram. Empty input or input that is only
 * whitespace yields an empty array.
 *
 * @param {string} text - The input text.
 * @param {number} n - The length of each n-gram. Must be a positive integer.
 * @returns {string[][]} An array of word n-grams, each an array of n words.
 * @throws {RangeError} If n is not a positive integer.
 */
export function generateWordNGrams(text, n) {
  if (typeof text !== 'string') {
    throw new TypeError('text must be a string');
  }
  const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
  return generateNGrams(words, n);
}
