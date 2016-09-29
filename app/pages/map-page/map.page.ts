import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// Services
import { SettingsService } from '../../services/settings.service';
import { LogService } from '../../services/log.service';
import { Backand } from '../../services/backand.service';
import { LocationService } from '../../services/location.service';
import { Toast } from '../../services/toast.service';
import { CommService } from '../../services/comm.service';
import { DrawingService } from '../../services/drawing.service';
// Directive
import { ItemForm } from '../../components/item-form/item-form.directive';

// lets ts know we have a google variable
declare var google;

import { MapPageState, MapPageMode } from './map.page.state'; // a state service for this controller

@Component({
  templateUrl: 'build/pages/map-page/map.page.html',
  directives: [ ItemForm ]
})
export class MapPage {

    MapPageMode = MapPageMode; // allows us to use enum in template

    @ViewChild('map') mapElement: ElementRef;
    
    map: any;
    mapOptions: any;
    mapLoading: boolean = false;
    gettingLocation: boolean = false;

    constructor (
        public STATE: MapPageState,
        public navCtrl: NavController,
        private location: LocationService,
        private SETTINGS: SettingsService,
        private T: Toast,
        private Comm: CommService,
        private Drawing: DrawingService) {
        
        console.info('MapPage constructor. initialized =', this.STATE.initialized);
        // ionViewLoaded() will fire as well.
        this.mapOptions = this.SETTINGS.mapOptions; 
    }

    // # Map Init, refresh
    public recenter_Click() {

        let forceRecenter = true;
        this.loadMap(forceRecenter);
    }
    
    // Wait for ionic, then load the map
    ionViewLoaded() {
        console.info('MapPage ionicViewLoaded()')
        //if (!MapPage.initialized) 
        this.loadMap(); // load first time only??
    }

    // dicide to use last known location/zoom, or current loc of device
    // sends proper mapOptions to createMap()
    loadMap(forceRecenter:boolean = false) {
        console.info('MapPage loadMap()')
        
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

                }, this.SETTINGS.mapLoadDelay); 
            } 
            // get current location and use that
            else {
                console.log('creating map from current location')
                
                this.gettingLocation = true;

                // load from current device location
                this.location.getCurrentPosition().then((v) => {
                    var latLng = new google.maps.LatLng(v.coords.latitude, v.coords.longitude);
                    this.mapOptions.center = latLng;
                    this.mapOptions.zoom = this.SETTINGS.mapDefaultZoom
                    this.createMap();
                    this.STATE.initialized = true;
                    this.gettingLocation = false;
                },
                // if rejected, load a default map state
                (rejected) => {
                    this.T.toast('could not get location :( - ' + rejected)
                    this.createMap();
                    this.STATE.initialized = true;
                    this.gettingLocation = false;
                });
            }

        } catch (ex) {
            this.T.toast('error creating map:' + ex);
            this.mapLoading = false;
        }
    }

    // Actually creates the map using the DIV#map 
    // - adds the bounds_changed listener
    private createMap () {
        console.log('creating map: ', this.mapOptions);
        
        this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);

        // listen for changes to the center, and store that value in the MapPageState
        google.maps.event.addListener(this.map, 'bounds_changed', () => this.onBoundsChanged(this));

        // re-draw makers from STATE
        this.restoreShapes();

        this.mapLoading = false;
    }

    // when map bounds change, save the values in the STATE
    private onBoundsChanged (ctrl:MapPage) {
        ctrl.STATE.center = {
            lat: ctrl.map.getCenter().lat(),
            lng: ctrl.map.getCenter().lng()
        }
        console.log('bounds_changed:', ctrl.STATE.center);
        ctrl.STATE.zoom = ctrl.map.getZoom();
    }

    
    // # Markers

    public addMarker_Click() {
        console.info('MapPage addMarker()')

        try {
            let marker = this.Drawing.GetNewMarker(this.map);

            marker.id = "." + new Date();
            this.STATE.markersList.splice(0,0,marker); // push item to top of list
    
            this.STATE.mode = MapPageMode.EditItem;

        } catch (ex) {
            this.T.toast('error creating marker:' + ex);
        }
    }

    public addPolyline_Click() {
        console.info('MapPage addPolyline()')

        let polyline = new google.maps.Polyline({
            map: this.map,
            animation: google.maps.Animation.DROP,
            path: [ ],
            draggable: true,
            editable: true
        });

        polyline.id = "." + new Date();
        this.STATE.markersList.splice(0,0,polyline); // push item to top of list

        this.T.toast('Click on the map to draw your polyline.')

        google.maps.event.addListener(this.map, 'click', (v) => {
            var path = polyline.getPath();
            path.push(v.latLng);
            polyline.setPath(path);
        });

        this.STATE.mode = MapPageMode.EditItem;
    }

    public addPolygon_Click() {
        console.info('MapPage addPolygon()')
        
        let polygon = new google.maps.Polygon({
            map: this.map,
            animation: google.maps.Animation.DROP,
            path: [ ],
            draggable: true,
            editable: true
        });

        polygon.id = "." + new Date();
        this.STATE.markersList.splice(0,0,polygon); // push item to top of list

        this.T.toast('Click on the map to draw your polygon.')

        google.maps.event.addListener(this.map, 'click', (v) => {
            var path = polygon.getPath();
            path.push(v.latLng);
            polygon.setPath(path);
            //polyline.setEditable(true);
        });

        this.STATE.mode = MapPageMode.EditItem;
    }

    public endEdit() {
        this.STATE.mode = MapPageMode.List;
        google.maps.event.clearListeners(this.map, 'click');
    }

    restoreShapes() {
        for (let entry of this.STATE.markersList) {
            console.log('redraw', entry);
            entry.setMap(this.map);
        }
    }


    /*
    //let content = "<h4>Information!</h4>";          
    //this.addInfoWindow(marker, content);
    // private addInfoWindow(marker, content) {
 
    //     let infoWindow = new google.maps.InfoWindow({
    //         content: content
    //     });
        
    //     google.maps.event.addListener(marker, 'click', () => {
    //         infoWindow.open(this.map, marker);
    //     });
        
    // }
    */
}