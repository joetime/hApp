import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service'; //private settings:SettingsService
import { Camera } from 'ionic-native';
import { LogService } from './log.service';
import { FileService } from './file.service';
import { Toast } from './toast.service';

@Injectable()
export class CameraService {

    constructor(
        private SETTINGS: SettingsService, 
        private LOG: LogService,
        private fileService: FileService,
        private toast: Toast) {}

    private cameraOptions = {
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        //allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,

        quality: 50,
        //targetHeight: 800,
        //targetWidth: 600
    };

    public getPicture(): Promise<any> {
        console.log('Camera.getPicture()'); 

        return new Promise<any> ((resolve, reject) => {
            
            Camera.getPicture(this.cameraOptions).then ((imageData) => {
                console.log('Camera.getPicture =>', imageData);
                
                this.fileService.uploadFile('testpic123.jpg', imageData).then(
                    (data) => { 
                        this.toast.toast('upload success ' + data);
                        this.LOG.log('upload success', JSON.stringify(data));
                    },
                    (err) => { 
                        this.toast.toast('upload err: ' + JSON.stringify(err))
                        this.LOG.error('upload err', JSON.stringify(err))
                    }
                );

                resolve(imageData);
                
            }, (err) => {
                this.LOG.error('CameraService getPicture()', err);
                console.error("Camera.getPicture =>", err);
                reject(err);
            });
        });
    }
}
//{"_body":"<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\"\"http://www.w3.org/TR/html4/strict.dtd\">\r\n<HTML><HEAD><TITLE>Bad Request</TITLE>\r\n<META HTTP-EQUIV=\"Content-Type\" Content=\"text/html; charset=us-ascii\"></HEAD>\r\n<BODY><h2>Bad Request - Request Too Long</h2>\r\n<hr><p>HTTP Error 400. The size of the request headers is too long.</p>\r\n</BODY></HTML>\r\n","status":400,"ok":false,"statusText":"Bad Request","headers":{"Server":["Microsoft-HTTPAPI/2.0"],"Content-Type":["text/html; charset=us-ascii"],"Date":["Fri"," 30 Sep 2016 16:13:01 GMT"],"Connection":["keep-alive"],"Content-Length":["346"]},"type":2,"url":"https://api.backand.com/1/objects/action/Test/1?name=files"}
//Error: Uncaught (in promise): Response with status: 400 Bad Request for URL: https://api.backand.com/1/objects/action/Test/1?name=files