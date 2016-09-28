import { Injectable } from '@angular/core';


@Injectable()
export class SettingsService {

    constructor() {}

    // Deploy
    public updateServiceTimeout = 5000;

    // Log
    public logDelay: number = 3000;
    public logsPageSize = 50;

    // Geolocation
    public GeolocationTimeout = 10000;

}