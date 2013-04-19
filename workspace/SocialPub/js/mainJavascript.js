/**
 * Created with JetBrains PhpStorm.
 * User: paschalis
 * Date: 4/11/13
 * Time: 2:05 AM
 * To change this template use File | Settings | File Templates.
 */

// Global variables
var DELAY_ALERT_ERROR = 4000;

/**
 * When the document is ready (fully loaded)
 */
$(document).ready(function () {

    //When register button is clicked
    $("#registerButton").click(function () {

        var registerData = checkRegisterForm();

        if (registerData == "") {
            //TODO Data are wrong. SHow notificaiton

            return false; //form didnt submitted
        }
        else {

            // Try to register user and return the success of failure value
            // success here mean that form data where correct and an attemp to
            // save them was made
            return registerUser(registerData);

        }


    });

    //When register button is clicked
    $("#loginButton").click(function () {

        var loginData = checkLoginForm();

        //Something went wrong
        if (loginData['code'] != 1) {

            showNotification(loginData, DELAY_ALERT_ERROR);
        }
        else {
            //Login user
            var formData = new Object();
            formData['username'] = loginData['username'];
            formData['password'] = loginData['password'];


            ajaxJsonRequest("scripts/login.php", formData, ajaxSuccessLogin, ajaxFailed);

        }
        return false;
    });


    //When notification is clicked
    $("#notification").click(function () {

        $(this).removeClass('in').addClass("out");

    });
});


/**Checks register form for possible errors
 * and returns forms data in JSon object
 * */
function checkLoginForm() {
    var username = $("#usernameLogin");

    var password = $("#passwordLogin");

    var msg = "";

    var result = new Object();

    // Check user and pass
    var m1 = checkUsername(username);
    var m2 = checkPassword(password);

    if (m1 != "" || m2 != "")
        msg = "Username or password cant be empty";

    if (msg != "") {

        result['code'] = 0;
        result['message'] = msg;

    }
    else {
        result['code'] = 1;
        result['username'] = username;
        result['password'] = password;
    }

    return result;
}


/**Checks register form for possible errors
 * and returns forms data in JSon object
 * */
function checkRegisterForm() {

    var username = $("#usernameForm");
    var password = $("#passwordForm");
    var confPassword = $("#confPasswordForm");
    var name = $("#nameForm");
    var surname = $("#surnameForm");
    var gender = $("#genderForm");
    var email = $("#emailForm");
    var country = $("#countryForm");

    // TODO PAMPOS IMPLEMENT THIS!
    // NA KAMES OLA TA LA8OS INPUT DATA KOKKINA!
    // GIREPSE EDW PROS TO TELOS TOU FORMS: http://twitter.github.io/bootstrap/base-css.html?#forms

    // Google search and implement:
    // update bootstrap form with wrong fields (eg turn red the outline of input boxes)

    var msg = "";
    var result = "";

    msg += checkUsername(username);
    msg += checkPasswords(password, confPassword);
    msg += checkName(name);
    msg += checkSurname(surname);
    msg += checkGender(gender);
    msg += checkCountry(country);
    msg += checkEmail(email);


//TODO KAME KAI TA IPOLOIPA ETSI!
    // alla3e to panw na pianei to element(an ine swsto)
    // kai kalese tes methodous! pou 8a valeis copy paste ta pramata tous mesa!

    if (!dataCorrect) {
        //TODO MAKE THIS notification
        alert("Input is wrong!\n" + msg);

        return "";
    }
    else {
        var result = new Object();

        result['username'] = username;
        result['password'] = password;
        result['confPassword'] = confPassword;
        result['name'] = name;
        result['surname'] = surname;
        result['gender'] = gender;
        result['email'] = email;
        result['country'] = country;

        return result;

    }


}


/**
 * Register user to database with asynchronous request
 *
 */
function registerUser(formData) {

    //TODO CHECK FORM DATA!


//    ajaxJsonRequest("register.php",)

    // Send data to server
    ajaxJsonRequest("scripts/register.php",
        formData,
        ajaxSuccessRegister(),
        ajaxFailed());

    return true; // form submitted

}


/**
 * Called when failed to contact register PHP script
 *
 */
function ajaxFailed() {

    var data = new Object();

    data['code'] = 0;
    data['message'] = "Something went wrong!";

    showNotification(data,DELAY_ALERT_ERROR);

}


/**
 * Called when successfully contact register PHP script.
 * That doesnt mean registration was successfull
 *
 */
function ajaxSuccessLogin(result) {

    //Show notification alert
    $("#notification").show(200);
    $("#notification").css({class: "alert-success"});
    //-success,-info,-waning, alla3e xrwma
    //TODO parse this json object and show results
    $("#notificationMessage").text('server: ' + result);

    //TODO if result <=0, then class = alert-error
}


/**
 * Called when successfully contact register PHP script.
 * That doesnt mean registration was successfull
 *
 */
function ajaxSuccessRegister(result) {

    //TODO USE SHOW  NOTIFICATION FUNCTION


    //Show notification alert
    $("#notification").show(200);
    $("#notification").css({class: "alert-success"});
    //-success,-info,-waning, alla3e xrwma
    //TODO parse this json object and show results
    $("#notificationMessage").text('server: ' + result);

    //TODO if result <=0, then class = alert-error
}


/*
 * Checks input fields and updates the UI
 *
 * */
function checkInputField(element) {

// Get elements id
    switch ($(element).attr("id")) {
        //Handle usernames
        case "usernameLogin":
            return checkUsername(element);
            break;
        case "usernameRegister":
            checkUsername(element);
            break;
        case "passwordLogin":
            checkPassword(element);
        case "passwordRegister":
            //TODO
            //checkPassword(element);
            //problem here
            break;
        case "nameRegister":
            checkName(element);
            break;
        case "surnameRegister":
            checkSurname(element);
            break;
        case "genderRegister":
            checkGender(element);
            break;
        case "countryRegister":
            checkCountry(element);
            break;
        case "emailRegister":
            checkEmail(element);
            break;
        //TODO OTHERS

    }


}


/*
 *
 * Checks if the username is correct
 * */
function checkUsername(username) {

    var value = $(username).val();
    var msg = "";


// Username is correct
    if (value != "" && value.length <= 30) {

        $(username).parent().removeClass('error');

    }
    // Username is wrong
    else {

        $(username).parent().removeClass('success').addClass("error");

        if (value.length > 30) {
            msg = "Username cant be more than 15 characters\n";
        }
        else {
            msg = "Username cant be empty\n";
        }
    }

    return msg;
}


/*
 * Checks if password or confirmation password is correct
 * */
function checkPassword(password) {

    var value = $(password).val();
    var msg = "";


// Username is correct
    if (value != "" && value.length <= 40) {

        $(password).parent().removeClass('error');

    }
    // Username is wrong
    else {

        $(password).parent().removeClass('success').addClass("error");

        if (value.length > 40) {
            msg = "Password cant be more than 40 characters\n";
        }
        else {
            msg = "Password cant be empty\n";
        }
    }

    return msg;
}


//TODO FIX THIS!

/**
 *
 *
 * */
function checkPasswords(password, confPassword) {


    var pass = $(password).val();
    var conf = $(confPassword).val();


    var msg = "";

    if (pass == "" || conf == "") {
        msg = "Please fill the Password and Password Confirmation fields\n";
    }
    else if (pass == conf) {
        $(password).parent().removeClass('error');
        $(confPassword).parent().removeClass('error').addClass("success");
    }
    // password and confirmPassword are not equal or their fields ar empty
    else {
        $(password).parent().removeClass('success').addClass("error");
        $(confPassword).parent().removeClass('success').addClass("error");


        msg = "Wrong password confirmation\n";

    }


    return msg;

}


/**
 *
 *
 * */
function checkName(name) {
    var value = $(name).val();
    var msg = "";

    if (value != "" && value.length <= 40) {
        $(name).parent().removeClass('error');
    }
    else {
        $(name).parent().removeClass('success').addClass("error");

        if (value == "") {
            msg = "First name field cant be empty\n";
        }
        else if (value.length > 40) {
            msg = "First name must be smaller than 40 characters\n";
        }
    }
    return msg;
}


/**
 *
 *
 * */
function checkSurname(surname) {
    var value = $(surname).val();
    var msg = "";

    if (value != "" && value.length <= 40) {
        $(surname).parent().removeClass('error');
    }
    else {
        $(surname).parent().removeClass('success').addClass("error");

        if (value == "") {
            msg = "Last name field cant be empty\n";
        }
        else if (value.length > 40) {
            msg = "Last name must be smaller than 40 characters\n";
        }
    }
    return msg;
}


/**
 *
 *
 * */
function checkGender(gender) {
    var value = $(gender).val();
    var msg = "";

    if (value == "m" || value == "f") {
        //TODO make gender red
        $(gender).parent().removeClass('error');

    }
    else {
        $(gender).parent().removeClass('success').addClass("error");
        msg = "Specify your gender \n";
    }

    return msg;

}


/**
 *
 *
 * */
function checkCountry(country) {
    var value = $(country).val();
    var msg = "";

    if (value != "" && value.length <= 40) {
        $(country).parent().removeClass('error');
    }
    else {

        if (value.length > 40) {
            msg = "Country length cant be more than 60 characters.\n";
        }
        else {
            msg = "Please choose your country.\n";
        }

        $(country).parent().removeClass('success').addClass("error");

    }
    return msg;
}


/**
 *
 *
 * */
function checkEmail(email) {
    var value = $(email).val();
    var msg = "";
    if (value != "" && isEmailCorrect(value)) {
        $(email).parent().removeClass('error');
    }
    else {
        $(email).parent().removeClass('success').addClass("error");
        if (value == "") {
            msg = "Please write your email address in the Email field\n";
        }
        else if (!isEmailCorrect(value)) {
            msg = "The email address is not valid\n";
        }
    }
    return msg;
}


/**
 *
 * Checks if an email address is correct
 */
function isEmailCorrect(email) {
    // Regexp
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    return (reg.test(email));
    //this copied from paschalis code OK
}


/*
 *   Show a notification alert according the object received
 *
 * */
function showNotification(data, duration) {

    var notification = $("#notification");

    //Show error message
    if (data['code'] == 0) {
        notification.removeClass('alert-success alert-info').addClass('alert-error');

    }
    //Show success message
    else if (data['code'] == 1) {
        notification.removeClass('alert-error alert-info').addClass('alert-success');
    }
    //Show info
    else if (data['code'] == 2) {
        notification.removeClass('alert-success alert-error').addClass('alert-info');
    }

    // Show success message
    notification.text(data['message']);

    //Show notification
    notification.removeClass('out').addClass("in");

    // Set notification timeout delay
    window.setTimeout(function(){
           notification.removeClass('in').addClass("out");
    },duration);

}


/*
 * Send AJAX request with json data, using
 * */
function ajaxJsonRequest(url, formData, successCallback, failCallback) {


    var jqxhr = $.post(url, formData)
        .done(function (data) {
            successCallback(data);

        })
        .fail(failCallback);
    // .always(); -- Not used


}