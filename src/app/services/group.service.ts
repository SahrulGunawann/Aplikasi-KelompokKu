import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private _storage: Storage | null = null;
  private groups: Group[] = [];
  private readonly STORAGE_KEY = 'groups_data';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    const storedGroups = await this._storage.get(this.STORAGE_KEY);
    if (storedGroups) {
      this.groups = storedGroups;
    }
  }

  async getGroups(): Promise<Group[]> {
    if (!this._storage) {
      await this.init();
    }
    return [...this.groups];
  }

  async getGroup(id: string): Promise<Group | undefined> {
    if (!this._storage) {
      await this.init();
    }
    return this.groups.find(g => g.id === id);
  }

  async addGroup(group: Group): Promise<void> {
    this.groups.push(group);
    await this.saveData();
  }

  async updateGroup(group: Group): Promise<void> {
    const index = this.groups.findIndex(g => g.id === group.id);
    if (index > -1) {
      this.groups[index] = group;
      await this.saveData();
    }
  }

  async deleteGroup(id: string): Promise<void> {
    this.groups = this.groups.filter(g => g.id !== id);
    await this.saveData();
  }

  async searchGroups(query: string): Promise<Group[]> {
    if (!this._storage) {
      await this.init();
    }
    if (!query.trim()) {
      return [...this.groups];
    }
    const lowerQuery = query.toLowerCase();
    return this.groups.filter(g => g.subject.toLowerCase().includes(lowerQuery));
  }

  private async saveData() {
    if (this._storage) {
      await this._storage.set(this.STORAGE_KEY, this.groups);
    }
  }
}
