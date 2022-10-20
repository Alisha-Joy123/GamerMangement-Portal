var captcha;
var validPassword;
function generate() {
 
    // Clear old input
    document.getElementById("captchaCode").value = "";
 
    // Access the element to store
    // the generated captcha
    captcha = document.getElementById("image");
    var uniquechar = "";
 
    const randomchar =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
    // Generate captcha for length of
    // 5 with random character
    for (let i = 1; i < 5; i++) {
        uniquechar += randomchar.charAt(
            Math.random() * randomchar.length)
    }
 
    // Store generated input
    captcha.innerHTML = uniquechar;
}
function printmsg() {
    const usr_input = document
        .getElementById("captchaCode").value;
     
    // Check whether the input is equal
    // to generated captcha or not
    if (usr_input != captcha.innerHTML) {
        alert("Captcha doesn't matched");
        document.getElementById("Create").style.cursor="not-allowed";
        generate();
    }
    else{
        document.getElementById("Create").style.cursor="pointer";
    }
   
    }
    function matchPassword() {  
        const pw1 = document.getElementById("pwd").value;  
        const pw2 = document.getElementById("cpwd").value;  
        console.log(pw1.value +"   "+ pw2);
        if(pw1 != pw2)  
        {   
            document.getElementById("cpwd").style.borderBlockColor="red";
          alert("Passwords did not match");  
          document.getElementById("Create").style.cursor="not-allowed";
          document.getElementById("confirmPasswordError").innerHTML="Passwords did not matched";
        }
        else
        {
            document.getElementById("cpwd").style.borderColor="white";
            document.getElementById("Create").style.cursor="pointer";
            document.getElementById("confirmPasswordError").innerHTML="";
        }
      }  