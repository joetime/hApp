import { Injectable } from '@angular/core';

declare var google;

@Injectable()
export class DrawingService {
    
    constructor() {
        console.info('DrawingService constructor');
    }

    public GetNewMarker (map) {
        let marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: map.getCenter(),
            draggable: true
        });

        return marker;
    }


}