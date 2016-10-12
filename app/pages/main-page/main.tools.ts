import { Component, Output, EventEmitter } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { MainCommService } from './main.comm';

@Component({
    templateUrl: 'build/pages/main-page/main.tools.html',
    selector: 'acgo-tools',
    providers: [MainCommService]
})
export class MainTools {
    componentName: string = 'MainTools';

    // ui flags
    public gettingLocation: boolean = false;
    public mode: string;
    public msg: string = "hello world";

    //@Output() onLoadComplete = new EventEmitter<any>();

    // constructor
    constructor(private COMM: MainCommService) {
        console.log(this.componentName + ' constructor');

        this.COMM.missionConfirmed$.subscribe(ast => alert(ast));

        this.mode = 'create';
        this.COMM.InitTools(this);

    }

    // OUtside events 
    public StartObjectEdit(obj) {
        this.enterObjectEditMode();
    }
    public EndObjectEdit() {
        this.mode = 'create';
    }

    // create drawing object
    public CreateButton_Click(letter: string) {
        console.log(this.componentName + ' ToolsButton_Click', letter);

        if (letter == 'M') {
            // tell the Map to create a marker (default is center of map)
            this.COMM.CreateMarker();
        }
        else if (letter == 'L') {
            this.COMM.StartPolyline();
        }
        else if (letter == 'P') {
            this.COMM.StartPolygon();
        }

        this.enterObjectEditMode()
    }


    enterObjectEditMode() {
        console.log(this.componentName + ' enterObjectEditMode');

        this.mode = 'editObject';
    }

    public EditCompleteButton_Click() {
        console.log(this.componentName + ' EditCompleteButton_Click');

        this.COMM.EndObjectEdit();
        this.mode = 'create';
    }

    public EditCancelButton_Click() {
        console.log(this.componentName + ' EditCancelButton_click');

        // confirm delete
        if (confirm('Throw away this object?')) {
            this.COMM.CancelObjectEdit();
            this.mode = 'create';
        }
    }

    // use LocationService to get current location
    // > send result to the MainPage to handle
    public NavigateButton_Click() {
        console.log(this.componentName + ' NavigateButton_Click');

        // start spinner
        this.gettingLocation = true;

        LocationService.getCurrentPosition().then(

            // success
            (p) => {
                console.log('> success, p:', p);

                this.COMM.SetMapToLocation(p);
                this.gettingLocation = false;
            },
            // error
            (err) => {
                console.error('> error: ', err);
                this.gettingLocation = false;
            }
        )

    }
}