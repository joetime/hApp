// Angular
import { Component, ViewChild, ExceptionHandler, Injectable, provide } from '@angular/core';
import { Form } from '@angular/forms';

// Ionic 
import { ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { provideCloud, CloudSettings, Deploy } from '@ionic/cloud-angular';
import { Geolocation } from 'ionic-native';
import { Camera } from 'ionic-native';

// My Services
import { Backand } from './services/backand.service';
import { UpdateService } from './services/update.service';
import { LogService } from './services/log.service';
import { SettingsService } from './services/settings.service';
import { SettingsStatic } from './services/settings.static';
import { LocationService } from './services/location.service';
import { CameraService } from './services/camera.service';
import { AppExceptionHandler } from './services/exception.service';
import { Toast } from './services/toast.service';
import { CommService } from './services/comm.service';
import { MapService } from './services/map.service';
import { DrawingService } from './services/drawing.service';
import { OptionsService } from './services/options.service';
import { FileService } from './services/file.service';
import { PavingItemService } from './services/paving-item.service';

// Models
import { PavingItemModel } from './models/paving-item.model';

// Components/Directives
import { ItemForm } from './components/item-form/item-form.directive';
import { MainMap } from './pages/main-page/main.map';
import { MainCommService } from './pages/main-page/main.comm';

// My Pages
import { Page1 } from './pages/page1/page1';
import { Page2 } from './pages/page2/page2';
import { MainPage } from './pages/main-page/main.page';
import { SystemPage } from './pages/system-page/system.page';
import { LogsPage } from './pages/logs-page/logs.page';
import { MapPage } from './pages/map-page/map.page';
import { MapPageState } from './pages/map-page/map.page.state';
import { HomePage } from './pages/home-page/home.page';

@Component({
  templateUrl: 'build/app.html',
  directives: [ItemForm],
  // Injectable providers
  providers: [
    Geolocation,
    Camera,
    CameraService,
    LocationService,
    Backand,
    UpdateService,
    LogService,
    SettingsService,
    Toast,
    CommService,
    MapPageState,
    MapService,
    DrawingService,
    OptionsService,
    PavingItemModel,
    FileService,
    PavingItemService,
    MainCommService
  ],

})
class MyApp {

  @ViewChild(Nav) nav: Nav; // Angular access to the Nav component

  rootPage: any = MapPage;

  // Array of pages to include in the left menu
  pages: Array<{ title: string, component: any }>;

  // CONSTRUCTOR
  constructor(public platform: Platform, private LOG: LogService) {
    this.initializeApp();

    this.LOG.log('NEW SESSION', null);

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Map', component: MapPage },
      //{ title: 'Main', component: MainPage },
      { title: 'System', component: SystemPage },

      { title: 'Logs', component: LogsPage },
      /*{ title: 'Page uno', component: Page1 },
      { title: 'Page dos', component: Page2 },*/
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}


// Cloud settings (used by the deploy service for updating software on device)
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'b3efcabc'
  }
};

// Exception handler config
let _bypassExceptionHandler = false;
if (_bypassExceptionHandler) {

  ionicBootstrap(MyApp, [provideCloud(cloudSettings)]);
} else {
  // override with custom AppExceptionHandler
  ionicBootstrap(MyApp, [provide(ExceptionHandler, { useClass: AppExceptionHandler }), provideCloud(cloudSettings)]);

}
