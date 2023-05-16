let imageArray = [];

function validate() {
  alertData = "";
  
  if (verifyPhone() == 0 || verifyPhone() == 1) {
    // The message "Invalid phone number" will be generated if an invalid phone number is provided
    alertData += "Invalid phone number\n";
  }

  if (verifyCondition() == 1) {
    // If no condition is provided, your program must generate the error message "No conditions selected"
    alertData += "No conditions selected\n";
  }

  if (verifyCondition() == 2) {
    // If the user selects any condition and also "None", your program will generate the error message "Invalid conditions selection"
    alertData += "Invalid conditions selection\n";
  }

  if (!verifyTime()) {
    //Your program will generate the message "No time period selected" if none has been selected
    alertData += "No time period selected\n";
  }

  if (verifyStudyID() == 0) {
    //Valid ids have the following format A### B### where # is a digit.
    //Your program will generate the message "Invalid study id" if an invalid id is provided
    alertData += "Invalid study id\n";
  }
  if (verifyStudyID() == 1) {
    //Valid ids have the following format A### B### where # is a digit.
    //Your program will generate the message "Invalid study id" if an invalid id is provided
    alertData += "Invalid study id\n";
  }
  if (verifyStudyID() == 2) {
    //Valid ids have the following format A### B### where # is a digit.
    //Your program will generate the message "Invalid study id" if an invalid id is provided
    alertData += "Invalid study id\n";
  }

  // if valid form
  if (alertData == "") {
    console.log('sending alert');
    // If the data is correct, a confirmation message ("Do you want to submit the form data?") will be displayed asking for a submission confirmation
    return confirm("Do you want to submit the form data?");
  }
  // if not valid form
  else {
    // If after evaluating the data any errors are found, your program will not submit the form and 
    // - will display a single message (using alert) where the fields with invalid data are identified
    alert(alertData);
    return false;
  }
}

function verifyPhone() {
  let phone1 = Number(document.querySelector("#phone1").value);
  let phone2 = Number(document.querySelector("#phone2").value);
  let phone3 = Number(document.querySelector("#phone3").value);

  // check that all inputs are numbers
  if (isNaN(phone1) || isNaN(phone2) || isNaN(phone3)) {
    return 0;
  }

  // check phone inputs are valid lengths
  if (
    phone1.toString().length != 3 ||
    phone2.toString().length != 3 ||
    phone3.toString().length != 4
  ) {
    return 1;
  }
}

function verifyCondition() {
  let bp = document.querySelector("#highBP").checked;
  let dia = document.querySelector("#diabetes").checked;
  let gla = document.querySelector("#glaucoma").checked;
  let ast = document.querySelector("#asthma").checked;
  let noneBox = document.querySelector("#none").checked;

  let anyOther = bp || dia || gla || ast;

  // if no condition selected
  if (!noneBox && (!anyOther)) {
    return 1;
  }

  // if "None" and any condition selected
  if (noneBox && (anyOther)) {
    return 2;
  }

  // valid
  return 0;

}

function verifyTime() {
  // return false if all options are blank
  let radio1 = document.querySelector("#radio1").checked;
  let radio2 = document.querySelector("#radio2").checked;
  let radio3 = document.querySelector("#radio3").checked;
  let radio4 = document.querySelector("#radio4").checked;

  // if any of them are checked, valid
  if (radio1 || radio2 || radio3 || radio4) {
    return true;
  }
  // none checked is not valid
  return false;
}

function verifyStudyID() {
  let id1 = document.querySelector("#idFirst").value;
  let id2 = document.querySelector("#idSecond").value;

  // check lengths of inputs
  if (id1.toString().length != 4 || id2.toString().length != 4) {
    return 0;
  }

  // check first letters of input
  let id1Letter = id1[0];
  let id2Letter = id2[0];
  
  if (id1Letter != "A" || id2Letter != "B") {
    return 1;
  }

  // check the remaining input to be numbers
  let id1Rest = Number(id1.slice(1));
  let id2Rest = Number(id2.slice(1));

  if (isNaN(id1Rest) || isNaN(id2Rest)) {
    return 2;
  }

}