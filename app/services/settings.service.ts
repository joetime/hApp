import { Injectable } from '@angular/core';


@Injectable()
export class SettingsService {

    constructor() {}

    public logDelay: number = 3000;
    public updateServiceTimeout = 5000;

}