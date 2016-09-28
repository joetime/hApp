import { Component, Input, Directive } from '@angular/core';
import { PavingItem } from '../../models/item.model';
import { CameraService } from '../../services/camera.service';
import { Toast } from '../../services/toast.service';

@Component({
    //moduleId: 'someId',
    templateUrl: 'build/components/item-form/item-form.directive.html',
    selector: 'item-form'
})
export class ItemForm {

    constructor(
        private camera:CameraService, 
        private T: Toast) {

        console.info('ItemForm constructor')
    }

    types = ['ADA', 'Repair', 'Maintenance', 'Other']
    model = new PavingItem(1, "Test Item", false, "ADA", "comments...");
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
