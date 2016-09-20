import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Backand } from '../../services/backand';
import { Deploy } from '@ionic/cloud-angular';
import { ToastController } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/page1/page1.html'
})
export class Page1 {

  public items: any[];

  constructor(public navCtrl: NavController, public BK: Backand, private deploy: Deploy, public toastCtrl: ToastController) {
    this.init();
  }

  private doUpdate() {
    this.deploy.download().then(() => {
      this.toastThis('downloaded');

      return this.deploy.extract().then(() => {
        this.toastThis('extracted. loading....')
        this.deploy.load();
      });

    });
  }

  private init() {
    this.BK.getTodos().subscribe(
      data => {
        //this.toastThis('data rcvd');

        this.items = data.data;
      },
      err => console.error(err),
      () => console.log('OK')
    );
  }

  public addTodo() {
    this.toastThis('addTodo()');
    this.BK.addTodo('item ' + new Date().toTimeString()).subscribe(
      resp => { console.log(resp); 
        this.items.push(resp);
    },
      err => console.error(err)
    );
  }

  public checkForUpdate() {
    this.deploy.check().then((snapshotAvailable: boolean) => {

      // When snapshotAvailable is true, you can apply the snapshot
      if (snapshotAvailable) { 
        this.toastThis('new version available. One moment...')
        this.doUpdate();
      }
      else this.toastThis('software up to date :)');
    }, reason => {
      this.toastThis('rejected ' + reason);
    });
  }


  private toastThis(msg: string) {
    console.log(msg);
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}