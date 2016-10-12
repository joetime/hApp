import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
// Services
//import { SettingsService } from '../../services/settings.service';
import { SettingsStatic } from '../../services/settings.static';
import { LogService } from '../../services/log.service';
import { Backand } from '../../services/backand.service';
import { LocationService } from '../../services/location.service';
import { Toast } from '../../services/toast.service';
import { CommService } from '../../services/comm.service';
import { DrawingService, DrawingObjectType } from '../../services/drawing.service';
import { PavingItemService } from '../../services/paving-item.service';
// Directive
import { PavingItemModel } from '../../models/paving-item.model';
import { ItemForm } from '../../components/item-form/item-form.directive';

import { MapPageState, MapPageMode } from './map.page.state'; // a state service for this controller

declare var google;

@Component({
    templateUrl: 'build/pages/map-page/map.page.html',
    directives: [ItemForm]
})
export class MapPage {

    MapPageMode = MapPageMode; // allows us to use enum in template
    public mode: MapPageMode;

    @ViewChild('map') mapElement: ElementRef;
    public editItem: any; // passed to form

    // will hold the last item updated so we can 
    // highlight in interface
    public _lastUpdated: any;

    map: any;
    mapOptions: any;
    mapLoading: boolean = false;
    gettingLocation: boolean = false;

    constructor(
        public STATE: MapPageState,
        public navCtrl: NavController,
        //private location: LocationService,
        private T: Toast,
        private Comm: CommService,
        private Drawing: DrawingService,
        private PavingItem: PavingItemModel,
        private PavingItemService: PavingItemService,
        private Menu: MenuController,
        private Zone: NgZone
    ) {

        console.info('MapPage constructor. initialized =', this.STATE.initialized);
        // ionViewLoaded() will fire as well.
        this.mapOptions = SettingsStatic.mapOptions;
        this.mode = MapPageMode.List;
    }

    // fired from the form (child directive)
    public editComplete(b) {
        console.log('MapPage editComplete', b);
        this.mode = MapPageMode.List;

        this._lastUpdated = b;
    }

    public listMode() {
        //this._currentObject = null;
        // this.mode = MapPageMode.List;
    }

    // # Map Init, refresh
    public recenter_Click() {

        let forceRecenter = true;
        this.loadMap(forceRecenter);
    }

    public Reframe_Click() {
        DrawingService.CenterOnDrawingObjects(this.map, this.STATE.itemsList);
    }



    // Wait for ionic, then load the map
    ionViewLoaded() {
        console.info('MapPage ionicViewLoaded()')
        //if (!MapPage.initialized) 
        this.loadMap(); // load first time only??
    }

    loadData() {
        console.log('MapPage loadData()');

        this.PavingItemService.Get().then((d: any[]) => {

            console.log('MapPage data recvd: ', d);

            this.STATE.itemsList = [];

            d.forEach((item) => {
                var drawingObject;
                let pavingItem: PavingItemModel = item;
                console.log('restoring item...', item);

                if (item.drawingObjectType == DrawingObjectType.MARKER) {
                    drawingObject = DrawingService.GetMarker(this.map, item.path);
                }
                else if (item.drawingObjectType == DrawingObjectType.POLYLINE) {
                    drawingObject = DrawingService.GetPoyline(this.map, item.path);
                }
                else {
                    drawingObject = DrawingService.GetPolygon(this.map, item.path);
                }

                drawingObject.acgo = pavingItem;

                this.STATE.itemsList.push(drawingObject);
            });

        }).catch((err) => { 'error getting data', err });
    }



    // dicide to use last known location/zoom, or current loc of device
    // sends proper mapOptions to createMap()
    loadMap(forceRecenter: boolean = false): Promise<boolean> {
        console.info('MapPage loadMap()')

        return new Promise((resolve, reject) => {
            this.mapLoading = true;

            try {
                // load the last used from STATE
                if (!forceRecenter && this.STATE.initialized) {

                    console.log('creating map from stored info')
                    // we might needt to stall for a sec or two
                    // because the map wont load from STATE immediately sometimes - :?
                    setTimeout(() => {

                        var latLng = new google.maps.LatLng(this.STATE.center.lat, this.STATE.center.lng);
                        this.mapOptions.center = latLng;
                        this.mapOptions.zoom = this.STATE.zoom;
                        this.createMap();

                    }, SettingsStatic.mapLoadDelay);

                    resolve(true);
                }
                // get current location and use that
                else {
                    console.log('creating map from current location')

                    this.gettingLocation = true;

                    // load from current device location
                    LocationService.getCurrentPosition().then((v) => {
                        var latLng = new google.maps.LatLng(v.coords.latitude, v.coords.longitude);
                        this.mapOptions.center = latLng;
                        this.mapOptions.zoom = SettingsStatic.mapDefaultZoom
                        this.createMap();
                        this.STATE.initialized = true;
                        this.gettingLocation = false;
                        resolve(true);
                    },
                        // if rejected, load a default map state
                        (rejected) => {
                            this.T.toast('could not get location :( - ' + rejected)
                            this.createMap();
                            this.STATE.initialized = true;
                            this.gettingLocation = false;
                            resolve(true);
                        });
                }

            } catch (ex) {
                this.T.toast('error creating map:' + ex);
                this.mapLoading = false;
                reject(false);
            }
        });


    }

    // Actually creates the map using the DIV#map 
    // - adds the bounds_changed listener
    createMap() {
        console.log('creating map: ', this.mapOptions);

        this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);

        // listen for changes to the center, and store that value in the MapPageState
        google.maps.event.addListener(this.map, 'bounds_changed', () => this.onBoundsChanged(this));

        // a click listener we can reuse for editing shapes
        // google.maps.event.addListener(this.map, 'click', this.onMapClick);

        // re-draw makers from STATE
        this.loadData();

        this.mapLoading = false;
    }

    onMapClick() { }

    // when map bounds change, save the values in the STATE
    onBoundsChanged(ctrl: MapPage) {
        ctrl.STATE.center = {
            lat: ctrl.map.getCenter().lat(),
            lng: ctrl.map.getCenter().lng()
        }
        console.log('bounds_changed:', ctrl.STATE.center);
        ctrl.STATE.zoom = ctrl.map.getZoom();
    }


    pavingItemList_Click(item) {
        console.info('MapPage pavingItemList_Click()')

        this.openItem(item);
    }

    openItem(item) {
        console.log('opening item', item);

        this._currentObject = item;

        DrawingService.setEditable(this._currentObject);

        DrawingService.CenterOnDrawingObject(this.map, this._currentObject);

        this.Comm.setPavingItem(item.acgo);

        this.mode = MapPageMode.EditItem;
    }

    handleDrawingObjectClick(drawingObject) {
        //if (drawingObject == this._currentObject) return; // just ignore

        this.openItem(drawingObject);
    }

    // # Markers, Lines, Polygons

    public addMarker_Click() {
        console.info('MapPage addMarker()')

        try {
            let pavingItem: PavingItemModel = new PavingItemModel(0);
            let marker = DrawingService.GetMarker(this.map);
            DrawingService.setEditable(marker);
            marker.addListener('click', (ev) => {
                console.log('marker clicked');
                this.Zone.run(() => {
                    this.handleDrawingObjectClick(marker);
                });
            })

            this._currentObject = marker;


            // get path from marker object           
            pavingItem.path = DrawingService.GetPathString(marker);

            // add event listener (updates coords on dragend)
            google.maps.event.addListener(marker, 'dragend', (v) => {
                this.updatePath(marker)
            });

            // Save to server 
            this.PavingItemService.Save(pavingItem).then((res) => {

                // associate marker with data
                marker.acgo = res;
            },
                (err) => {
                    this.T.toast('!! error creating item !! ' + err);
                    console.error('error creating item', err);
                });

            this.Comm.setPavingItem(pavingItem); // send to comm!

            this.STATE.itemsList.splice(0, 0, marker); // push item to top of list

            this.mode = MapPageMode.EditItem;

        } catch (ex) {
            this.T.toast('error creating marker:' + ex);
        }
    }

    public addPolyline_Click() {

        try {
            console.info('MapPage addPolyline()')

            let polyline = DrawingService.GetPoyline(this.map);
            this._currentObject = polyline;
            DrawingService.setEditable(polyline);

            polyline.addListener('click', (ev) => {
                console.log('polyline clicked');
                this.Zone.run(() => {
                    this.handleDrawingObjectClick(polyline);
                });
            });


            let pavingItem = new PavingItemModel(1);


            // Save to server 
            this.PavingItemService.Save(pavingItem).then((res) => {

                console.log('new item created');
                // associate marker with data
                polyline.acgo = res;

                this.Comm.pavingItem = polyline.acgo; // load in form

                this.STATE.itemsList.splice(0, 0, polyline); // push item to top of list

                this.T.toast('Click on the map to draw your polyline.')

                google.maps.event.addListener(this.map, 'click', (v) => {
                    // push new path point
                    var path = polyline.getPath();
                    path.push(v.latLng);
                    polyline.setPath(path);
                    // save changes to DB
                    //this.updatePath(polyline);
                    //this.updateQuantity(polyline);
                });

                this.mode = MapPageMode.EditItem;
            },
                (err) => {
                    this.T.toast('!! error creating item !! ' + err);
                    console.error('error creating item', err);
                });


        } catch (ex) {
            this.T.toast('Error adding polyline: ' + ex);
            console.error(ex);
        }
    }

    public addPolygon_Click() {
        console.info('MapPage addPolygon()')

        let polygon = DrawingService.GetPolygon(this.map);
        this._currentObject = polygon;
        DrawingService.setEditable(polygon);
        polygon.addListener('click', (ev) => {
            console.log('polygon clicked');
            this.Zone.run(() => {
                this.handleDrawingObjectClick(polygon);
            });
        });

        // attach pavingItem data
        let pavingItem = new PavingItemModel(2);


        this.PavingItemService.Save(pavingItem).then((res) => {

            console.log('new item created');
            // associate marker with data
            polygon.acgo = res;
            this.Comm.pavingItem = polygon.acgo; // load in the form

            this.STATE.itemsList.splice(0, 0, polygon); // push item to top of list

            this.T.toast('Click on the map to draw your polygon.')

            google.maps.event.addListener(this.map, 'click', (v) => {
                // push new path point
                var path = polygon.getPath();
                path.push(v.latLng);
                polygon.setPath(path);
            });

            this.mode = MapPageMode.EditItem;
        },
            (err) => {
                this.T.toast('Error saving polygon')
            });
    }

    // handles the changing of paths (when DONE is clicked)
    private updatePath(drawingObject) {

        console.info('updatePath', drawingObject);

        var pathStr = DrawingService.GetPathString(drawingObject);

        this.PavingItemService.Save({ id: drawingObject.acgo.id, path: pathStr }).then((res) => {
            console.log('item saved, pathStr=', pathStr);
            drawingObject.acgo.path = pathStr;
            this.Comm.updatePavingItemPathString(pathStr);
        },
            (err) => {
                this.T.toast('!! error saving item !!' + err)
                console.error('error saving item', err);
            });
    }

    private updateQuantity(drawingObject) {
        console.info('updateQuantity', drawingObject);
        var quantity = DrawingService.GetQuantity(drawingObject);

        this.PavingItemService.Save({ id: drawingObject.acgo.id, quantity: quantity }).then((res) => {
            console.log('item saved');
            drawingObject.acgo.quantity = quantity;
            this.Comm.updatePavingItemQuantity(quantity);
        },
            (err) => {
                this.T.toast('!! error saving item !!' + err)
                console.error('error saving item', err);
            });
    }



    private _currentObject;
    public endDrawingEdit() {
        // save any changes;
        this.updatePath(this._currentObject);
        this.updateQuantity(this._currentObject);

        // clear events and set as not editble/dragable
        google.maps.event.clearListeners(this.map, 'click');
        DrawingService.setEditable(this._currentObject, false);

        // clear state
        //  this.mode = MapPageMode.List;
        //this._currentObject = null;   
        this.Menu.open('right');
    }

    restoreShapes() {
        for (let entry of this.STATE.itemsList) {
            console.log('redraw', entry);
            entry.setMap(this.map);
        }
    }
}