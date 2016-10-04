
import { Optional } from '@angular/core';

export class PavingItemModel {

    constructor(@Optional() initAs: number) { 

        this.drawingObjectType = initAs;
        
        // Marker defaults (0)
        if (initAs == 0) {
            console.log('initialize as marker');
            
            this.name = "Marker";
            this.unit = "";
        } 
        // Polyline defaults (1)
        else if (initAs == 1) {
            console.log('initialize as polyline');
            
            this.name = "Line";
            this.unit = "LF";
        } 
        // Polygon defaults (2)
        else if (initAs == 2) {
            console.log('initialize as polygon');
            
            this.name = "Area";
            this.unit = "SF";
        }
    }

    public id: number;
    public drawingObjectType: number; // defaults to marker
    public identificationType: string = "Sitework"; //default to sitework
    public path: string = "";
    public color: string = "";
    public type: string = "";
    public name: string = "";
    public critical: boolean = false;
    public quantity: number = 1;
    public unit: string = "";
    public material: string = "";
    public timeStamp: Date;
    public modified: Date;
    public description: string = "";
    public deleted: boolean = false;
    public failureMode: any = {};
    public rating: string = "";
    public cause: any = {};
    public recommendedRepair: string = "";
    public reference: string = ""
}
