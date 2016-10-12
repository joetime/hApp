import { Injectable } from '@angular/core';

// let TS know about google
declare var google;

@Injectable()
export class SettingsStatic {

    constructor() { }

    // Deploy
    public updateServiceTimeout = 5000;

    // Log
    public logDelay: number = 3000;
    public logsPageSize = 50;

    // Geolocation
    public static GeolocationTimeout = 10000;

    // Google Maps
    public static mapDefaultZoom = 17;
    public static mapLoadDelay = 500;
    public static mapShowPoi = false;
    public static mapShowTransit = false;
    public static mapDefaultMarkerColor = 'blue'; // static for use in drawingservice

    public static mapOptions = {
        // default center/zoom shows all USA
        center: new google.maps.LatLng(37.07655337108474, -95.92028779999998),
        zoom: 4,

        mapTypeId: google.maps.MapTypeId.ROADMAP,

        // controls
        scaleControl: true,
        rotateControl: true,
        //disableDefaultUI: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },

        // turn off/on stuff
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [
                    { visibility: SettingsStatic.mapShowPoi ? "on" : "off" }
                ]
            },
            {
                featureType: 'transit',
                stylers: [
                    { visibility: SettingsStatic.mapShowTransit ? "on" : "off" }
                ]
            },
        ]
    };

}