# tiny-n-gram

Extracts overlapping character or word sequences of a specified length from text.

```js
import {
  generateNGrams,
  generateCharacterNGrams,
  generateWordNGrams,
} from './src/index.js';

// From an array of tokens:
generateNGrams(['a', 'b', 'c', 'd'], 2);
// => [['a', 'b'], ['b', 'c'], ['c', 'd']]

// Character n-grams from a string:
generateCharacterNGrams('abcd', 2);
// => ['ab', 'bc', 'cd']

// Word n-grams from a string:
generateWordNGrams('one two three', 2);
// => [['one', 'two'], ['two', 'three']]
```

## Why this exists

N-gram extraction is a common preprocessing step for text modelling and
comparison. Many implementations bundle normalisation, stop-word removal, or
Unicode segmentation, which makes them hard to reason about and easy to get
subtly wrong. This library does one thing: it produces overlapping windows of
a requested length. Normalisation is left to the caller.

The trade-off is that it is not clever. It does not fold case, strip
punctuation, or combine surrogate pairs. If you need those behaviours, preprocess
the input into an array of tokens and call `generateNGrams` directly.

## Awkward edge

`generateCharacterNGrams` operates on UTF-16 code units, not Unicode grapheme
clusters. A character outside the Basic Multilingual Plane (for example an
emoji) counts as two units. To treat such characters as single tokens, split
the string into code points or graphemes first and pass the resulting array to
`generateNGrams`.

## API

- `generateNGrams(tokens, n)` — takes an array of strings and returns an array
  of n-length arrays. Throws `RangeError` if `n` is not a positive integer and
  `TypeError` if `tokens` is not an array.
- `generateCharacterNGrams(text, n)` — takes a string and returns an array of
  n-length strings. Throws `RangeError` if `n` is not a positive integer and
  `TypeError` if `text` is not a string.
- `generateWordNGrams(text, n)` — splits the string on runs of whitespace and
  returns an array of n-length arrays of words. Throws `RangeError` if `n` is
  not a positive integer and `TypeError` if `text` is not a string.

In all cases, if `n` is larger than the number of tokens, the result is an
empty array.

## Performance

The window keeps a bounded buffer, so `push` is constant time and memory does not
grow with the length of the stream. `peak` and `trough` are linear in the window
size, which is the trade that keeps `push` cheap.

