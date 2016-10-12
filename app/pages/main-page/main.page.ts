import { Component } from '@angular/core'; //, ViewChild, ElementRef 
// import { NavController, NavParams } from 'ionic-angular';
// import { SettingsService } from '../../services/settings.service';
// import { LogService } from '../../services/log.service';
// import { Backand } from '../../services/backand.service';
// import { LocationService } from '../../services/location.service';
// import { Toast } from '../../services/toast.service';
// import { CommService } from '../../services/comm.service';
import { MainMap } from '../main-page/main.map';
import { MainList } from '../main-page/main.list';
import { MainTools } from '../main-page/main.tools';


@Component({
  templateUrl: 'build/pages/main-page/main.page.html',
  directives: [MainMap, MainList, MainTools]
})
export class MainPage {
  constructor() {

  }

  public test: string = 'hello world'
}