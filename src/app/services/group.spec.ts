import { TestBed } from '@angular/core/testing';

import { GroupService } from './group.service';
import { IonicStorageModule } from '@ionic/storage-angular';

describe('GroupService', () => {
  let service: GroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot()]
    });
    service = TestBed.inject(GroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
