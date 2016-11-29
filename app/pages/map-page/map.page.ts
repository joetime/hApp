import { Component, ViewChild, ElementRef, NgZone, Injectable } from '@angular/core';
import { Device } from 'ionic-native';
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

    public static testMessage = '';

    MapPageMode = MapPageMode; // allows us to use enum in template
    public mode: MapPageMode;

    @ViewChild('map') mapElement: ElementRef;
    public editItem: any; // passed to form

    // current object being edited
    private _currentObject;
    // will hold the last item updated so we can 
    // highlight in interface
    public _lastUpdated: any;

    private map: any;
    private mapOptions: any;

    // flags for spinners
    public mapLoading: boolean = false;
    public gettingLocation: boolean = false;

    // array of colors
    public arrayOfColors = SettingsStatic.arrayOfColors;
    //public markerColors = ['red', 'green', 'blue', 'yellow', 'purple'];

    // constructor
    constructor(public STATE: MapPageState, public navCtrl: NavController, private T: Toast, private Comm: CommService, private Drawing: DrawingService, private PavingItem: PavingItemModel, private PavingItemService: PavingItemService, private Menu: MenuController, private Zone: NgZone, private LOG: LogService) {

        console.info('MapPage constructor. initialized =', this.STATE.initialized);

        this.mapOptions = SettingsStatic.mapOptions;
        this.mode = MapPageMode.List;
        // ionViewLoaded() will fire as well.

        this.LOG.log('Device.device', Device.device);
    }

    // fired from the form (child directive)
    public EditComplete_Hook(b) {
        console.log('MapPage editComplete', b);

        DrawingService.setEditable(this._currentObject, false);

        this._currentObject = null;
        this.mode = MapPageMode.List;

        this._lastUpdated = b;
    }

    // Center on current location
    public Recenter_Click() {
        console.info('MapPage Recenter_Click()');

        let forceRecenter = true;
        this.loadMap(forceRecenter);
    }

    // Reframe to show all drawingObjects
    public DisableReframe() {
        return this.STATE.itemsList.length == 0;
    }
    public Reframe_Click() {
        console.info('MapPage Reframe_Click()')
        DrawingService.CenterOnDrawingObjects(this.map, this.STATE.itemsList);
    }

    public AddDrawingObject_Click(letter) {
        if (letter == 'M') this.addMarker();
        else if (letter == 'L') this.startPolyline();
        else if (letter == 'P') this.startPolygon();
    }

    public ChangeColor_Click(color) {

        if (this._currentObject) {

            DrawingService.setColor(this._currentObject, color);

            this.updateColor(this._currentObject, color);
        }
    }

    // finish draw, don't open details
    public EditComplete_Click() {
        console.log('EditComplete_Click')

        // save any changes;
        this.updatePath(this._currentObject);
        this.updateQuantity(this._currentObject);

        // clear events and set as not editble/dragable
        google.maps.event.clearListeners(this.map, 'click');
        DrawingService.setEditable(this._currentObject, false);

        this._currentObject = null;
        this.mode = MapPageMode.List;
    }

    // finish draw and open details
    public EndDrawingEdit_Click() {
        console.log('EndDrawingEdit_Click')

        // save any changes;
        this.updatePath(this._currentObject);
        this.updateQuantity(this._currentObject);

        // clear events and set as not editble/dragable
        google.maps.event.clearListeners(this.map, 'click');
        DrawingService.setEditable(this._currentObject, false);

        this.Menu.open('right');
    }

    public PavingItemList_Click(item) {
        console.info('MapPage PavingItemList_Click()')

        this.openItem(item);
    }

    public DeleteButton_Click() {
        if (confirm('Are you sure you want to delete?')) {
            this.delete(this._currentObject);
        }
    }

    public floatMessage: string = "";
    throttle: boolean = false;
    public FloatMessage() {

        // throttled...
        if (this.throttle) return this.floatMessage;

        console.log('changing message...')
        this.throttle = true;

        var msg = '';
        if (this._currentObject) {

            // just starting a shape
            if (!this._currentObject.acgo) {
                msg = "...";
            }
            else {
                msg = 'Editing ';

                if (this._currentObject.acgo.drawingObjectType == DrawingObjectType.MARKER) msg += 'Marker';
                if (this._currentObject.acgo.drawingObjectType == DrawingObjectType.POLYGON) msg += 'Polygon';
                if (this._currentObject.acgo.drawingObjectType == DrawingObjectType.POLYLINE) msg += 'Line';

                if (this._currentObject.acgo.name) msg += ": " + this._currentObject.acgo.name;

                if (this._currentObject.getPath) {
                    console.log('trigger GetQuantity from FloatMessage');
                    var q = DrawingService.GetQuantity(this._currentObject);
                    msg += ' (' + q + ' ' + this._currentObject.acgo.unit + ')';
                }
            }
        }

        window.setTimeout(() => {
            this.throttle = false;
        }, 2000);

        return msg;
    }

    public filterChanged() {
        console.log("FILTER CHANGED: " + this.STATE.filter);

        for (let item of this.STATE.itemsList) {
            if (!this.STATE.filter || this.STATE.filter == item.acgo.identificationType) {
                item.setMap(this.map);
            } else {
                item.setMap(null);
            }
        }
    }


    addMarker() {
        console.info('MapPage addMarker()');

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

            // get path from marker object           
            pavingItem.path = DrawingService.GetPathString(marker);

            // add event listener (updates coords on dragend)
            google.maps.event.addListener(marker, 'dragend', (v) => {
                this.updatePath(marker)
            });

            // set current project ID (if applicable)
            if (MapPageState.CurrentProjectId > 0) pavingItem.project = MapPageState.CurrentProjectId;

            // Save to server 
            this.PavingItemService.Save(pavingItem).then(
                (res) => {

                    // associate marker with data
                    marker.acgo = res;

                    this.Comm.setPavingItem(pavingItem); // send to comm!

                    this.STATE.itemsList.splice(0, 0, marker); // push item to top of list

                    this._currentObject = marker;
                    this.mode = MapPageMode.EditItem;
                },
                (err) => {
                    this.T.toast('!! error creating item !! ' + err);
                    console.error('error creating item', err);
                });



        } catch (ex) {
            this.T.toast('error creating marker:' + ex);
        }
    }

    startPolyline() {
        console.info('MapPage startPolyline()')

        try {

            let polyline = DrawingService.GetPoyline(this.map);
            this._currentObject = polyline;
            DrawingService.setEditable(polyline);

            // (click) listener
            polyline.addListener('click', (ev) => {
                console.log('polyline clicked');

                this.Zone.run(() => {
                    this.handleDrawingObjectClick(polyline, ev);
                });
            });
            // (dragend) listener
            polyline.addListener('dragend', () => {
                console.log('polyline dragend');
                this.updatePath(polyline);
            });


            let pavingItem = new PavingItemModel(1);


            // Save to server 
            this.PavingItemService.Save(pavingItem).then((res) => {

                console.log('new item created');
                // associate marker with data
                polyline.acgo = res;

                this.Comm.pavingItem = polyline.acgo; // load in form

                this.STATE.itemsList.splice(0, 0, polyline); // push item to top of list

                //this.T.toast('Click on the map to draw your polyline.')

                google.maps.event.addListener(this.map, 'click', (v) => {
                    // push new path point
                    var path = polyline.getPath();
                    path.push(v.latLng);
                    polyline.setPath(path);
                    // save changes to DB
                    //this.updatePath(polyline);
                    //this.updateQuantity(polyline);
                });

                this._currentObject = polyline;
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

    startPolygon() {
        console.info('MapPage startPolygon()')

        let polygon = DrawingService.GetPolygon(this.map);
        this._currentObject = polygon;
        DrawingService.setEditable(polygon);

        polygon.addListener('click', (ev) => {
            console.log('polygon clicked');

            this.Zone.run(() => {
                this.handleDrawingObjectClick(polygon, ev);
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

            //this.T.toast('Click on the map to draw your polygon.')

            google.maps.event.addListener(this.map, 'click', (v) => {
                // push new path point
                var path = polygon.getPath();
                path.push(v.latLng);
                polygon.setPath(path);
            });

            this._currentObject = polygon;
            this.mode = MapPageMode.EditItem;
        },
            (err) => {
                this.T.toast('Error saving polygon')
            });
    }

    addShapeEditEvents(drawingObject) {
        drawingObject.getPaths().forEach(function (path, index) {

            google.maps.event.addListener(path, 'insert_at', function () {
                // New point
                this.updateQuantity(this._currentObject);
                this.FloatMesage();
            });

            google.maps.event.addListener(path, 'remove_at', function () {
                // Point was removed
                this.updateQuantity(this._currentObject);
                this.FloatMesage();
            });

            google.maps.event.addListener(path, 'set_at', function () {
                // Point was moved
                this.updateQuantity(this._currentObject);
                this.FloatMesage();
            });

        });

        google.maps.event.addListener(drawingObject, 'dragend', function () {
            // Polygon was dragged
            this.updateQuantity(this._currentObject);
            this.FloatMesage();
        });
    }

    // Wait for ionic, then load the map
    ionViewLoaded() {
        console.info('MapPage ionicViewLoaded()')
        //if (!MapPage.initialized) 
        this.loadMap(); // load first time only??
        this.filterChanged(); // show hide objects based on filter, which may have changed on another page
    }

    // decide to use last known location/zoom, or current loc of device
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

                else {
                    console.log('creating map from current location')
                    // get current location and use that

                    this.gettingLocation = true;

                    //load from current device location
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

    // go to database and load all shapes, then add them to the map
    loadData() {
        console.log('MapPage loadData()');
        console.log('MapPage loadData(): MapPageState.CurrentProjectId = ' + MapPageState.CurrentProjectId);

        var projectId = MapPageState.CurrentProjectId;

        this.PavingItemService.Get(projectId).then((d: any[]) => {

            console.log('MapPage data recvd: ', d);

            this.STATE.itemsList = [];

            d.forEach((item) => {
                var drawingObject;
                let pavingItem: PavingItemModel = item;
                console.log('restoring item...', item);

                if (item.drawingObjectType == DrawingObjectType.MARKER) {
                    drawingObject = DrawingService.GetMarker(this.map, item.path);
                    DrawingService.setColor(drawingObject, item.color);
                }
                else if (item.drawingObjectType == DrawingObjectType.POLYLINE) {
                    drawingObject = DrawingService.GetPoyline(this.map, item.path, item.color);
                }
                else {
                    drawingObject = DrawingService.GetPolygon(this.map, item.path, item.color);
                }

                drawingObject.addListener('click', (ev) => {
                    this.handleDrawingObjectClick(drawingObject, ev);
                })

                drawingObject.acgo = pavingItem;

                this.STATE.itemsList.push(drawingObject);
            });

        }).catch((err) => { 'error getting data', err });
    }



    // Actually creates the map using the DIV#map 
    // - adds the bounds_changed listener
    createMap() {
        console.log('creating map: ', this.mapOptions);

        this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);

        this.map.setTilt(0); // eliminate 45 degree mode


        // listen for changes to the center, and store that value in the MapPageState
        google.maps.event.addListener(this.map, 'bounds_changed', () => this.onBoundsChanged(this));

        // a click listener we can reuse for editing shapes
        //google.maps.event.addListener(this.map, 'mouseup', this.onMapClick);

        // re-draw makers from STATE
        this.loadData();

        this.mapLoading = false;
    }


    // MAP event - when map bounds change, save the values in the STATE
    onBoundsChanged(ctrl: MapPage) {
        ctrl.STATE.center = {
            lat: ctrl.map.getCenter().lat(),
            lng: ctrl.map.getCenter().lng()
        }
        console.log('bounds_changed:', ctrl.STATE.center);
        ctrl.STATE.zoom = ctrl.map.getZoom();
    }

    openItem(item) {
        console.log('openItem > triggers updateQuantity')
        console.log('opening item', item);

        if (this._currentObject != null) {
            // save any changes to shape
            this.updatePath(this._currentObject);
            this.updateQuantity(this._currentObject);

            DrawingService.setEditable(this._currentObject, false);
        }

        this._currentObject = item;

        DrawingService.setEditable(this._currentObject);

        DrawingService.CenterOnDrawingObject(this.map, this._currentObject);

        if (this._currentObject.acgo.drawingObjectType == DrawingObjectType.MARKER) {
            this._currentObject.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => {
                this._currentObject.setAnimation(google.maps.Animation.NONE);
            }, 2000);
        }

        this.Comm.setPavingItem(item.acgo);

        this.Zone.run(() => {
            this.mode = MapPageMode.EditItem;
        })

    }


    handleDrawingObjectClick(drawingObject, ev?: any) {
        console.log('handleDrawingObjectClick > triggers updateQuantity')
        console.log('handleDrawingObjectClick:', drawingObject);
        console.log('handleDrawingObjectClick event:', ev);

        if (this.mode == MapPageMode.EditItem && this._currentObject != drawingObject) {
            console.log('> click IGNORED, add to path?...');
            if (this._currentObject.getPath) {
                var path = this._currentObject.getPath();
                path.push(ev.latLng);
                this._currentObject.setPath(path);
                this.updatePath(this._currentObject);
                this.updateQuantity(this._currentObject);
            }
            return;
        }
        this.openItem(drawingObject);
    }



    delete(drawingObject) {
        var data = { id: drawingObject.acgo.id, deleted: true }
        this.PavingItemService.Save(data).then(
            (res) => {
                console.log('item deleted');
                drawingObject.setMap(null);
                this.STATE.itemDeleted(drawingObject.acgo.id);
                this.mode = MapPageMode.List;
                //this.EditComplete_Hook(drawingObject.acgo.id);
                this._currentObject = null; // clear model
            },
            (err) => {
                this.T.toast('!! error saving item !!' + err)
                console.error('error saving item', err);
            });
    }

    //update color
    updateColor(drawingObject, color) {

        console.info('updatePath', drawingObject);

        var pathStr = DrawingService.GetPathString(drawingObject);

        this.PavingItemService.Save({ id: drawingObject.acgo.id, color: color }).then((res) => {
            console.log('item saved, pathStr=', pathStr);
            drawingObject.acgo.color = color;
        },
            (err) => {
                this.T.toast('!! error saving item !!' + err)
                console.error('error saving item', err);
            });
    }

    // handles the changing of paths (when DONE is clicked)
    // saves to db
    updatePath(drawingObject) {

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

    updateQuantity(drawingObject) {
        console.info('trigger GetQuantity from updateQuantity', drawingObject);
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

}