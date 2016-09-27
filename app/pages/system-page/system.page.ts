import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ToastController } from 'ionic-angular';

import { UpdateService } from '../../services/update.service'
import { LogService } from '../../services/log.service'

@Component({
  templateUrl: 'build/pages/system-page/system.page.html'
})
export class SystemPage {

    constructor (private updateService: UpdateService, private logService: LogService) {}

    // for debug
    private testUpdate: Boolean = false;
    
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