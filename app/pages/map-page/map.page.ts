import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SettingsService } from '../../services/settings.service';
import { LogService } from '../../services/log.service';
import { Backand } from '../../services/backand.service';
import { LocationService } from '../../services/location.service';
import { Toast } from '../../services/toast.service';
import { ItemForm } from '../../components/item-form/item-form.directive';

declare var google;

@Component({
  templateUrl: 'build/pages/map-page/map.page.html',
  directives: [ ItemForm ]
})
export class MapPage {

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    mapOptions = {
        center: null,
        zoom: this.SETTINGS.mapDefaultZoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
    };
    public markersList: any[] = [];

    constructor (
        public navCtrl: NavController,
        private location: LocationService,
        private SETTINGS: SettingsService,
        private T: Toast) {
        
        console.info('MapPage constructor');
    }

    ionViewLoaded() {
        console.info('MapPage ionicViewLoaded()')

        this.location.getCurrentPosition().then((v) => {
            let latLng = new google.maps.LatLng(v.coords.latitude, v.coords.longitude);
            this.mapOptions.center = latLng;
                this.loadMap();
            });
    }

    loadMap() {
        console.info('MapPage loadMap()')
        
        try {
            this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
        } catch (ex) {
            this.T.toast('error creating map:' + ex);
        }
    }

    public addMarker_Click() {
        console.info('MapPage addMarker()')

        try {
            let marker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: this.map.getCenter(),
                draggable: true
            });

            marker.id = "." + new Date();
            this.markersList.splice(0,0,marker); // push item to top of list
    
            let content = "<h4>Information!</h4>";          
    
            this.addInfoWindow(marker, content);
        } catch (ex) {
            this.T.toast('error creating marker:' + ex);
            
        }
    }

    public addPolyline_Click() {
        console.info('MapPage addPolyline()')

        let marker = new google.maps.Polyline({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.map.getCenter(),
            draggable: true
        });
    }
    public addPolygon_Click() {
        console.info('MapPage addPolygon()')

    }

    addInfoWindow(marker, content) {
 
        let infoWindow = new google.maps.InfoWindow({
            content: content
        });
        
        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });
        
        }

}