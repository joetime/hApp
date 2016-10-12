import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    template: `
        <div #myList id="myList" padding>loading list...</div>
    `,
    selector: 'acgo-list',
})
export class MainList {

    @Output() onLoadComplete = new EventEmitter<any>();

    constructor() { }


}