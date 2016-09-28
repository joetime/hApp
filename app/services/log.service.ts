
import { Injectable } from '@angular/core';
import { Backand } from './backand.service';
//import { SettingsService } from './settings.service'; //private settings:SettingsService

@Injectable()
export class LogService {

    constructor(private BK: Backand) {
        console.info('LogService constructor()');
    }

    public log(msg, obj, error = false): Promise<any> {
        
        //console.log('LogService log()');

        if (obj === undefined || obj === null) {
            // just a simple console log
            if (error) console.error(msg) 
            else console.info(msg);
            return this.BK.log(msg, null, "", error); 
        }
        else {
            if (error) console.error(msg, obj); 
            else console.log(msg, obj);
            return this.BK.log(msg, obj, "", error);
        }
    
    }
    
    public error(msg, obj):Promise<any> {
        console.log('LogService error()');

        return this.log(msg, obj, true);
    }
};