let username = document.getElementById("username-register");

function validateUsername() {
  if (username.value.length < 4 || username.value.length >= 12) {
    username.setCustomValidity(
      "Username needs to be longer than 4 characters (and shorter than 12)"
    );
  } else {
    username.setCustomValidity("");
  }
}

username.onchange = validateUsername;
