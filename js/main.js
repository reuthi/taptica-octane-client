'use strict';

var interests = '';


//***MULTISELECTION DROPDOWN***//
$('#langOpt').multiselect({
    columns: 1,
    placeholder: 'Please check your genre/interests',
});


$( document ).ready(function() {


    $.get("http://localhost:8080/interests", {}, function (data) {
        // ****** rendering the options from the server ******* //

        interests = data;
        var interestsToRender = [];

            for (var i = 0; i < interests.length; i++) {
                var interestToRender = {
                                            name   : interests[i].Name,
                                            value  : interests[i].Name-interests[i].ID,
                                            checked: false,
                                        }
                interestsToRender.push(interestToRender) 
            }
    
        $('select[multiple]').multiselect( 'loadOptions', interestsToRender);
    });
});



//** SIGN IN BUTTON**//
function submit() {

    var isUserConnectedSocialMedia = false;

    $.get("http://localhost:8080/userConnected",{},function(data) {
        // console.log(data)

        if (data) isUserConnectedSocialMedia = true;
        var id = '';
        var name = $('#name');
        var phone = $('#phone');
        var email = $('#email');
        var pass = $('#password');
        var passConfirmation = $('#passwordConfirmation');
        var country = $('#country');
        var state = $('#state');
        var interestsCheckbox = createCheckboxArr();
        var termsCheckbox = $('.termsCheckbox');
        var istermsCheckbox = isChecked(termsCheckbox)


        if (validate(name, phone, email, pass, passConfirmation, country, istermsCheckbox, isUserConnectedSocialMedia)) {
            
                var data = {
                    id: '',
                    name: name.val(),
                    phone: phone.val(),
                    email: email.val(),
                    pass: pass.val(),
                    country: country.val(),
                    state: state.val(),
                    interests: interestsCheckbox
                }        
                ////// POST to node.js:
                $.post("http://localhost:8080/signin",{user: JSON.stringify(data)}, function(data){
                        console.log("login success");
                        doWhenFinish(name, phone, email, pass, passConfirmation, country, state, termsCheckbox)
                });

        }
        // else console.log('validation failed')
    })
}

 function doWhenFinish(name, phone, email, pass, passConfirmation, country, state, termsCheckbox) {
    $('.loginSuccefullContainer').css("visibility", "visible")        
    name.val('');
    phone.val('');
    email.val('');
    pass.val('');
    passConfirmation.val('');
    country.val('');
    state.val('');
    (termsCheckbox).prop('checked', false);
    
    var selectedElements = $(".selected label input");

    for (var i = 0; i < selectedElements.length; i++) {
        $(selectedElements[i]).prop('checked', false);   
    }
}

// Form validation code will come here.
function validate(name, phone, email, pass, passConfirmation, country, termsCheckbox, isUserConnectedSocialMedia) {

    var isValid = true;

    if( name.val() === '' ) {
        $(name).css("border-color", "black")
        $('.nameValidation').css("visibility", "visible")
        isValid = false;
    }

    if( name.val() !== '' ) {
        $(name).css("border-color", "white")
        $('.nameValidation').css("visibility", "hidden")
        isValid = true;
    }

    if( phone.val() === '' ) {
        $(phone).css("border-color", "black")
        $('.phoneValidation').css("visibility", "visible")
        isValid = false;
    }

    if( phone.val() !== '' ) {
        $(phone).css("border-color", "white")
        $('.phoneValidation').css("visibility", "hidden")
        isValid = true;
    }

    var reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if( !reEmail.test(email.val()) || email.val() === '') {
        $(email).css("border-color", "black")
        $('.emailValidation').css("visibility", "visible")
        isValid = false;
    }

    if( reEmail.test(email.val()) === true) {
        $(email).css("border-color", "white")
        $('.emailValidation').css("visibility", "hidden")
        isValid = true;
    }

    var rePass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.{8,})");
    if( !rePass.test(pass.val()) || pass.val() === '') {
        $(pass).css("border-color", "black")
        $('.passwordValidation').css("visibility", "visible")
        $('.passwordValidation2').css("visibility", "visible")
        isValid = false;
    }

    if( rePass.test(pass.val())) {
        $(pass).css("border-color", "white")
        $('.passwordValidation').css("visibility", "hidden")
        $('.passwordValidation2').css("visibility", "hidden")
        isValid = true;
    }

    if( pass.val() !== passConfirmation.val() || ( passConfirmation.val() === '' && pass.val() === '') ) {
        $(passConfirmation).css("border-color", "black")
        $('.passwordConfirmationValidation').css("visibility", "visible")
        isValid = false;
    }

    if( (pass.val() === passConfirmation.val()) && ( passConfirmation.val() !== '' && pass.val() !== '') ) {
        $(passConfirmation).css("border-color", "white")
        $('.passwordConfirmationValidation').css("visibility", "hidden")
        isValid = true;
    }

    if( country.val() === null ) {
        $(country).css("border-color", "black")
        $('.selectCountryValidation').css("visibility", "visible")
        isValid = false;
    }

    if( country.val() !== null ) {
        $(country).css("border", "3px solid white")
        $('.selectCountryValidation').css("visibility", "hidden")
        isValid = true;
    }

    if( !termsCheckbox ) {
        $('.termsCheckboxValidation').css("visibility", "visible")
        isValid = false;
    }
   
    if( termsCheckbox ) {
        $('.termsCheckboxValidation').css("visibility", "hidden")
        isValid = true;
    }

    if( !isUserConnectedSocialMedia ) {
        $('.socialMediaComment').css("color", "red")
        isValid = false;
    }

    return isValid;

}

function createCheckboxArr() {  
    var checked = [];

    var selectedElements = $(".selected label input");

    for (var i = 0; i < selectedElements.length; i++) {
        for (var j = 0; j < interests.length; j++) {
            if (interests[j].Name === $(selectedElements[i]).attr('title')) {
                checked.push({
                    Name: $(selectedElements[i]).attr('title'),
                    ID: interests[j].ID})      
            }            
        }
    }
    console.log(checked)
    return checked;
}

function isChecked (element) {
    if(element.is(':checked')) return true;
    else return false;
}
