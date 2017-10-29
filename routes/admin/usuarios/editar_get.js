const user = require('../../../utils/dbmodels/user.js')

module.exports = function (req, res) {
    user.findById(req.params.id, function (err, user) {
        res.render('user_editar', {
            user: user
        })
    })
}