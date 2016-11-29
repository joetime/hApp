import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { CameraService } from '../../services/camera.service';

import { SettingsService } from '../../services/settings.service';
import { LogService } from '../../services/log.service';
import { Backand } from '../../services/backand.service';
import { LocationService } from '../../services/location.service';
import { Toast } from '../../services/toast.service';
import { CommService } from '../../services/comm.service';
import { MapPageState } from '../map-page/map.page.state';
import { MapPage } from '../map-page/map.page';
import { WalgreensProjectService } from '../../services/walgreens-project.service';
import { FileService } from '../../services/file.service';

@Component({
    templateUrl: 'build/pages/home-page/home.page.html',
    directives: []
})
export class HomePage {
    constructor(
        private nav: NavController,
        private WG: WalgreensProjectService,
        private alertCtrl: AlertController,
        private camera: CameraService,
        private fileService: FileService,
        private toast: Toast,
        private mapPageState: MapPageState
    ) { }

    public static page: string;
    get page() { return HomePage.page }
    set page(v) {
        console.log('page value changed:', v);
        HomePage.page = v;
        this.mapPageState.filter = v;
    }

    public static walgreensProjects: any[];
    get walgreensProjects() { return HomePage.walgreensProjects }

    public static projectData: any;
    get projectData() { return HomePage.projectData }

    public static zones: any;
    get zones() { return HomePage.zones }


    // executed on page load 
    ionViewLoaded() {
        console.info('MapPage ionicViewLoaded()')

        // runs first time only
        if (!HomePage.page) {
            this.loadProjects(); // load first time only??
            HomePage.page = 'Main';
            HomePage.walgreensProjects = [];
            HomePage.projectData = {}
            HomePage.zones = [];
        }
        else if (HomePage.projectData.id) {
            // refresh with updates from edits on map page
            this.calculatePercentage();

            this.WG.GetZones(HomePage.projectData.id).then((zs: any[]) => {
                HomePage.zones = zs;
                this.zonesStaticMapString = this.getStaticMapString(zs);
                HomePage.projectData.totalPavedArea = this.zonesSum;
            });
        }

    }


    loadProjects() {
        this.WG.Get().then((ps: any[]) => {
            console.log('projects: ', ps);
            HomePage.walgreensProjects = ps;
        });
    }


    public SaveProject_Click() {
        console.log('SaveProject_Click()');

        this.WG.Save(HomePage.projectData).then((p) => {
            console.log(p);
            HomePage.projectData = p;
        });

    }

    public CloseProject_Click() {
        console.log('CloseProject_Click()... saving first');
        // close the project (saveing changes), then refresh the list
        // if it was a NEW project, we check to make sure user wants to throw out changes

        if (HomePage.projectData.id > 0) {
            this.WG.Save(HomePage.projectData).then((p) => {
                console.log(p);
                HomePage.projectData = {};
                this.loadProjects(); // refresh list
            });

        } else {

            let alert = this.alertCtrl.create({
                title: 'Confirm',
                message: 'Throw out changes to this new project?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Throw out',
                        handler: () => {
                            console.log('Throw out clicked');
                            HomePage.projectData = {};
                            this.loadProjects(); // refresh list
                        }
                    }
                ]
            });
            alert.present();
        }
    }

    public Archive_Click(item) {
        item.deleted = true;
        this.WG.Save(item).then((p) => {
            console.log(p);
            HomePage.walgreensProjects.splice(HomePage.walgreensProjects.indexOf(item), 1);
        });
    }

    // select a project to load.
    public SelectItem_Click(item) {
        this.mapPageState.testMessage = 'Walgreens: #' + item.storeNumber;
        MapPageState.CurrentProjectId = item.id;
        HomePage.projectData = item;
        this.calculatePercentage();

        this.WG.GetZones(item.id).then((zs: any[]) => {
            HomePage.zones = zs;
            this.zonesStaticMapString = this.getStaticMapString(zs);
            HomePage.projectData.totalPavedArea = this.zonesSum;
        });
    }


    public zonesStaticMapString = "";
    public zonesSum = 0;
    // also sets fillcolor, parses path, and totals SF
    private getStaticMapString(lst: any[]): string {
        var str = "https://maps.googleapis.com/maps/api/staticmap?zoom=19&maptype=satellite&size=1000x600&key=AIzaSyBjS2gPMkLwIK6o6CyW3d0syamWkf5sdgw";

        if (lst.length == 0) {
            return str + '&center=' + this.projectData.address;
        }
        else {
            for (let z of lst) {
                console.log(z);

                this.zonesSum += z.quantity;

                var fillcolor = "AAAAAA"; // gray as default
                if (z.type == "Primary")
                    fillcolor = "AA0000";
                else if (z.type == "Secondary")
                    fillcolor = "AAAA00";

                z.fillcolor = fillcolor;

                var zStr = "&path=fillcolor:0x" + fillcolor + "33%7Ccolor:0x" + fillcolor + "ff|weight:2";
                for (let p of z.pathParsed) {
                    console.log(p);
                    zStr += "|" + p.lat + "," + p.lng;
                }
                // repeat the last point to close the polygon
                zStr += "|" + z.pathParsed[0].lat + "," + z.pathParsed[0].lng;
                str += zStr;
            }
            return str;
        }
    }

    // save before switching pages
    public OpenZones_Click() {
        console.log('OpenZones_Click()');

        this.WG.Save(HomePage.projectData).then((p) => {
            console.log(p);
            HomePage.projectData = p;
            this.WG.GetZones(p.id).then((zs: any[]) => {
                HomePage.zones = zs;
                this.zonesStaticMapString = this.getStaticMapString(zs) // refresh static map
            });
            this.page = "Zone"; // switch page
        });


    }

    // save changes when tab switches
    public PageChange_Click() {
        console.log('PageChange_Click()');

        this.WG.Save(HomePage.projectData).then((p) => {
            console.log(p);
            HomePage.projectData = p;
        });
    }


    public NewProject_Click() {
        HomePage.projectData = { id: -1, surveyDate: new Date() }; //assign a temporary id
        this.calculatePercentage();
    }

    // calculates the percentage
    public calculatePercentage() {
        console.log('calculating...');

        if (!HomePage.projectData.totalPavedArea || HomePage.projectData.totalPavedArea == 0) HomePage.projectData.totalRecommendedPercentage = 0;
        else if (!HomePage.projectData.totalRecommendedArea || HomePage.projectData.totalRecommendedArea == 0) HomePage.projectData.totalRecommendedPercentage = 0;
        else {
            HomePage.projectData.totalRecommendedPercentage =
                Math.floor(HomePage.projectData.totalRecommendedArea * 100 / HomePage.projectData.totalPavedArea);
        }
    }

    public thumbnail_Click(ev) {

        this.camera.getPicture().then((imageData) => {
            console.log(ev);
            ev.target.src = 'data:image/jpeg;base64,' + imageData;

            var fieldName = "coverPhoto";
            var filename = 'coverPhoto_' + HomePage.projectData.id + '.jpg';
            //this.model[fieldName] = 'uploading ' + index + '...';*/

            this.fileService.uploadFile(filename, imageData).then(
                (data) => {
                    this.toast.toast('upload success ' + filename);
                    //this.LOG.log('upload success', JSON.stringify(data));

                    // update the pavingItem record

                    //var saveMe = { id: this.model.id };
                    //saveMe[fieldName] = filename;

                    HomePage.projectData.coverPhoto = filename;

                    this.WG.Save(HomePage.projectData).then((res) => {
                        HomePage.projectData = res;
                    });
                },
                (err) => {
                    this.toast.toast('upload err: ' + JSON.stringify(err))
                    //this.LOG.error('upload err', JSON.stringify(err))
                }
            );

        }, (err) => {

            if (err == "no image selected") return; // not really an error

            this.toast.toast('Error accessing camera: ' + err);
            //ev.target.src = "//placehold.it/100x100/ffcc22";
        })
    }

    public gotoMap() {
        this.nav.push(MapPage);
    }

}