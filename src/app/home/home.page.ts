//Ben Williams-Van Zant
//citpt-227 todo app
import { Component, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {

  taskList = [];
  taskName: string = "";
  userId: any;
  fireStoreTaskList: any;
  fireStoreList: any;

  @ViewChild('taskInput',{ read: false, static: true }) inputbar;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore) {

    // was set in constructor due to not loading in ionViewDidLoad
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid
        this.fireStoreTaskList = this.firestore.doc('users/' + this.userId).collection('tasks').valueChanges();
        this.fireStoreList = this.firestore.doc('users/' + this.userId).collection('tasks');
      }
    });
    }

  ionViewDidLoad() {
  }

  addTask() {
    if (this.taskName.length > 0) {
      let task = this.taskName;
      let id = this.firestore.createId();
      this.fireStoreList.doc(id).set({
        id: id,
        taskName: task
      });
      this.taskName = "";
    }
    this.inputbar.setFocus();
  }
  //routes to login after signing out of the database connection
  logout() {
    return this.afAuth.auth.signOut().then(authData => {
      this.navCtrl.navigateRoot('login');
    });
  }

  //open an alert window to update the task
  updateTask(index) {
    this.presentAlert(index);
  }
  //removes the task by its id from the users task collection
  deleteTask(index) {
    this.fireStoreList.doc(index).delete();
  }
  //alert doesnt need timer due to action buttons
  //updates the task by its id from the users task collection
  async presentAlert(index){
    const alert = await this.alertCtrl.create({
      header: 'Update Task?',
      message: 'Type in your new task to update.',
      inputs: [{ name: 'editTask', placeholder: 'Task' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Update', handler: data => { this.fireStoreList.doc(index).update({ taskName: data.editTask }); } }
      ]
  });
  await alert.present();
}
}
