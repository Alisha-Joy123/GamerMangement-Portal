const express = require('express');
var router = express.Router();
const monogose = require('mongoose');
const User = monogose.model('User');
let loggedInUser = {}

router.get('/signup', (req, res) => {
    res.render("user/registration", {
        viewTitle: "User SignUp Form",
        layout: 'layout'
    });
});

router.get('/welcome', (req, res) => {
    console.log("reached;;;;;;");
    ShowMenu(res, loggedInUser, "user/Welcome")
});
router.get('/userList', (req, res) => {
    console.log("userList")
    User.find((err, docs) => {
        if (!err) {
            res.render("user/UserList", {
                users: docs
            });
            console.log(docs);
        }
        else {
            console.log('Error in retrieving Users list :' + err);
        }
    });
});

router.get('/AddUser', (req, res) => {
    res.render("user/ AddEditUser", {
        viewTitle: "Add User",
        showSaveButton: "",
        showCancelButton: "",
        showEditButton: "hidden",
    });
});
router.get('/accessRequest', (req, res) => {
    User.find((err, docs) => {
        if (!err) {
            res.render("user/AccessRequest", {
                users: docs
            });
            console.log(docs);
        }
        else {
            console.log('Error in retrieving Users list :' + err);
        }
    });
});

router.get('/viewUser', (req, res) => {
   
            res.render("user/ViewUser", {
                user: loggedInUser,
                viewTitle: "User Profile",
                showSaveButton: "hidden",
                showCancelButton: "hidden",
                showEditButton: "",
               
            });
});

router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("user/ AddEditUser", {
                user: doc,
                viewTitle: "Edit User",
                showSaveButton: "hidden",
                showCancelButton: "hidden",
                showEditButton: "",
               
            });
        }
    });
});

router.post('/AddEditUser',(req,res)=>
{
    if (req.body._id == '')
    InsertNewUser(req, res);
    else
    UpdateUser(req,res,"Edit User");
});

router.post('/RequestAccess',(req,res)=>
{
    User.findOne({ _id: req.body._id }, (err, docs) => {
        if (!err) 
        {
            console.log(docs);
          docs.requestStatus = "Active";
          User.findOneAndUpdate({ _id: req.body._id }, docs , { new: true }, (err, doc) => {
            if (!err) 
            { 
                res.redirect('/Welcome'); 
            }
        }); 
        }
        
        else {
            console.log('Error in retrieving user data :' + err);
        }
    });
});

router.post("/signup", (req, res) => {
    insertRecord(req, res);
});

function UpdateUser(req,res,user,title){
    
    User.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/Welcome'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("/UserList", {
                    viewTitle: title,
                    user: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}
function InsertNewUser(req,res,title){
    var user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.dateOfBirth = req.body.dateOfBirth;
    user.userType = req.body.AccessType;
    user.password = req.body.password;
    user.email = req.body.email;
    user.phoneNumber = req.body.phoneNumber;
    user.address = req.body.address;
    user.department = req.body.department;
    user.save((err, doc) => {
        if (!err)
            res.redirect('/UserList');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("user/registration", {
                    user: req.body,
                    layout:'layout'
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });

}

function insertRecord(req, res) {
    var user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.dateOfBirth = req.body.dateOfBirth;
    user.userType = "Gamer";
    user.password = req.body.password;
    user.email = req.body.email;
    user.save((err, doc) => {
        if (!err)
            res.redirect('/');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("user/registration", {
                    user: req.body,
                    layout:'layout'
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });

    console.log(user);
}
function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'firstName':
                body['firstNameError'] = err.errors[field].message;
                break;
            case 'lastName':
                body['lastNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/', (req, res) => {
    res.render("user/login", {
        ErrorMessage: "",
        layout: 'layout'
    });
});


function ShowMenu(res, docs, url) {
    console.log(docs)
    if (docs.userType == "Admin") {
        res.render(url, {
            user: docs,
            userName: "Administrator",
            showMyProfile: "",
            showUsers: "",
            showAccessRequest: ""
        });
    }
    else if (docs.userType == "Host") {
        res.render(url, {
            user: docs,
            userName: "Elevated Access User",
            showMyProfile: "",
            showUsers: "",
            showAccessRequest: "hidden"
        });
    }
    else if (docs.userType == "Gamer") {
        res.render(url, {
            user: docs,
            userName: "Regular Access User",
            showMyProfile: "",
            showUsers: "hidden",
            showAccessRequest: "hidden"
        });
    }

}
router.post("/", (req, res) => {
    validateUser(req, res);
});
function validateUser(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    const data = User.findOne({ email: username }, (err, docs) => {
        if (!err) {
            console.log(docs);
            if (docs.password == password) {
                loggedInUser = docs;
                ShowMenu(res, docs, "user/Welcome")
            }
            else {
                res.render("user/login", {
                    ErrorMessage: "Oops! Invalid Credentials",
                    user: req.body
                });
            }
        }
        else {
            console.log('Error in retrieving user data :' + err);
        }
    });
}
module.exports = router;

