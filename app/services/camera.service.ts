import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service'; //private settings:SettingsService
import { Camera } from 'ionic-native';
import { LogService } from './log.service';

@Injectable()
export class CameraService {

    constructor(private SETTINGS: SettingsService, private LOG: LogService) {}

    private cameraOptions = {
        destinationType: Camera.DestinationType.DATA_URL
    };

    public getPicture(): Promise<any> {
        console.log('Camera.getPicture()'); 

        return new Promise<any> ((resolve, reject) => {
            
            Camera.getPicture(this.cameraOptions).then ((imageData) => {
                console.log('Camera.getPicture =>', imageData);
                resolve(imageData);
            }, (err) => {
                this.LOG.error('CameraService getPicture()', err);
                console.error("Camera.getPicture =>", err);
                reject(err);
            });
        });
    }
}