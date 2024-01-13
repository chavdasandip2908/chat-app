const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide your Full Name']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "Email can't be blank"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8
    },
    token: {
        type: String
    }
})
const Users = mongoose.model('User', userSchema);

module.exports = Users;