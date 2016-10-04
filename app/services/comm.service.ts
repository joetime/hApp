import { Injectable } from '@angular/core';

import { PavingItemModel } from '../models/paving-item.model';

// The purpose of this class is to sync state across multiple components.
// It maintains subscriptions to events, and fires off items when appropriate

@Injectable()
export class CommService {
    
    constructor() {
        console.info('CommService constructor');
    }
    // # PavingItem
    public pavingItem: PavingItemModel;
    public setPavingItem(item: PavingItemModel) {
        this.pavingItem = item;
        console.log('Comm pavingItem=', this.pavingItem);
    }
    // update for individual fields
    public updatePavingItemQuantity(q: number) {
        console.log('Comm updatePavingItemQuantity=', q);
        this.pavingItem.quantity = q;
    }
    // update for individual fields
    public updatePavingItemPathString(p: string) {
        console.log('Comm updatePavingItemPathString=', p);
        this.pavingItem.path = p;
    }
}