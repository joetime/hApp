import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { UpdateService } from '../../services/update.service';
import { LogService } from '../../services/log.service';
import { LocationService } from '../../services/location.service';
import { CameraService } from '../../services/camera.service';
import { Toast } from '../../services/toast.service';
import { FileService } from '../../services/file.service';
import { Backand } from '../../services/backand.service';

@Component({
    templateUrl: 'build/pages/system-page/system.page.html'
})
export class SystemPage {

    constructor(
        private updateService: UpdateService,
        private logService: LogService,
        private locationService: LocationService,
        private cameraService: CameraService,
        private Toast: Toast,
        private File: FileService,
        private BK: Backand) { }

    // for debug
    private testUpdate: Boolean = false;

    //# ExceptionHandler
    public testExceptionHandler_Click(ev, nothingHere) {
        try {
            nothingHere.notAFunction();
        } catch (ex) {
            this.Toast.toast('exception caught:' + ex);
        }
    }

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

    //# Test Upload 
    public userEnteredFileName = 'joetest.jpg';
    public uploadMessage = "";
    public testUpload_Click(type: string) {
        this.uploadMessage = "...";

        var data = type == 'pic' ? this.getTestPictureData() : "test123 this is a test!"

        this.File.uploadFile(this.userEnteredFileName, data).then(
            (resp) => {
                console.log(resp)
                this.uploadMessage = 'SUCCESS! ' + JSON.stringify(resp);
            },
            (err) => {
                console.log(err);
                this.uploadMessage = 'ERROR!' + JSON.stringify(err);
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

        LocationService.getCurrentPosition().then((resp) => {
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

    public getTestPictureData() {
        return "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"
    }

    public clearDB_Click() {
        this.BK.clearDB().subscribe();
    }
}