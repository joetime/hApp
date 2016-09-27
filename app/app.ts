// Angular
import { Component, ViewChild } from '@angular/core';

// Ionic 
import { ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { provideCloud, CloudSettings, Deploy } from '@ionic/cloud-angular';

// My Services
import { Backand } from './services/backand.service';
import { UpdateService } from './services/update.service';
import { LogService } from './services/log.service';
import { SettingsService } from './services/settings.service';

// My Pages
import { Page1 } from './pages/page1/page1';
import { Page2 } from './pages/page2/page2';
import { SystemPage } from './pages/system-page/system.page';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'b3efcabc'
  }
};

@Component({
  templateUrl: 'build/app.html',
  // Injectable providers
  providers: [Backand, UpdateService, LogService, SettingsService]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = SystemPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'System', component: SystemPage },
      { title: 'Page uno', component: Page1 },
      { title: 'Page dos', component: Page2 },
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

ionicBootstrap(MyApp, [provideCloud(cloudSettings)]);
