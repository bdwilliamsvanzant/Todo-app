import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { EmailValidator } from '../../validators/email';
import { AngularFirestore } from 'angularfire2/firestore';
import { NavController, AlertController, LoadingController  } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public signupForm: FormGroup;

  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore) {
    
    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      retype: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      firstName: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*'), Validators.required])]
    });
  }

  ngOnInit() {
  }
  signupUser() {
    if (this.signupForm.value.password == this.signupForm.value.retype) {
      this.afAuth.auth.createUserWithEmailAndPassword(this.signupForm.value.email, this.signupForm.value.password)
        .then(() => {
          let userId = this.afAuth.auth.currentUser.uid;
          let userDoc = this.firestore.doc<any>('users/' + userId);
          userDoc.set({//set user values in Firebase database
            firstName: this.signupForm.value.firstName,
            lastName: this.signupForm.value.lastName,
            email: this.signupForm.value.email
          });
          this.navCtrl.navigateRoot('home');
        }, (error) => {
            this.hideloader();
            this.presentErrorAlert(error);
          this.presentAlert();
        });
     this.presentLoading();
    } else {
    this.presentAlert();
  }
  }
  //duration becuase of root change wont be dismissed otherwise
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: "Signing up..",
      duration: 1200
    });
    await loading.present();
  }
  hideloader(){
    this.loadingCtrl.dismiss()
  }
async presentAlert(){
    const alert = await this.alertCtrl.create({
    message: "The passwords do not match.",
    buttons: [{ text: "Ok", role: 'cancel' }]
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
