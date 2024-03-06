import assert from "node:assert"

/**
 * @typedef {Function} Predicate
 * @param {string} val
 * @returns {boolean}
 */

/**
 * Ensures a value passes a list of predicates.
 * 
 * @param {Predicate[]} filters Array of predicate functions 
 * @returns {Predicate}
 */
export const allPass = (filters) => (val) => {
    return filters.every((filter) => !!filter(val))
}

const testAllPass = () => {
    const greaterThan100 = val => val > 100
    const isOdd = val => val % 2
    // console.log("All pass for 123?", allPass(greaterThan100, isOdd)(123))
    // console.log("All pass for 245?", allPass(greaterThan100, isOdd)(245))
    // console.log("All pass for 124?", allPass(greaterThan100, isOdd)(124))
    // console.log("All pass for 99?", allPass(greaterThan100, isOdd)(99))
    // console.log("All pass for 98?", allPass(greaterThan100, isOdd)(98))
    
    assert.equal(allPass([greaterThan100, isOdd])(123), true)
    assert.equal(allPass([greaterThan100, isOdd])(245), true)
    assert.equal(allPass([greaterThan100, isOdd])(124), false)
    assert.equal(allPass([greaterThan100, isOdd])(99), false)
    assert.equal(allPass([greaterThan100, isOdd])(98), false)
} 

testAllPass()

export default allPass
