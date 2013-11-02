//
//  HelloPlugin.h
//  PDE_Hybrid
//
//  Created by Stephen on 29/10/2013.
//
//

#import <Cordova/CDV.h>

@interface HelloPlugin : CDVPlugin

- (void) nativeFunction:(CDVInvokedUrlCommand*)command;
@end
