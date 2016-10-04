import { Component, Input, Directive } from '@angular/core';
import { PopoverController } from 'ionic-angular';

import { PavingItemModel } from '../../models/paving-item.model';
import { CameraService } from '../../services/camera.service';
import { Toast } from '../../services/toast.service';
import { OptionsService } from '../../services/options.service';
import { CommService } from '../../services/comm.service';
import { PavingItemService } from '../../services/paving-item.service';
import { FileService } from '../../services/file.service';
import { LogService } from '../../services/log.service';

@Component({
    //moduleId: 'someId',
    templateUrl: 'build/components/item-form/item-form.directive.html',
    selector: 'item-form',
})
export class ItemForm {

    constructor(
        private camera:CameraService, 
        private T: Toast,
        public popoverCtrl: PopoverController,
        public Options: OptionsService, 
        private Comm: CommService,
        private PavingItemSvc: PavingItemService,
        private fileService: FileService, 
        private LOG: LogService) {

        console.info('ItemForm constructor');

        // defaults to sitework   
        this.typeOptions = this.Options.siteworkTypeOptions;     
        this.model.type = this.typeOptions[0];
        this.idTypeOptions = this.Options.identificationTypeOptions;
    }
    public model: PavingItemModel = this.Comm.pavingItem;      // for the UI
    
    public idTypeOptions: string[];
    public typeOptions:string[];

    // Switch the "type" options based on the primary type
    public identificationType_Change() {

        console.log('identificationType_Change [' + this.model.identificationType + ']');
        
        if (this.model.identificationType == "Zone") {
            this.typeOptions = this.Options.zoneTypeOptions;
        } else if (this.model.identificationType == "ADA") {
            this.typeOptions = this.Options.adaTypeOptions;
        } else {
            this.typeOptions = this.Options.siteworkTypeOptions
        }

        // default type to first option
        this.model.type = this.typeOptions[0];
    }

    public typeButton_Click(t) {
        console.log('typeButton_Click', t);
        this.model.type = t;
    }
    
    // handles failureMode changes
    public failureModeButton_Click(t) {
        this.model.failureMode[t] = !this.model.failureMode[t];
        console.log('model.failureMode', this.model.failureMode)
    }
    // handles cause changes
    public causeButton_Click(t) {

        this.model.cause[t] = !this.model.cause[t];
        console.log('model.cause', this.model.cause)
        
    }


    submitted = false;

    DoneButton_Click() {
        this.OnSubmit()
    }

    OnSubmit () { 
        // save the marker info?
        
        this.PavingItemSvc.Save(this.model).then((res) => {
            this.model = res;
        });
        this.submitted = true; 
    }

    public thumbnail_Click(ev, index) {

        //ev.target.src = "//placehold.it/100x100/ffcc22";
        
        this.camera.getPicture().then((imageData) => {
            console.log(ev);
            ev.target.src = 'data:image/jpeg;base64,' + imageData;

            var fieldName = "file" + index;
            var filename = 'pic_' + this.model.id + '_' + index + '.jpg';
            this.model[fieldName] = 'uploading ' + index + '...';

            this.fileService.uploadFile(filename, imageData).then(
                (data) => { 
                    this.T.toast('upload success ' + data);
                    this.LOG.log('upload success', JSON.stringify(data));

                    // update the pavingItem record
                    
                    var saveMe = { id: this.model.id };
                    saveMe[fieldName] = filename;

                    this.PavingItemSvc.Save(saveMe).then((res) => {
                        this.model[fieldName] = filename;
                    });
                },
                (err) => { 
                    this.T.toast('upload err: ' + JSON.stringify(err))
                    this.LOG.error('upload err', JSON.stringify(err))
                }
            );

        }, (err) => {

            if (err == "no image selected") return; // not really an error

            this.T.toast('Error accessing camera: ' + err);
            ev.target.src = "//placehold.it/100x100/ffcc22";
        })
    }


    get diagnostic() { return JSON.stringify(this.model); }

}
