var HelloPlugin = {
    
    callNativeFunction: function (success, fail, imageData, groupid, deviceid, logincookie, token) {
            return Cordova.exec( success, fail,
                    "com.tricedesigns.HelloPlugin", 
                    "nativeFunction", 
                    [imageData, groupid, deviceid, logincookie, token]);
    }
};