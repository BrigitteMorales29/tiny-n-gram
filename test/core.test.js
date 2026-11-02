import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateNGrams,
  generateCharacterNGrams,
  generateWordNGrams,
} from '../src/core.js';

test('generateNGrams produces overlapping windows', () => {
  const tokens = ['a', 'b', 'c', 'd'];
  assert.deepEqual(generateNGrams(tokens, 2), [
    ['a', 'b'],
    ['b', 'c'],
    ['c', 'd'],
  ]);
});

test('generateNGrams returns empty array when n exceeds token count', () => {
  assert.deepEqual(generateNGrams(['a', 'b'], 3), []);
});

test('generateNGrams returns empty array for empty input', () => {
  assert.deepEqual(generateNGrams([], 1), []);
});

test('generateNGrams rejects non-positive n', () => {
  assert.throws(() => generateNGrams(['a'], 0), RangeError);
  assert.throws(() => generateNGrams(['a'], -1), RangeError);
});

test('generateNGrams rejects non-integer n', () => {
  assert.throws(() => generateNGrams(['a'], 1.5), RangeError);
  assert.throws(() => generateNGrams(['a'], NaN), RangeError);
});

test('generateNGrams rejects non-array tokens', () => {
  assert.throws(() => generateNGrams('abc', 2), TypeError);
});

test('generateCharacterNGrams splits a string into overlapping substrings', () => {
  assert.deepEqual(generateCharacterNGrams('abcd', 2), ['ab', 'bc', 'cd']);
});

test('generateCharacterNGrams handles n equal to length', () => {
  assert.deepEqual(generateCharacterNGrams('abc', 3), ['abc']);
});

test('generateCharacterNGrams returns empty array when n exceeds length', () => {
  assert.deepEqual(generateCharacterNGrams('abc', 4), []);
});

test('generateCharacterNGrams handles empty string', () => {
  assert.deepEqual(generateCharacterNGrams('', 1), []);
});

test('generateCharacterNGrams rejects non-string input', () => {
  assert.throws(() => generateCharacterNGrams(123, 2), TypeError);
});

test('generateWordNGrams splits on whitespace and produces windows', () => {
  assert.deepEqual(generateWordNGrams('one two three', 2), [
    ['one', 'two'],
    ['two', 'three'],
  ]);
});

test('generateWordNGrams collapses multiple spaces and trims', () => {
  assert.deepEqual(generateWordNGrams('  one   two\tthree  ', 2), [
    ['one', 'two'],
    ['two', 'three'],
  ]);
});

test('generateWordNGrams returns empty array for whitespace-only input', () => {
  assert.deepEqual(generateWordNGrams('   \t\n  ', 1), []);
});

test('generateWordNGrams returns empty array when n exceeds word count', () => {
  assert.deepEqual(generateWordNGrams('one two', 3), []);
});

test('generateWordNGrams rejects non-string input', () => {
  assert.throws(() => generateWordNGrams(null, 2), TypeError);
});
