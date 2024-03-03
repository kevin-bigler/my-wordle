// maybe use micromatch instead (glob pattern matching):
// https://github.com/micromatch/micromatch
// console.log(micromatch(['foo', 'bar', 'baz', 'qux'], ['f*', 'b*'])) //=> ['foo', 'bar', 'baz']
// console.log(micromatch(['foo', 'bar', 'baz', 'qux'], ['*', '!b*'])) //=> ['foo', 'qux']

// console.log(micromatch.isMatch('foo', 'f*')) //=> true
// console.log(micromatch.isMatch('foo', ['b*', 'f*'])) //=> true


/**
 * Let's get something like
 * abc*e
 * matching anything starting with "abc" and ending with "e," with any one char in between
 * 
 * Pattern (abc*e)
 * Length (n letters long)
 * Contains certain letters (not positional) - somehow even multiples? eg, word contains 2 A's, 1 S, 1 D (not just ASD)
 */