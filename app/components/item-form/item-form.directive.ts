import { Component, Input, Directive } from '@angular/core';
import { PavingItem } from '../../models/item.model';

@Component({
    //moduleId: module.id,
    templateUrl: 'build/components/item-form/item-form.directive.html',
    selector: 'item-form'
})
export class ItemForm {

    constructor() {
        console.info('ItemForm constructor')
    }

}
