import { Injectable } from '@angular/core';
import { MapPage } from './map.page';
// The purpose of this class is to sync state across multiple components.
// It maintains subscriptions to events, and fires off items when appropriate


export enum MapPageMode {
    List = 0,
    EditItem
}

@Injectable()
export class MapPageState {

    constructor() {
        console.info('MapState constructor');

        // start the map page in LIST view
        //this.mode = MapPageMode.List;
        this.initialized = false;
    }

    public initialized: boolean;

    public zoom: number;
    public center: any;

    public itemsList: any[] = []; // starts with empty list

}