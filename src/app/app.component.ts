import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from 'angularfire2/auth';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
  export class AppComponent {
  
    constructor(navCtrl: NavController,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, afAuth: AngularFireAuth) {
      platform.ready().then(() => {
        statusBar.styleDefault();
        splashScreen.hide();
      });
      //use of navigate root and forward to use navController than use routing
      const authObserver = afAuth.authState.subscribe(user => {
        if (user) {
          navCtrl.navigateRoot('home');
          authObserver.unsubscribe();
        } else {
          navCtrl.navigateForward('login');
          authObserver.unsubscribe();
        }
      });
    }
  }