import { Component, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
// my stuff
import { MainCommService } from './main.comm';
import { SettingsStatic as SETTINGS } from '../../services/settings.static';
import { DrawingService } from '../../services/drawing.service';
declare var google;

@Component({
    template: `<div #myMap id="myMap">{{ msg }}</div>`,
    selector: 'acgo-map',
})
export class MainMap {
    componentName: string = 'MainMap';
    verbose: boolean = false; // for verbose logging

    map: any; // the google map
    @ViewChild('myMap') mapElement: ElementRef;   // the html element

    @Output() onLoadComplete = new EventEmitter<any>();

    public msg: string;

    constructor(private COMM: MainCommService) {
        console.log(this.componentName + ' constructor()');

        this.COMM.InitMap(this);
        //this.COMM.CreateMarker.

        this.msg = 'constructed';

        // ngOnInit() will be called
    }

    // EVENT: ngOnInit: Initialize the directive/component after Angular first displays the data-bound properties and sets the directive/component's input properties.
    // > Called once, after the first ngOnChanges.
    // : Creates Google Map and adds listeners
    ngOnInit(ev: SimpleChanges) {

        console.log(this.componentName + 'ngOnInit()', ev);

        this.map = new google.maps.Map(this.mapElement.nativeElement, SETTINGS.mapOptions);

        // attach map events:
        this.map.addListener('click', (c) => this.mapClick(c));
        this.map.addListener('bounds_changed', (b) => this.mapBoundsChanged(b));

    }

    // MAP event: click
    _mapClickStrategy = 'default';
    mapClick(p) {
        console.log(this.componentName + ' *mapClick', p);

        if (this._mapClickStrategy == 'push') {
            var path = this._currentObject.getPath();
            path.push(p.latLng);
            this._currentObject.setPath(path);
        }
    }

    // MAP event: bounds_changed
    mapBoundsChanged(b) {
        console.log(this.componentName + ' *mapBoundsChanged', b);

    }

    // MAP drawingObject: marker click
    mapDrawingObjectClick(drawingObject, clickevent) {
        console.log('MainCommService *mapDrawingObjectClick drawingObject=', drawingObject);

        if (this._currentObject != null) {
            this.EndObjectEdit();
            this.COMM.EndObjectEdit();
        }
        this.StartObjectEdit(drawingObject);
        this.COMM.StartObjectEdit(drawingObject);
    }

    // OUTSIDE event: center map
    public CenterMap(p) {
        console.log(this.componentName + ' *centerMap', p);

        var latLng;

        if (p.coords)
            latLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
        else
            latLng = p;

        this.map.setCenter(latLng);
        this.map.setZoom(SETTINGS.mapDefaultZoom);
    }


    private _currentObject = null;

    // OUTSIDE events: create marker
    public CreateMarker(p: any = null): any {
        console.log(this.componentName + ' *createMarker', p);

        var marker = DrawingService.GetMarker(this.map);

        // add click listener
        marker.addListener('click', this.mapDrawingObjectClick);

        // add reference to parent
        marker._acparent = this;

        // start edit
        this.StartObjectEdit(marker);

        return marker;
    }
    public StartPoly(letter) {
        console.log(this.componentName + ' *startPolyline');

        var poly; // get line or polygon
        if (letter == 'L') poly = DrawingService.GetPoyline(this.map);
        else poly = DrawingService.GetPolygon(this.map);

        // add click listener
        poly.addListener('click', (x) => {
            this.mapDrawingObjectClick(poly, x);
        });

        // add reference to parent 
        // poly._acparent = this;

        // start edit
        this.StartObjectEdit(poly);

        return poly;
    }
    public StartObjectEdit(obj: any) {
        console.log(this.componentName + ' *startPolyline');

        obj.setDraggable(true);
        if (obj.setEditable) obj.setEditable(true);
        if (obj.setEditable) this._mapClickStrategy = 'push';
        this._currentObject = obj;
    }
    public EndObjectEdit() {
        console.log(this.componentName + ' *EndObjectEdit');

        if (this._currentObject.setEditable) this._currentObject.setEditable(false); // markers have no editable property
        this._currentObject.setDraggable(false);
        this._currentObject = null;

        this._mapClickStrategy = 'default';

    }
    public CancelObjectEdit() {
        console.log(this.componentName + ' *CancelObjectEdit');

        this._currentObject.setMap(null); // removes from map
        this._currentObject = null;
        this._mapClickStrategy = 'default';
    }

    // Angular EVENT: Respond when Angular (re)sets data-bound input properties. 
    // The method receives a SimpleChanges object of current and previous property values.
    // > Called before ngOnInit and whenever one or more data-bound input properties change.
    ngOnChanges(ev: any) { console.log(this.componentName + 'ngOnChanges()', ev); }


    /* Angular - Other event hooks
    ngDoCheck(ev: any) { if (this.verbose) console.log(this.componentName + 'ngDoCheck()', ev); }
    ngAfterContentInit(ev: any) { if (this.verbose) console.log(this.componentName + 'ngAfterContentInit()', ev); }
    ngAfterContentChecked(ev: any) { if (this.verbose) console.log(this.componentName + 'ngAfterContentChecked()', ev); }
    ngAfterViewInit(ev: any) { if (this.verbose) console.log(this.componentName + 'ngAfterViewInit()', ev); }
    ngAfterViewChecked(ev: any) { if (this.verbose) console.log(this.componentName + 'ngAfterViewChecked()', ev); }
    ngOnDestroy(ev: any) { if (this.verbose) console.log(this.componentName + 'ngOnDestroy()', ev); }
    */
}