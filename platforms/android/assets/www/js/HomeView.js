var imagebyte;
var caption;

$(document).on('pageshow', '#homePage', function(event) {
   
    var target = document.getElementById('preview1');
    var claimdata = JSON.parse(window.localStorage.getItem("claimdata"));

    window.localStorage.setItem("token", claimdata.Token);
    console.log(claimdata);
    $('#lblName').text(claimdata.CustomerName);
    $('#lblClaimNumber').text(claimdata.ClaimNumber);
    
    $('#lstExistingPhotos').empty();
    $('#lstDamageAreas').empty();
    $('#lstPersonalProperty').empty();
    $('#lstDocuments').empty();
    
    if (claimdata.PhotosAlreadyTaken == 1)
    {
        $("#lstExistingPhotos").append("<b>Existing Photos</b><br>");
        var button = $('<a data-role="button" style="line-height:10px;" data-icon="arrow-r" data-iconpos="right" href="javascript:takePhoto();"><img src="css/themes/images/ic_camera_sm_dark.png"><span style="position:relative;top:-20px;">Existing Photos</span><a>');
        $("#lstExistingPhotos").append(button).trigger('create');
    }
    
    var DamageTile = 0;
    var PersonalTitle = 0;
    var DocumentTitle = 0;
    for (var i=0; i<claimdata.Groups.length;i++)
    {
        if (claimdata.Groups[i].Type == 1) 
        {
            if (DamageTile == 0)
            {
                $("#lstDamageAreas").append("<b>Damaged Areas</b><br>");
                DamageTitle = 1;
            }
            var button = $('<a data-role="button" style="line-height:10px;" data-icon="arrow-r" data-iconpos="right" href="javascript:takePhoto(\'' + claimdata.Groups[i].ID + '\');"><img src="css/themes/images/ic_camera_sm_dark.png"><span style="position:relative;top:-20px;">' + claimdata.Groups[i].Title + '</span></a>');
            $("#lstDamageAreas").append(button).trigger('create');
        }
        else if (claimdata.Groups[i].Type == 2) 
        {
            if (PersonalTitle == 0)
            {
                $("#lstPersonalProperty").append("<b>Personal Property</b><br>");
                PersonalTitle = 1;
            }
            var button = $('<a data-role="button" style="line-height:10px;" data-icon="arrow-r" data-iconpos="right" href="javascript:takePhoto(\'' + claimdata.Groups[i].ID + '\');"><img src="css/themes/images/ic_camera_sm_dark.png"><span style="position:relative;top:-20px;">' + claimdata.Groups[i].Title + '</span></a>');
            $("#lstPersonalProperty").append(button).trigger('create');
        }
        else if (claimdata.Groups[i].Type == 3) 
        {
            if (DocumentTitle == 0)
            {
                $("#lstDocuments").append("<b>Documents</b><br>");
                DocumentTitle = 1;
            }
            var button = $('<a data-role="button" style="line-height:10px;" data-icon="arrow-r" data-iconpos="right" href="javascript:takePhoto(\'' + claimdata.Groups[i].ID + '\');"><img src="css/themes/images/ic_camera_sm_dark.png"><span style="position:relative;top:-20px;">' + claimdata.Groups[i].Title + '</span></a>');
            $("#lstDocuments").append(button).trigger('create');
        } 
    }
});

$( "#divAddDescription" ).click(function() {
    $('#popupCaption').popup('open');
});

function closePopup() {
    $('#popupCaption').popup('close');
}

function getCaption() {
    caption = $('#captiontextarea').val();
    $('#captionlabel').text(caption);
    $('#popupCaption').popup('close');
}

function uploadPhoto()
{
  
    var groupid = window.localStorage.getItem("currentgroup");
    var deviceid = window.localStorage.getItem("deviceid");
    var logincookie = window.localStorage.getItem("logincookie");
    var token = window.localStorage.getItem("token");
    var photo = imagebyte;
  
    $.ajax({
        type: "POST",
        cache: false,
        processData:false,
        url:"https://www.bluebadgesolutions.com/services/estimatorservice.svc/createestimatephoto/JPG/8/0/shugh@allstate.com/" + caption + "/" +  groupid,
        contentType: "application/json; charset=utf-8",
        data:photo,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('EstimatorDeviceId', deviceid);
            xhr.setRequestHeader('Cookie', logincookie);
            xhr.setRequestHeader('EstimatorRequestToken',token);
            xhr.setRequestHeader('EstimatorLatitude','67.87');
            xhr.setRequestHeader('EstimatorLongitude','74.78');
        },
        success: function (data) {
            alert(data.IsSuccess);
            alert(data.ErrorMessage);
        },  
        error: function(httpRequest, message, errorThrown) {
            alert('fail');
            $.mobile.loading( 'hide', {
                text: 'foo',
                textVisible: true,
                theme: 'z',
                html: ""
            });
            alert(errorThrown);
        }
    });
}

function Discard() {
    $.mobile.changePage("#previewPhoto", {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
    navigator.camera.getPicture(onSuccess, onFail, { quality: 10, targetWidth:320, targetHeight:480,  encodingType: Camera.EncodingType.JPEG,
        destinationType: Camera.DestinationType.DATA_URL
    });
}

function takePhoto(groupid) {
    window.localStorage.setItem("currentgroup", groupid);
    $.mobile.changePage("#step1", {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
}

function openCamera() {
    $.mobile.changePage("#previewPhoto", {
        transition: "slide",
        reverse: true,
        changeHash: true
    });
    navigator.camera.getPicture(onSuccess, onFail, { quality: 10, targetWidth:320, targetHeight:480,  encodingType: Camera.EncodingType.JPEG,
        destinationType: Camera.DestinationType.DATA_URL
    }); 
}

function onSuccess(imageData) {
    var image = document.getElementById('imgPreview');
    $("#imgdiv").css('background-image', 'url(' + "data:image/jpeg;base64," + imageData + ')');
    $("#imgdiv").css('height', '480');
    $("#imgdiv").css('width', '290');
    imagebyte = imageData;
}

function onFail(message) {
    $.mobile.changePage("#homePage", {
                        transition: "slide",
                        reverse: true,
                        changeHash: true
                        });
}