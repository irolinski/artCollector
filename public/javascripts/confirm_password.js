const password = document.getElementById("register_password");
const confirm_password = document.getElementById("confirm_password");

function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match!");
  } else {
    confirm_password.setCustomValidity('');
  }

  if(password.value.length <= 6 || password.value.length >= 12) {
    password.setCustomValidity("Password needs to be between 6 and 12 characters long!");
    confirm_password.setCustomValidity("Password needs to be between 6 and 12 characters long!");
  } else {
    password.setCustomValidity('');
  }

}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;



