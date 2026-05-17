import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../services/group.service';
import { Group, Member } from '../models/group.model';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.page.html',
  styleUrls: ['./add-group.page.scss'],
  standalone: false,
})
export class AddGroupPage implements OnInit {
  isEditMode = false;
  groupId: string = '';

  subject: string = '';
  groupNumber: string = '';
  members: Member[] = [{ name: '' }];
  leaderIndex: number = 0;
  notes: string = '';

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('id') || '';
    if (this.groupId) {
      this.isEditMode = true;
      await this.loadGroupData();
    }
  }

  async loadGroupData() {
    const group = await this.groupService.getGroup(this.groupId);
    if (group) {
      this.subject = group.subject;
      this.groupNumber = group.groupNumber;
      this.members = group.members.map(m => ({ ...m }));
      this.leaderIndex = group.leaderIndex;
      this.notes = group.notes;
    }
  }

  addMember() {
    this.members.push({ name: '' });
  }

  removeMember(index: number) {
    if (this.members.length > 1) {
      this.members.splice(index, 1);
      if (this.leaderIndex >= this.members.length) {
        this.leaderIndex = this.members.length - 1;
      } else if (this.leaderIndex === index) {
        this.leaderIndex = 0;
      }
    }
  }

  async saveGroup() {
    if (!this.subject.trim() || !this.groupNumber.trim()) {
      this.showToast('Mata kuliah dan nomor kelompok tidak boleh kosong!', 'warning');
      return;
    }

    const validMembers = this.members.filter(m => m.name.trim() !== '');
    if (validMembers.length === 0) {
      this.showToast('Minimal harus ada 1 anggota!', 'warning');
      return;
    }

    let finalLeaderIndex = this.leaderIndex;
    if (this.leaderIndex >= validMembers.length) {
      finalLeaderIndex = 0; // fallback to 0
    }

    const groupData: Group = {
      id: this.isEditMode ? this.groupId : Date.now().toString(),
      subject: this.subject,
      groupNumber: this.groupNumber,
      members: validMembers,
      leaderIndex: finalLeaderIndex,
      notes: this.notes
    };

    if (this.isEditMode) {
      await this.groupService.updateGroup(groupData);
      this.showToast('Kelompok berhasil diperbarui!', 'success');
      this.navCtrl.back();
    } else {
      await this.groupService.addGroup(groupData);
      this.showToast('Kelompok berhasil ditambahkan!', 'success');
      this.navCtrl.navigateBack('/home');
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}
