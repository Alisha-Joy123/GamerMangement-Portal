const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: 'First name is required.'
    },
    lastName: {
        type: String,
        required: 'Last name is required.'
    },
    dateOfBirth: {
        type: String
    },
    userType: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: 'Password is required.'

    }
});


// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

mongoose.model('User', userSchema);