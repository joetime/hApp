import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service'; //private settings:SettingsService
import { Geolocation } from 'ionic-native';
import { LogService } from './log.service';

@Injectable()
export class LocationService {

    constructor(private SETTINGS: SettingsService, private LOG: LogService) {}

    public getCurrentPosition(): Promise<any> {
        return new Promise<any> ((resolve, reject) => {
            
            this.LOG.log('LocationService getCurrentPosition()', {});

            let resolved = false;

            Geolocation.getCurrentPosition().then((resp) => {
                this.LOG.log('LocationService getCurrentPosition() =>', resp);
                console.log(resp);
                resolve(resp);
                resolved = true;
            }, (err) => {
                this.LOG.error('LocationService getCurrentPosition()', err);
                console.error(err);
                reject(err);
                resolved = true;
            });

            setTimeout(() => {
                if (!resolved) reject('timeout occurred');
            }, this.SETTINGS.GeolocationTimeout);
        });
    }
}