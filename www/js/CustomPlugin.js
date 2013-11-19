var UploadPlugin = {
    
    callNativeFunction: function (success, fail, groupid, deviceid, logincookie, token, photoArray) {
            return Cordova.exec( success, fail,
                    "com.tricedesigns.HelloPlugin", 
                    "nativeFunction", 
                    [groupid, deviceid, logincookie, token, photoArray]);
    }
};

var CheckPlugin = {
    checkIfPushEnabled: function (successcheckIfPushEnabled, failcheckIfPushEnabled) {
        return Cordova.exec( successcheckIfPushEnabled, failcheckIfPushEnabled,
                        "com.tricedesigns.CheckPushPlugin",
                        "isPushEnabled", []);
    }
}