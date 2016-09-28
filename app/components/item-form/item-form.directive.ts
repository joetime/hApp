import { Component, Input, Directive } from '@angular/core';
import { PavingItem } from '../../models/item.model';

@Component({
    //moduleId: 'someId',
    templateUrl: 'build/components/item-form/item-form.directive.html',
    selector: 'item-form'
})
export class ItemForm {

    types = ['ADA', 'Repair', 'Maintenance', 'Other']
    model = new PavingItem(1, "Test Item", false, "ADA", "comments...");
    submitted = false;

    OnSubmit () { this.submitted = true; }

    constructor() {
        console.info('ItemForm constructor')
    }

    get diagnostic() { return JSON.stringify(this.model); }

}
