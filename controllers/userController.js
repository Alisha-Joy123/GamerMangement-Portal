const express = require('express');
var router = express.Router();
const monogose = require('mongoose');
const User = monogose.model('User');
let loggedInUser = {}
let host = false;
let gamer = false;
let admin = false;


router.get('/', (req, res) => {
    res.render("user/login", {
        ErrorMessage: "",
        layout: 'layout'
    });
});


router.get('/signup', (req, res) => {
    res.render("user/registration", {
        viewTitle: "User SignUp Form",
        layout: 'layout'
    });
});

router.get('/welcome', (req, res) => {
    ShowMenu(res, loggedInUser, "user/Welcome")
});

router.get('/userList', (req, res) => {
    console.log("userList")
    User.find((err, docs) => {
        if (!err) {
            res.render("user/UserList", {
                users: docs,
                host : host,
                gamer : gamer,
                admin : admin
            });
            console.log(docs);
        }
        else {
            console.log('Error in retrieving Users list :' + err);
        }
    });
});

router.get('/AddUser', (req, res) => {
    res.render("user/AddEditUser", {
        viewTitle: "Add User",
        buttonName: "Save",
        host : host,
        gamer : gamer,
        admin : admin
    });
});

router.get('/accessRequest', (req, res) => {
    User.find((err, docs) => {
        if (!err) {
            res.render("user/AccessRequest", {
                users: docs,
                host : host,
                gamer : gamer,
                admin : admin
            });
            console.log(docs);
        }
        else {
            console.log('Error in retrieving Users list :' + err);
        }
    });
});

router.get('/viewUser', (req, res) => {
    let UserType;
    let active;
    let approved;
    let decline;
    let request;

    if(loggedInUser.userType=="Host"){
        UserType="Elevated Access User"
    }
    else if(loggedInUser.userType=="Admin"){
        UserType="Administrator"
    }
    else if(loggedInUser.userType=="Gamer"){
        UserType="Regular User"
    }
    if(loggedInUser.requestStatus == "Active"){
        active=true;
        approved=false;
        decline=false;
        request = false;
    }
    else if(loggedInUser.requestStatus == "Approved"){
        active=false;
        approved=true;
        decline=false;
        request = false;
    }
    else if(loggedInUser.requestStatus == "Declined")
    {
        active=false;
        approved=false;
        decline=false;
        request = false;
        
    }
    else
    {
        active=false;
        approved=false;
        decline=false;
        request = true;
    }
    res.render("user/ViewUser", {
        user: loggedInUser,
        viewTitle: "User Profile",
        host : host,
        userType : UserType,
        gamer : gamer,
        admin : admin,
        Active : active,
        Approved : approved,
        Decline : decline,
        Request : request
        
    });
    
});

router.get('/:id', (req, res) => {
    
    User.findById(req.params.id, (err, doc) => {
        if (!err) {
            let UserType;
            if(doc.userType=="Host"){
                UserType="Elevated Access User"
            }
            else if(doc.userType=="Admin"){
                UserType="Administrator"
            }
            else if(doc.userType=="Gamer"){
                UserType="Regular User"
            }
            res.render("user/AddEditUser", {
                user: doc,
                buttonName: "Update",
                viewTitle: "Edit User",
                host : host,
                userType : UserType,
                gamer : gamer,
                admin : admin
               
            });
        }
    });
});

router.post("/", (req, res) => {
    validateUser(req, res);
});


router.post('/Edit',(req,res)=>{
    User.findById(loggedInUser._id, (err, doc) => {
        if (!err) {
            res.render("user/ AddEditUser", {
                user: doc,
                viewTitle: "Edit User",
                host : host,
                gamer : gamer,
                admin : admin
               
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

router.post('/SearchUserList',(req,res)=>
{
    if (req.body.department != "All")
        
    {
        User.findOne({ department: req.body.department}, (err, docs) => {
            if (!err) {
                res.render("user/UserList", {
                    users: docs,
                    host : host,
                    gamer : gamer,
                    admin : admin
                });
                console.log(docs);
            }
            else {
                console.log('Error in retrieving Users list :' + err);
            }
        });
    }
    else
    {
        User.find((err, docs) => {
            if (!err) {
                res.render("user/UserList", {
                    users: docs,
                    host : host,
                    gamer : gamer,
                    admin : admin
                });
                console.log(docs);
            }
            else {
                console.log('Error in retrieving Users list :' + err);
            }
        });
    }
});
router.post('/SearchAccesRequestList',(req,res)=>
{
    console.log("searchin "+ req.body.department);
    if (req.body.department != "All")
        
    {
        User.findOne({ department: req.body.department}, (err, docs) => {
            if (!err) {
                res.render("user/AccessRequest", {
                    users: docs,
                    host : host,
                    gamer : gamer,
                    admin : admin
                });
                console.log(docs);
            }
            else {
                console.log('Error in retrieving Users list :' + err);
            }
        });
    }
    else
    {
        User.find((err, docs) => {
            if (!err) {
                res.render("user/AccessRequest", {
                    users: docs,
                    host : host,
                    gamer : gamer,
                    admin : admin
                });
                console.log(docs);
            }
            else {
                console.log('Error in retrieving Users list :' + err);
            }
        });
    }
});

router.post('/approve',(req,res)=>
{
    console.log("Entered");
    User.findOne({ _id: req.body._id }, (err, docs) => {
        if (!err) 
        {
            if(req.body.request == "Approved")
            {
                docs.requestStatus = "Approved";
                docs.userType = "Host" ;
            }
            else if(req.body.request == "Declined")
            {
                docs.requestStatus = "Declined";
            } 
          User.findOneAndUpdate({ _id: req.body._id }, docs , { new: true }, (err, doc) => {
            if (!err) 
            { 
                res.redirect('/AccessRequest'); 
            }
        }); 
        }
        
        else {
            console.log('Error in retrieving user data :' + err);
        }
    });
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
    let UserType;
    if(req.body.userType=="Elevated Access User"){
        req.body.userType="Host"
    }
    else if(req.body.userType=="Administrator"){
        req.body.userType="Admin"
    }
    else if(loggedInUser.userType=="Regular User"){
        req.body.userType="Gamer"
    }
    User.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/UserList'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.redirect("/UserList", {
                    viewTitle: title,
                    user: req.body,
                    host : host,
                    gamer : gamer,
                    admin : admin
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}
function InsertNewUser(req,res,title){
    let UserType;
    if(req.body.userType=="Elevated Access User"){
        UserType="Host"
    }
    else if(req.body.userType=="Administrator"){
        UserType="Admin"
    }
    else if(loggedInUser.userType=="Regular User"){
        UserType="Gamer"
    }
    var user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.dateOfBirth = req.body.dateOfBirth;
    user.userType = UserType;
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

function ShowMenu(res, docs, url) {
    if (docs.userType == "Admin") {
        admin=true;
        gamer=false;
        host=false;
        res.render(url, {
            user: docs,
            userName: "Administrator",
            host : host,
            gamer : gamer,
            admin : admin
        });
    }
    else if (docs.userType == "Host") {
        host=true;
        admin=false;
        gamer=false;
        res.render(url, {
            user: docs,
            userName: "Elevated Access User",
            host : host,
            gamer : gamer,
            admin : admin
            
        });
    }
    else if (docs.userType == "Gamer") {
        gamer=true;
        host=false;
        admin=false;
        res.render(url, {
            user: docs,
            userName: "Regular Access User",
            host : host,
            gamer : gamer,
            admin : admin
        });
    }

}

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
                    user: req.body,
                    layout: 'layout'
                });
            }
        }
        else {
            console.log('Error in retrieving user data :' + err);
        }
    });
}
module.exports = router;

