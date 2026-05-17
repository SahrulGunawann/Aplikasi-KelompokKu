import { Component, OnInit } from '@angular/core';
import { GroupService } from '../services/group.service';
import { Group } from '../models/group.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  groups: Group[] = [];
  filteredGroups: Group[] = [];
  searchQuery: string = '';

  constructor(
    private groupService: GroupService,
    private navCtrl: NavController
  ) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    await this.loadGroups();
  }

  async loadGroups() {
    this.groups = await this.groupService.getGroups();
    await this.filterGroups();
  }

  async filterGroups() {
    this.filteredGroups = await this.groupService.searchGroups(this.searchQuery);
  }

  async onSearchChange(event: any) {
    this.searchQuery = event.detail.value;
    await this.filterGroups();
  }

  goToAdd() {
    this.navCtrl.navigateForward('/add-group');
  }

  goToDetail(id: string) {
    this.navCtrl.navigateForward(['/group-detail', { id }]);
  }
}
