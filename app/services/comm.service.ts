import { Injectable } from '@angular/core';

import { PavingItemModel } from '../models/item.model';

// The purpose of this class is to sync state across multiple components.
// It maintains subscriptions to events, and fires off items when appropriate

@Injectable()
export class CommService {
    
    constructor() {
        console.info('CommService constructor');
    }

    public setPavingItem(item: PavingItemModel) {
        this.pavingItem = item;
        console.log('Comm pavingItem=', this.pavingItem);
    }
    public pavingItem: PavingItemModel;

}