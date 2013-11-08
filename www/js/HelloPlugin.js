var HelloPlugin = {
    
    callNativeFunction: function (success, fail, groupid, deviceid, logincookie, token, photoArray) {
            return Cordova.exec( success, fail,
                    "com.tricedesigns.HelloPlugin", 
                    "nativeFunction", 
                    [groupid, deviceid, logincookie, token, photoArray]);
    }
};