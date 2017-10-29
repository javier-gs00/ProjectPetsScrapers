const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectiveId = Schema.ObjectiveId

let UserSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
})

let UserModel = mongoose.model('users', UserSchema)

function findAll (callback) {
    UserModel.find({}, function (err, user) {
        callback(err, user)
    })
}

function findByUsername (data, cb) {
    UserModel.findOne({ username: data }, function (err, user) {
        cb(err, user)
    })
}

function findByEmail (data, cb) {
    UserModel.findOne({ email: data }, function (err, user) {
        cb(err, user)
    })
}

function findById (id, cb) {
    UserModel.findById(id, function (err, user) {
        cb(err, user)
    })
}

function save (username, password, email, cb) {
    let newUser = new UserModel({
        username: username,
        password: password,
        email: email
    })

    newUser.save(function (err, newUser) {
        if (err) {
            console.log(err)
            return
        } else {
            cb(err, newUser)
        }
    })
}

function remove (id, callback) {
    UserModel.findById(id, function (err, user) {
        let removedName = (user.username)? user.username : 'NA'
        let removedEmail = (user.email)? user.email : 'NA'
        let removedId = id

        UserModel.remove({_id: id}, function (err, obj) {
            let removedUser = {
                username: removedName,
                email: removedEmail,
                id: removedId,
                count: obj.result.ok 
            }

            callback(err, removedUser)
        })
    })
    // UserModel.remove({ _id: id }, function (err, result) {
    //     callback(err, result)
    // })
}

module.exports = {
    findAll,
    findByUsername,
    findByEmail,
    findById,
    save,
    remove
}