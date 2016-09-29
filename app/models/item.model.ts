

export class PavingItemModel {

    constructor() { }

    public id: number;
    public drawingType: string = "";
    public identificationType: string = "Sitework"; //default to sitework
    public path: string = "";
    public color: string = "";
    public type: string = "";
    public name: string = "";
    public critical: boolean = false;
    public quantity: number = 0;
    public unit: string = "";
    public material: string = "";
    public timeStamp: Date;
    public modified: Date;
    public description: string = "";
    public deleted: boolean = false;
    public failureMode: string = "";
    public rating: string = "";
    public cause: string = "";
    public recommendedRepair: string = "";
    public reference: string = ""
}
