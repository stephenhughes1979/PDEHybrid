//
//  HelloPlugin.h
//  PDE_Hybrid
//
//  Created by Stephen on 29/10/2013.
//
//

#import <Cordova/CDV.h>
@protocol PDEServiceDelegate <NSObject>
@optional
- (void) serviceResponseIsSucess:(BOOL)isSuccess withServiceName:(NSString *)serviceName withServiceResponseData:(NSData *)responseData andError:(NSError *)error;
@end

@interface HelloPlugin : CDVPlugin
{
       __weak id <PDEServiceDelegate> delegatePDE;
}

@property (weak) id delegatePDE;

- (void) nativeFunction:(CDVInvokedUrlCommand*)command;
@end
