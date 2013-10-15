$(document).on('pageshow', '#detailsPage', function(event) {
    var agent = JSON.parse(window.localStorage.getItem("cachedAgent"));
    console.log(agent);
    $('#fullName').text(agent.FirstName + ' ' + agent.LastName);
    $('#employeeTitle').text(agent.AgencyName);
    $('#employeeTitle').text(agent.AgencyName);
    var address = agent.PhysicalAddress;
    $('#employeePic').attr('src', agent.PhotoUrl);
    $('#city').text(address.Address1 + ' ' + address.City + " " +address.State);
});

function getPicture() {
    navigator.camera.getPicture(piconSuccess, piconFail, { quality: 50, 
    destinationType: Camera.DestinationType.FILE_URI }); 
}

function piconSuccess(imageURI) {
    //var image = document.getElementById('employeePic');
    //image.src = imageURI;
    console.log(imageURI);
    navigator.notification.alert("Image was not saved to device!", null, "Image was sent to your agent", 'OK');
}

function piconFail(message) {
    alert('Failed because: ' + message);
}

function sendSMS() {
    var agent = JSON.parse(window.localStorage.getItem("cachedAgent"));
    console.log(agent);
    var url = 'sms:' + agent.Phone;
    window.open(url);
}
    
function sendEmail() {
    var agent = JSON.parse(window.localStorage.getItem("cachedAgent"));
    var url = 'mailto:' + agent.Email;
    window.open(url);
}
   
function callAgent() {
    var agent = JSON.parse(window.localStorage.getItem("cachedAgent"));
    var url = 'tel:+' + agent.Phone;
    window.open(url);
}

function removeFromContacts() {
    var agent = JSON.parse(window.localStorage.getItem("cachedAgent"));
    
    var options      = new ContactFindOptions();
    options.filter   = agent.FirstName + ' ' + agent.LastName;
    options.multiple = true;
    var fields       = ["displayName", "name"];
    navigator.contacts.find(fields, onSuccess, onError, options);
}
            function onSuccess(contacts) {
                for (var i = 0; i < contacts.length; i++) {
                    contacts[i].remove();
                    navigator.notification.alert("Contact Removed", null, "Contacts", 'OK');
                }
            }

            function onError(contactError) {
                navigator.notification.alert(contactError, null, "Contacts Delete Fail", 'OK');
            }

function addToContacts() {
    var agent = JSON.parse(window.localStorage.getItem("cachedAgent"));
    console.log('addToContacts');
    if (!navigator.contacts) {
        navigator.notification.alert("Contacts API not supported", null, "Error", 'OK');
        return;
    }
    var contact = navigator.contacts.create();
    contact.name = {givenName: agent.FirstName, familyName:  agent.LastName};
    var phoneNumbers = [];
    phoneNumbers[0] = new ContactField('work', agent.Phone, false);
    contact.phoneNumbers = phoneNumbers;
    contact.save();
    navigator.notification.alert("Contact Added", null, "Contacts", 'OK');
    return false;
};