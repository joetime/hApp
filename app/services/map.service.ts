import { Injectable } from '@angular/core';

// The purpose of this class is to sync state across multiple components.
// It maintains subscriptions to events, and fires off items when appropriate

@Injectable()
export class MapService {
    
    constructor() {
        console.info('MapService constructor');
    }



}
