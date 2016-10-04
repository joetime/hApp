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

            // if it's a new item
            if (item.id == undefined || item.id < 0) {
                return this.BK.addPavingItem(item).subscribe((res) => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            }
            // update 
            else {
                return this.BK.updatePavingItem(item).subscribe((res) => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            }
        });
    }

}