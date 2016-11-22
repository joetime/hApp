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
    directives: []
})
export class HomePage {
    constructor(
        private nav: NavController
    ) { }

    public projectData = {
        totalPavedArea: 10000,
        storeNumber: 12345,
        address: '19 Woodland Ct, Kinnelon NJ 07405',
        surveyDate: '03/04/2016',
        surveyor: 'Joe Scala',
        recommendation: 'Repair',
        totalRecommendedArea: 3000,
        totalRecommendedPercentage: 0,
        totalParkingSpaces: 100,
        totalHandicappedSpaces: 10,
        twentyFourHours: true,
        approxAge: 12,
        pastRepairs: 'Hello world, this is a description of the repairs to this lot. Hello world, this is a description of the repairs to this lot. Hello world, this is a description of the repairs to this lot.'

    }

    public Resume_Click() {
        console.log('Resume_Click()');
        this.nav.setRoot(MapPage);
    }

    // public calculatePercentage() {
    //     console.log('calculating...');

    //     if (!this.projectData.totalPavedArea || this.projectData.totalPavedArea == 0) this.projectData.totalRecommendedPercentage = 0;
    //     else if (!this.projectData.totalRecommendedArea || this.projectData.totalRecommendedArea == 0) this.projectData.totalRecommendedPercentage = 0;
    //     else {
    //         this.projectData.totalRecommendedPercentage =
    //             this.projectData.totalRecommendedArea * 100 / this.projectData.totalPavedArea;
    //     }
    // }

}