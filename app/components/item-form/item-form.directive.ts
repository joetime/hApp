import { Component, Input, Directive } from '@angular/core';
import { PopoverController } from 'ionic-angular';

import { PavingItemModel } from '../../models/item.model';
import { CameraService } from '../../services/camera.service';
import { Toast } from '../../services/toast.service';
import { OptionsService } from '../../services/options.service';
import { CommService } from '../../services/comm.service';

@Component({
    //moduleId: 'someId',
    templateUrl: 'build/components/item-form/item-form.directive.html',
    selector: 'item-form'
})
export class ItemForm {

    constructor(
        private camera:CameraService, 
        private T: Toast,
        public popoverCtrl: PopoverController,
        public Options: OptionsService, 
        private Comm: CommService) {

        console.info('ItemForm constructor');
    }
    public model: PavingItemModel = this.Comm.pavingItem;      // for the UI
    

    public idTypeOptions = this.Options.identificationTypeOptions;

    types = ['ADA', 'Repair', 'Maintenance', 'Other']
    //model = new PavingItemModel();
    submitted = false;

    OnSubmit () { this.submitted = true; }

    

    public thumbnail_Click(ev) {

        ev.target.src = "//placehold.it/100x100/ffcc22";
        
        this.camera.getPicture().then((imageData) => {
            console.log(ev);
            ev.target.src = 'data:image/jpeg;base64,' + imageData;

        }, (err) => {

            if (err == "no image selected") return; // not really an error

            this.T.toast('Error accessing camera: ' + err);
            ev.target.src = "//placehold.it/100x100/ffcc22";
        })
    }


    get diagnostic() { return JSON.stringify(this.model); }

}
