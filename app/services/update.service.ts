import { Injectable } from '@angular/core';
import { Deploy } from '@ionic/cloud-angular';
import { SettingsService } from './settings.service'; //

@Injectable()
export class UpdateService {

    constructor(private deploy: Deploy, private settings:SettingsService) {
        console.log('UpdateService constructor()')
        //deploy.getMetadata().then((val) => console.log(val));
    }

    // check for update 
    public check(test: Boolean = false) : Promise<Boolean> {

        console.log('UpdateService check()');
         
        var resolved: Boolean = false;

        return new Promise((resolve, reject) => {

            if (test) {
                setTimeout(()=> {
                    resolve(true);
                }, 2000);
            }
            else {
                this.deploy.check().then((snapshotAvailable: boolean) => {
                    resolve(snapshotAvailable);
                    resolved = true;
                }, (reason) => { 
                    reject(reason);
                    resolved = true;
                });

                window.setTimeout(() => {
                    if (!resolved)
                    reject('service not available');
                }, this.settings.updateServiceTimeout);
            }
        });
    }

    // download and update
    public doUpdate() {
        this.deploy.download().then(() => {
        
            return this.deploy.extract().then(() => {
                this.deploy.load();
            });
        });
    }
}

// if (!snapshotAvailable) resolve(false); // no update needed
//                 else {
//                     this.deploy.download().then(() => {
//                         this.deploy.extract().then(() => {
//                             resolve(true);
//                         });
                    
//                 });
    //     var deferredResult: promise.deferredResult<Customer>;
    //     deferredResult = P.defer<Customer>();

    //     console.log('checkForUpdate()')
    //     this.deploy.check().then((snapshotAvailable: boolean) => {

    //   // When snapshotAvailable is true, you can apply the snapshot
    //   if (snapshotAvailable) { 
    //     //this.toastThis('new version available. One moment...')
    //     this.doUpdate();
    //   }
    //   else this.toastThis('software up to date :)');
    // }, err => {
    //   console.log(err)
    //   //this.toastThis('rejected ' + reason);
    // });
    
//}
