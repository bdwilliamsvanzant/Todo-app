import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AngularFireAuth } from 'angularfire2/auth';
import { NavController, AlertController, LoadingController  } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public afAuth: AngularFireAuth) { 

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }
  
  ngOnInit() {
  }

  loginUser() {
    this.afAuth.auth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).then(() => {
      this.navCtrl.navigateRoot('home');
    }, (error) => {
        this.hideloader();
        this.presentAlert(error)
    });
    this.presentLoading();
  }

  resetPwd() {
    this.navCtrl.navigateForward('reset-password');
  }

  createAccount() {
    //use of navigate does not take a url just a alias
    this.navCtrl.navigateForward('register');
  }
  async presentAlert(error){
    const alert = await this.alertCtrl.create({
      message: error.message,
      buttons: [{ text: "Ok", role: 'cancel' }]
  });
  await alert.present();
  }
  //use of timer so it does not get stuck and cant be closed cause of root change
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
    message: "Logging in..",
    duration: 1200
  });
  await loading.present();
  }
  //function to close the loader
  hideloader(){
    this.loadingCtrl.dismiss();
  }
}
