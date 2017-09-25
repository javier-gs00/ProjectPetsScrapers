// const { sanitize } = require('express-validator/filter')

module.exports = function (){
    sanitizeBody('username').trim()
}