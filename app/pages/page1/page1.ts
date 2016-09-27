import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Backand } from '../../services/backand.service';
import { ToastController } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/page1/page1.html'
})
export class Page1 {

  public items: any[];

  constructor(public navCtrl: NavController, public BK: Backand, public toastCtrl: ToastController) {
    this.init();
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

  private toastThis(msg: string) {
    console.log(msg);
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}