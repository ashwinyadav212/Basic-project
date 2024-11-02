var nameError = document.getElementById('name-error');
var phoneError = document.getElementById('phone-error');
var emailError = document.getElementById('email-error');
var messageError = document.getElementById('message-error');
var SubmitError = document.getElementById('submit-error');


function validateName(){
    var name = document.getElementById('contact-name').value;

    if(name.length == 0){
        nameError.innerHTML = 'Name is required';
        return false;
  }
  if(!name.match(/^[A-Za-z]*\s{1}[A-Za-z]+$/)){
    nameError.innerHTML = 'Write full name';
    return false;
  }
  nameError.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
  return true;
}

function validatePhone(){
    var phone = document.getElementById('contact-phone').value;

    if(phone.length == 0){
        phoneError.innerHTML = 'phone no is required';
        return false;
    }
    if(phone.length !== 10){
        phoneError.innerHTML = 'phone no should be 10 digits';
        return false;
    }
    if(!phone.match(/^[0-9]{10}$/)){
        phoneError.innerHTML = 'only digits please';
        return false;
    }
    phoneError.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
    return true;
}

   function validateEmail(){
    var email = document.getElementById('contact-email').value;

    if(email.length == 0){
        emailError.innerHTML = 'Email is required';
        return false;
    }
    if(!email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)){
        emailError.innerHTML = 'Email Inavlid';
        return false;
    }
    emailError.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
    return true;
}
function validateMessage(){
    var message = document.getElementById('contact-message').value;
    var required = 30;
    var left = required - message.length;

    if(left > 0){
        messageError.innerHTML = left + 'more characters required';
        return false;
    }
    messageError.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
    return true;
}
function validateForm(){
    if(!validateName() || !validatePhone() || !validateEmail() || !validateMessage()){
        SubmitError.style.display = 'block';
        SubmitError.innerHTML = 'Please fix error to Submit';
        setTimeout(function(){SubmitError.style.display = 'none'}, 3000);
        return false;
    }
}