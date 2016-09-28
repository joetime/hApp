import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { UpdateService } from '../../services/update.service';
import { LogService } from '../../services/log.service';
import { LocationService } from '../../services/location.service';
import { CameraService } from '../../services/camera.service';

@Component({
  templateUrl: 'build/pages/system-page/system.page.html'
})
export class SystemPage {

    constructor (
        private updateService: UpdateService, 
        private logService: LogService, 
        private locationService: LocationService,
        private cameraService: CameraService) {}

    // for debug
    private testUpdate: Boolean = false;
    
    //# Camera
    //UI flags
    public gettingPicture = false;
    public pictureSuccess = false;
    public cameraNotAvailable = false;
    public pictureFail = false;
    public pictureData: any = {};
    public base64Image;
    // Actions
    public testCamera_Click() {
        console.info('testCamera_Click()'); 
        
        this.pictureSuccess = false;
        this.pictureFail = false;
        this.cameraNotAvailable = false;
        this.pictureData = "";
        this.gettingPicture = true;

        this.cameraService.getPicture().then((imageData) => { 
            console.log('testCamera_Click() resp =>', imageData);
            this.gettingPicture = false;
            this.pictureSuccess = true; 
            this.pictureData = imageData;
            this.base64Image = 'data:image/jpeg;base64,' + imageData;
            
        }, (err) => {
            
            if (err == "cordova_not_available") {
                this.cameraNotAvailable = true;
            }
            else {
                console.error('testCamera_Click() err =>', err);      
                this.pictureFail = true;
            }
            this.gettingPicture = false;   
        });
    }





    //# Geolocation
    //UI flags
    public gettingLocation = false;
    public locationSuccess = false;
    public locationFail = false;
    public locationString: any = {};
    // Actions
    public testLocation_Click() {
        console.info('testLocation_Click()'); 
        
        this.locationSuccess = false;
        this.locationFail = false;
        this.locationString = "";
        this.gettingLocation = true;

        this.locationService.getCurrentPosition().then((resp) => { 
            console.log('testLocation_Click() resp =>', resp);
            this.gettingLocation = false;
            this.locationSuccess = true;
            this.locationString = resp.coords.latitude + ", " + resp.coords.longitude + ". acc:" + resp.coords.accuracy;
            
        }, (err) => {
            console.error('testLocation_Click() err =>', err);
            this.gettingLocation = false;         
            this.locationFail = true;   
        });
    }


    //## Logs
    // UI flags
    public testingLog: Boolean = false;
    public logSuccess: Boolean = false;
    public logFail: Boolean = false;
    // Actions
    public testLog_Click(ev) {
        console.log('testLog_Click ');

        this.testingLog = true;
        this.logSuccess = false;
        this.logFail = false;

        this.logService.log("testing 123", { test: 123 }).then((res) => {
            console.log('testLog_Click success', res);
            this.testingLog = false;
            this.logSuccess = true;
        }, (err) => {
            this.testingLog = false;
            this.logFail = true;
            console.log('testLog_Click fail', err);
        });
    }


    //## Deploy services
    // UI flags
    public needsUpdate: Boolean = false;
    public checkedForUpdate: Boolean = false;
    public checking: Boolean = false;
    public deployNotAvailable: Boolean = false;
    // Actions
    public checkForUpdate_Click(ev) {
        console.log('SystemPage checkForUpdate_Click()');

        // reset status vals before calling
        this.needsUpdate = false;
        this.checking = true;
        this.deployNotAvailable = false;

        // use the 'updateService' to check for availbale updates
        this.updateService.check(this.testUpdate).then((needsUpdate) => {
            console.log('=', needsUpdate);
            
            this.needsUpdate = needsUpdate;
            this.checkedForUpdate = true;
            this.checking = false;
        }, 
        (err) => { 
            console.log('=rejected:', err);
            this.checkedForUpdate = true;
            this.checking = false;
            this.deployNotAvailable = true;
        });   
    }

    public doUpdate() {
        this.updateService.doUpdate();
    }
}



//   private doUpdate() {
//     this.deploy.download().then(() => {
//       this.toastThis('downloaded');

//       return this.deploy.extract().then(() => {
//         this.toastThis('extracted. loading....')
//         this.deploy.load();
//       });

//     });
//   }
//   private toastThis(msg: string) {
//     console.log(msg);
//     let toast = this.toastCtrl.create({
//       message: msg,
//       duration: 3000
//     });
//     toast.present();
//   }
//}