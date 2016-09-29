import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SettingsService } from '../../services/settings.service';
import { LogService } from '../../services/log.service';
import { Backand } from '../../services/backand.service';
import { LocationService } from '../../services/location.service';
import { Toast } from '../../services/toast.service';
import { CommService } from '../../services/comm.service';
import { MapPage } from '../map-page/map.page';


@Component({
  templateUrl: 'build/pages/home-page/home.page.html',
  directives: [ ]
})
export class HomePage {
    constructor(
        private nav:NavController
    ) {}

    public Resume_Click() {
        this.nav.setRoot(MapPage);
    }
}