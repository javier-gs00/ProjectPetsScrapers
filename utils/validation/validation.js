const validator = require('validator')

module.exports.check = {
    length: function (input, min, max, errmsg) {
        if (validator.isLength(input, { min: min, max: max }) == false) {
            return errmsg
        } else {
            return ''
        }
    },

    alpha: function (input, language, errmsg) {
        if (validator.isAlpha(input, [language]) == false) {
            return errmsg
        } else {
            return ''
        }
    },

    match: function (input, regex, errmsg) {
        if (validator.matches(input, regex, "i") == false) {
            return errmsg
        } else {
            return ''
        }
    },

    equal: function (input1, input2, errmsg) {
        if (input1 !== input2) {
            return errmsg
        } else {
            return ''
        }
    },

    email: function (input, errmsg) {
        if (validator.isEmail(input) == false) {
            return errmsg
        } else {
            return ''
        }
    },

    normalizeEmail: function (input) {
        if (validator.normalizeEmail(input) == false) {
            return input
        } else {
            return validator.normalizeEmail(input)
        }
    },

    url: function (input, errmsg) {
        if (validator.isURL(input) == false) {
            return errmsg
        } else {
            return ''
        }
    },

    numeric: function (input, errmsg) {
        if (validator.isNumeric(input) == false) {
            return errmsg
        } else {
            return ''
        }
    }
}