//
//  HelloPlugin.m
//  PDE_Hybrid
//
//  Created by Stephen on 29/10/2013.
//
//

#import "AFNetworking.h"
#import "HelloPlugin.h"

@implementation HelloPlugin
@synthesize delegatePDE;

- (void) nativeFunction:(CDVInvokedUrlCommand*)command {
    //get the callback id
    NSLog(@"arguments***%@", command.arguments);
    NSString *callbackId = command.callbackId;
    NSString *imagedata = [command.arguments objectAtIndex:0];
    NSString *groupid = [command.arguments objectAtIndex:1];
    NSString *deviceid = [command.arguments objectAtIndex:2];
    NSString *logincookie = [command.arguments objectAtIndex:3];
    NSString *token = [command.arguments objectAtIndex:4];
    
    NSURL *url = [NSURL URLWithString:[[NSString alloc] initWithFormat:@"data:image/png;base64,%@",imagedata]];
    
    NSData *data = [NSData dataWithContentsOfURL:url];
    
    
    [self uploadPhoto:data andGroupId:groupid andDeviceId:deviceid andLoginCookie:logincookie andToken:token];
    
    CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"this is a plugin"];
    
    [self.commandDelegate sendPluginResult:commandResult callbackId:callbackId];
}

-(void) uploadPhoto:(NSData*) photo andGroupId:(NSString*) groupid andDeviceId:(NSString*) deviceid andLoginCookie:(NSString*) logincookie andToken:(NSString*) token
{
    NSString *kBaseURL = @"https://www.bluebadgesolutions.com/services/estimatorservice.svc";
    NSString *formURL = [[NSString alloc] initWithFormat:@"%@/createestimatephoto/JPG/8/0/email/caption/%@",kBaseURL,groupid];
    NSLog(@"test:%@", formURL);
    
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:formURL]];
    [request setValue:deviceid forHTTPHeaderField:@"EstimatorDeviceId"];
    
    [request setValue:@"0.0" forHTTPHeaderField:@"EstimatorLatitude"];
    [request setValue:@"0.0" forHTTPHeaderField:@"EstimatorLongitude"];
    
    [request setValue:token forHTTPHeaderField:@"EstimatorRequestToken"];
    [request setValue:logincookie forHTTPHeaderField:@"Cookie"];
    [request setTimeoutInterval:60];
    [request setHTTPMethod:@"POST"];
    [request setHTTPBody:photo];

    [self makeTheServiceCallWithServiceNameGetData:@"createestimatephoto" andTheRequestObject:request];
}

- (void) makeTheServiceCallWithServiceNameGetData:(NSString *)serviceName andTheRequestObject:(NSMutableURLRequest *)theRequest {
    AFHTTPRequestOperation *operation = [[AFHTTPRequestOperation alloc]initWithRequest:theRequest];
    [operation  setCompletionBlockWithSuccess:^(AFHTTPRequestOperation *operation, id responseObject) {
        NSLog(@"%@",operation.responseString);
        [[self delegatePDE] serviceResponseIsSucess:YES withServiceName:serviceName withServiceResponseData:operation.responseData andError:nil];
    }
                                      failure:^(AFHTTPRequestOperation *operation, NSError *error) {
                                          NSLog(@"%@",error);
                                          [[self delegatePDE]serviceResponseIsSucess:NO withServiceName:serviceName withServiceResponseData:operation.responseData andError:error];
                                      }
     ];
    
    NSOperationQueue *queue = [[NSOperationQueue alloc] init];
    [queue addOperation:operation];
}

@end
