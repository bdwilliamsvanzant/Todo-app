import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  public resetPwdForm: FormGroup
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public afAuth: AngularFireAuth, public alertCtrl: AlertController) { 
    this.resetPwdForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])]
    });
  }

  ngOnInit() {
  }
  //uses firebase email extension to send an email to the user to reset password
  // new alert format handled outside of function.
  async resetUserPwd() {
    this.afAuth.auth.sendPasswordResetEmail(this.resetPwdForm.value.email).then((user) => {
     this.presentAlert()
    }, (error) => {
      this.presentErrorAlert(error)
    });
  }
async presentAlert(){
    const alert = await this.alertCtrl.create({
      message: "We just sent a link to reset your password to your email.",
      buttons: [
        {
          text: "Ok",
          role: 'cancel',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
  });
  await alert.present();
}

async presentErrorAlert(error){
  const alert = await this.alertCtrl.create({
    message: error.message,
    buttons: [{ text: "Ok", role: 'cancel' }]
});
await alert.present();
}
}
