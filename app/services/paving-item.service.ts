import { Injectable } from '@angular/core';
import { Backand } from './backand.service';
import { PavingItemModel } from '../models/paving-item.model';

@Injectable()
export class PavingItemService {
    constructor(
        private BK: Backand
    ) { }

    public Save(item: any): Promise<any> {

        console.log('PavingItemService Save()', item);

        return new Promise((resolve, reject) => {

            item = this.packItem(item);

            // if it's a new item
            if (item.id == undefined || item.id < 0) {
                return this.BK.addPavingItem(item).subscribe((res) => {
                    res = this.unPackItem(res);
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            }
            // update 
            else {
                return this.BK.updatePavingItem(item).subscribe((res) => {
                    res = this.unPackItem(res);                    
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            }
        });
    }

    // Stringifies any lists
    private packItem(item) {
        
        // stringify failuremode
        if (item.failureMode && typeof(item.failureMode) === 'object')
            item.failureMode = JSON.stringify(item.failureMode);
        
        // stringify cause
        if (item.cause && typeof(item.cause) === 'object')
            item.cause = JSON.stringify(item.cause);
        
        return item;
    }

    // parses any lists
    private unPackItem(item) {

        // Failuremode
        try {
            if (item.failureMode && item.failureMode.length > 0) item.failureMode = JSON.parse(item.failureMode);  // restore failureMode
        }
        catch (ex) {
            console.error('error unpacking failureMode')
        }

        // Cause
        try {
            if (item.cause && item.cause.length > 0) item.cause = JSON.parse(item.cause);  // restore cause
        } catch(ex) {
            console.error('error unpacking cause')   
        }

        return item;
    }

}