const app = require('./app')

let server = app.listen(3000, function () {
    console.log('Server listening on port 3000')
})