//
//  HelloPlugin.m
//  PDE_Hybrid
//
//  Created by Stephen on 29/10/2013.
//
//

#import "HelloPlugin.h"

@implementation HelloPlugin

- (void) nativeFunction:(CDVInvokedUrlCommand*)command {
    //get the callback id
    NSString *callbackId = command.callbackId;

    NSLog(@"Hello, this is a native function called from PhoneGap/Cordova!");
    
    CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"this is a plugin"];
    
    [self.commandDelegate sendPluginResult:commandResult callbackId:callbackId];
}

@end
