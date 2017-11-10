const passport = require('passport')
const formidable = require('formidable')

module.exports = function (req, res, next) {
    // let form = new formidable.IncomingForm()
    // form.type = 'urlencoded'

    // form.parse(req, function (err, fields, files) {
    //     console.log(fields)

    //     passport.authenticate('local', function(err, user, info) {
    //         console.log(user)
    //         if (err) { return next(err); }
    //         if (!user) { return res.redirect('/usuarios/login'); }
    //         req.logIn(user, function(err) {
    //             if (err) { return next(err); }
    //             return res.redirect('/admin');
    //         });
    //     })(req, res, next);
    // })

    passport.authenticate('local', function(err, user, info) {
        console.log(user)
        if (err) { return next(err); }

        if (!user) {
            let errors = [{msg:'Nombre de usuario o contraseña equivocada'}]
            return res.render('user_login', {
                errors: errors
            });
        }

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/admin');
        });
    })(req, res, next);
}