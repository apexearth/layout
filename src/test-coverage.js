const {expect} = require('chai')

module.exports = {
    coverage,
    field
}

function coverage(suite, obj, ignores) {
    if (typeof suite !== 'object') throw new Error('suite is required')
    if (typeof obj === 'undefined') throw new Error('obj cannot be undefined')
    ignores = ignores || []
    ignores = ignores.concat(Object.getOwnPropertyNames(Object.prototype))
    if (typeof obj === 'function') {
        obj(start)
    } else {
        start(obj)
    }

    function start(object) {
        check(object, Object.getOwnPropertyNames(object.constructor.prototype))
        check(object, Object.keys(object))
    }

    function check(object, keys) {
        for (let key of keys.filter(key => !key.startsWith('_'))) {
            if (ignores.indexOf(key) >= 0) continue
            if (typeof object[key] === 'function') {
                if (!hasTest(suite, `.${key}()`)) {
                    it(`.${key}()`)
                }
            } else if (!hasTest(suite, `.${key}`)) {
                it(`.${key}`)
            }
        }
    }
}

function hasTest(suite, name) {
    let expectedTestName = name
    for (let key in suite.suites) {
        if (suite.suites.hasOwnProperty(key)
            && (
                suite.suites[key].title === expectedTestName ||
                hasTest(suite.suites[key], name)
            )) {
            return true
        }
    }
    for (let key in suite.tests) {
        if (suite.tests.hasOwnProperty(key) && suite.tests[key].title === expectedTestName) {
            return true
        }
    }
    return false
}

function field(object, name, value) {
    it(`.${name}`, () => {
        if (value) {
            if (typeof value === 'object')
                expect(object[name]).to.deep.equal(value)
            else {
                expect(object[name]).to.equal(value)
            }
        } else {
            expect(object[name]).to.exist
        }
    })
}