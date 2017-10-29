const user = require('../../../utils/dbmodels/user.js')

module.exports = function (req, res) {
    user.remove(req.params.id, function (err, removedUser) {
        if (err) {
            console.error(err)
            res.render('user_editar', {
                errors: [{msg: 'Ha ocurrido un error'}]
            })
        } else {
            console.log('DB DELETE User id: ' + removedUser.id + ' - username: ' + removedUser.username + ' - email: ' + removedUser.email)
            res.redirect('/admin/usuarios/')
        }
    })
}