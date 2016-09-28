
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular'

@Injectable()
export class Toast {
    
    constructor(private toastCtrl: ToastController) {}

    public toast (msg: string) {

        let myToast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top'
        });

        myToast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        myToast.present();
    }
}