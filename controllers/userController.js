const express = require('express');
var router = express.Router();
const monogose= require('mongoose');
const User = monogose.model('User');
router.get('/signup',(req,res)=> {
    res.render("user/registration",{
        viewTitle : "User SignUp Form"

    });
});

router.post("/signup",(req,res)=> {
    insertRecord(req,res);
});

function insertRecord(req,res){
    var user= new User();
    user.firstName= req.body.firstName;
    user.lastName= req.body.lastName;
    user.dateOfBirth=req.body.dateOfBirth;
    user.userType="Gamer";
    user.password=req.body.password;
    user.email=req.body.email;
        user.save((err,doc)=>{
            if(!err)
            res.redirect('/');
            else{
                if (err.name == 'ValidationError') {
                    handleValidationError(err, req.body);
                    res.render("user/registration", {
                        user: req.body
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

router.get('/',(req,res)=>{
    res.render("user/login", {
        ErrorMessage: ""
    });
});
router.post("/",(req,res)=> {
    validateUser(req,res);
});
 function validateUser(req,res){
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    const data = User.findOne({email:username},(err, docs) => {
        if (!err) {
            console.log(docs);
            if(docs.password == password)
            {
                if(docs.userType == "Admin")
                res.send("Welcome Admin");
                else if(docs.userType == "Host")
                res.send("Welcome Host");
                else if(docs.userType == "Gamer")
                res.send("Welcome Gamer");
            }
            else
            {
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

