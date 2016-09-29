import { Injectable } from '@angular/core';

declare var google;

@Injectable()
export class DrawingService {
    
    constructor() {
        console.info('DrawingService constructor');
    }

    public static GetMarker (map) :any {
        let marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: map.getCenter(),
            draggable: true
        });

        return marker;
    }

    public static GetPoyline (map) :any {
        return new google.maps.Polyline({
            map: map,
            animation: google.maps.Animation.DROP,
            path: [ ],
            draggable: true,
            editable: true
        });
    }
    
    public static GetPolygon (map) :any {
        return new google.maps.Polygon({
            map: map,
            animation: google.maps.Animation.DROP,
            path: [ ],
            draggable: true,
            editable: true
        });
    }
}