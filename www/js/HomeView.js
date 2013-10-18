$(document).on('pageshow', '#homePage', function(event) {
    var target = document.getElementById('preview1');
    var claimdata = JSON.parse(window.localStorage.getItem("claimdata"));

    console.log(claimdata);
    $('#lblName').text(claimdata.CustomerName);
    $('#lblClaimNumber').text(claimdata.ClaimNumber);
    
    $('#lstDameage').empty();
    for (var i=0; i<claimdata.Groups.length;i++)
    {
        var button = $('<a data-role="button" style="height:50px" data-theme="a" data-icon="arrow-r" data-iconpos="right" class="iconleft" href="javascript:takePhoto(\'' + claimdata.Groups[i].ID + '\');"><img src="css/themes/images/ic_camera_sm_dark.png" style="position:relative;left:-50px;"><span style="position:relative;top:-9px;left:-30px;">' + claimdata.Groups[i].Title + '</span></a>');
        $("#lstDameage").append(button).trigger('create');
    }
});


function takePhoto(groupid) {
    $.mobile.changePage("#step1", {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
}

function openCamera() {
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
    }); 
}

function onSuccess(imageData) {
    console.log(imageData);
}

function onFail(message) {
    alert('Failed because: ' + message);
}