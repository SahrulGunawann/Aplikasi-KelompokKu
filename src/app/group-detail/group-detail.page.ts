import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../services/group.service';
import { Group } from '../models/group.model';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.page.html',
  styleUrls: ['./group-detail.page.scss'],
  standalone: false,
})
export class GroupDetailPage implements OnInit {
  group: Group | undefined;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private groupService: GroupService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.group = await this.groupService.getGroup(id);
      if (!this.group) {
        this.navCtrl.navigateBack('/home');
      }
    }
  }

  editGroup() {
    if (this.group) {
      this.navCtrl.navigateForward(['/add-group', { id: this.group.id }]);
    }
  }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Hapus Kelompok?',
      message: 'Kamu yakin ingin menghapus kelompok ini? Data tidak dapat dikembalikan.',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Hapus',
          role: 'destructive',
          handler: () => {
            this.deleteGroup();
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteGroup() {
    if (this.group) {
      await this.groupService.deleteGroup(this.group.id);
      const toast = await this.toastCtrl.create({
        message: 'Kelompok berhasil dihapus.',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      toast.present();
      this.navCtrl.navigateBack('/home');
    }
  }
}
