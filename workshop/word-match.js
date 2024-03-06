import path from "node:path"
import fs from "node:fs/promises"
import allPass from "./all-pass.js"
import assert from "assert"

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const word5LetterPath = path.join(__dirname, "../resources", "words", "words_5_letter.txt")
const wordCompletePath = path.join(__dirname, "../resources", "words", "words_alpha.txt")

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
 * Excludes certain letters
 * @param {import("./all-pass").Predicate[]} filters
 * @returns {string[]}
 */
const findMatchingWords = async (filters) => {
    // would be good to extract the word traversal to a module of its own (visit each word, maybe expose as a Stream?)
    // in that case, we'd pass the word iterator as a param, also
    // also, would it be better to return a stream interface / async iterator
    const results = []
    
    const file = await fs.open(wordCompletePath)
    // console.log("file:", file)
    for await (const line of file.readLines()) {
        if (allPass(filters)(line)) {
            console.log(line);
            results.push(line)
        }
    }

    return results
}

/**
 * Generate a Predicate function to test if a string matches a simple pattern. Pattern can be letters or * symbols, as placeholders for individual letters.
 * 
 * Example:
 * pattern = "**art"
 * matches = eg "heart", "start"
 * 
 * @param {string} pattern
 * @returns {import("./all-pass").Predicate} 
 */
const patternMatch = (pattern) => {
    // const pattern = "h*art"
    // console.log("Matches for: " + pattern)
    const regexStr = "^" + pattern.replaceAll("*", "[a-z]") + "$"
    const regex = new RegExp(regexStr)

    return (val) => regex.test(val)
}

const testPatternMatch = () => {
    const vals = [
        "heart",
        "start",
        "apart",
        "heavy",
        "xheartx",
    ]

    const matches = vals.filter(patternMatch("**art"))
    assert.deepEqual(matches, ["heart", "start", "apart"])

    const matches2 = vals.filter(patternMatch("h*art"))
    assert.deepEqual(matches2, ["heart"])
    
    const matches3 = vals.filter(patternMatch("h****"))
    assert.deepEqual(matches3, ["heart", "heavy"])
    
    const matches4 = vals.filter(patternMatch("*****"))
    assert.deepEqual(matches4, [
        "heart",
        "start",
        "apart",
        "heavy",
    ])

    const matches5 = vals.filter(patternMatch("******"))
    assert.deepEqual(matches5, [])
    
    const matches6 = vals.filter(patternMatch("*******"))
    assert.deepEqual(matches6, [
        "xheartx",
    ])
}

testPatternMatch()

/**
 * Get a predicate to match words of a certain length
 * 
 * @param {number} length 
 * @returns {import("./all-pass.js").Predicate}
 */
const isLength = (length) => (val) => val?.length === length

/**
 * Get a predicate to decide if a word contains a given set of letters.
 * @param {string|string[]} letters Either a string containing the letters, or an array of letters. ie, "aabc" and ["a", "a", "b", "c"] are acceptable. 
 *                                  Order doesn't matter. Repeats are considered (ie to filter words that have 2 or more of a given letter).
 * @returns {import("./all-pass.js").Predicate}
 */
const containsLetters = (letters) => {
    // not sure if this can be done in 1 single regex.
    const letterArray = Array.isArray(letters) ? letters : letters?.split("")
    if (!letterArray) {
        throw new Error("Error: Need to provide a string or array of letters")
    }

    const letterCount = letterArray.reduce((accum, cur) => {
        if (accum[cur]) {
            accum[cur]++
        } else {
            accum[cur] = 1
        }

        return accum
    }, {})

    const regexList = Object.entries(letterCount).map(([letter, count]) => {
        // regex to say "n or more occurrences of this letter" ("count" is "n"), don't have to be consecutive
        // return new RegExp(letter + "{" + count + ",}")
        return new RegExp(
            new Array(count).fill(letter).join(".*")
        )
    })

    return (val) => {
        return regexList.every(regex => regex.test(val))
    }
}

const testContainsLetters = () => {
    assert.equal(containsLetters("act")("act"), true)
    assert.equal(containsLetters("act")("cat"), true)
    assert.equal(containsLetters("act")("tac"), true)
    assert.equal(containsLetters("act")("atc"), true)
    assert.equal(containsLetters("act")("cta"), true)
    assert.equal(containsLetters("act")("cathy"), true)
    assert.equal(containsLetters("act")("call"), false)
    assert.equal(containsLetters("lh")("hello"), true)
    assert.equal(containsLetters("lhl")("hello"), true)
    assert.equal(containsLetters("llh")("hello"), true)
    assert.equal(containsLetters("hll")("hello"), true)
    assert.equal(containsLetters("hhl")("hello"), false)
    assert.equal(containsLetters("ana")("catan"), true)
    assert.equal(containsLetters("aa")("catan"), true)
    assert.equal(containsLetters("aa")("katana"), true)
    assert.equal(containsLetters("aaa")("katana"), true)
}
testContainsLetters()

const findMyPattern = async () => {
    const pattern = "**art"
    await findMatchingWords([
        isLength(7),
        // patternMatch(pattern),
        containsLetters("lnou")
    ])

    // could also do findMatchingWords([isLength(5)])
}

findMyPattern()