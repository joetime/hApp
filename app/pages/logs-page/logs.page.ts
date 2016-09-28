import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SettingsService } from '../../services/settings.service';
import { LogService } from '../../services/log.service';
import { Backand } from '../../services/backand.service';
//import { LocationService } from '../../services/location.service';
//import { CameraService } from '../../services/camera.service';

@Component({
  templateUrl: 'build/pages/logs-page/logs.page.html'
})
export class LogsPage {

    public logsList: any[] = [];

    constructor (
        public navCtrl: NavController, 
        private BK: Backand, 
        private LOG: LogService, 
        private SETTINGS: SettingsService) {
        
        this.init(null);
    }

    public doRefresh(refresher) {
        this.LOG.log('LogsPage doRefresh()', {});
        this.init(refresher);
    }

    private init(refresher: any) {
        console.log('LogsPage init()');

        this.BK.getLogs().subscribe((data) => {
            console.log('init data.data=>', data.data);
            this.logsList = data.data;
            if (refresher) refresher.complete();
        });
    }
}