import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service'; //private settings:SettingsService
import { Geolocation } from 'ionic-native';

@Injectable()
export class LocationService {

    constructor(private SETTINGS: SettingsService) {}

    public getCurrentPosition(): Promise<any> {
        return new Promise<any> ((resolve, reject) => {
            
            Geolocation.getCurrentPosition().then((resp) => {
                console.log(resp);
                resolve(resp);
            }, (err) => {
                console.error(err);
                reject(err);
            });
        });
    }
}