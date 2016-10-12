import { Injectable, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/subject';

import { MainMap } from './main.map';
import { MainTools } from './main.tools';

// The purpose of this class is to sync state across multiple components.
// It maintains subscriptions to events, and fires off items when appropriate

@Injectable()
export class MainCommService {
    componentName = 'MainCommService';

    MAP: MainMap;
    TOOLS: MainTools;

    // Observable string sources
    private missionAnnouncedSource = new Subject<string>();
    private missionConfirmedSource = new Subject<string>();

    // Observable string streams
    missionAnnounced$ = this.missionAnnouncedSource.asObservable();
    missionConfirmed$ = this.missionConfirmedSource.asObservable();

    announceMission(mission: string) {
        this.missionAnnouncedSource.next(mission);
    }
    confirmMission(astronaut: string) {
        this.missionConfirmedSource.next(astronaut);
    }



    // --------------------------------




    constructor() {
        console.info(this.componentName + ' constructor');
    }

    // Initializers
    public InitMap(component: MainMap) {
        console.log(this.componentName + ' initMap', component);
        this.MAP = component;
    }
    public InitTools(component: MainTools) {
        console.log(this.componentName + ' initTools', component);
        this.TOOLS = component;
    }



    // send command to map control: center!
    public SetMapToLocation(loc) {
        console.log(this.componentName + ' setMapToLocation', loc);
        this.MAP.CenterMap(loc);
    }

    // send command to map to create marker
    // default is center of map
    public CreateMarker(p: any = null): any {
        console.log(this.componentName + ' createMarker', p);
        // this.CreateMarker.emit(p);

        return this.MAP.CreateMarker(p);
    }

    // send command to map to create marker
    // default is center of map
    public StartPolyline(p: any = null): any {
        console.log(this.componentName + ' StartPolyline', p);

        return this.MAP.StartPoly('L');
    }

    // send command to map to create marker
    public StartPolygon(p: any = null): any {
        console.log(this.componentName + ' StartPolygon', p);

        return this.MAP.StartPoly('G');
    }

    // send command to map to create marker
    // default is center of map
    public EndObjectEdit(p: any = null): any {
        console.log(this.componentName + ' EndObjectEdit', p);
        this.TOOLS.EndObjectEdit();
        return this.MAP.EndObjectEdit();
    }

    public StartObjectEdit(p: any) {
        this.TOOLS.StartObjectEdit(p);
        this.MAP.StartObjectEdit(p);
    }

    public CancelObjectEdit(p: any = null): any {
        console.log(this.componentName + ' CancelObjectEdit', p);

        return this.MAP.CancelObjectEdit();
    }
}