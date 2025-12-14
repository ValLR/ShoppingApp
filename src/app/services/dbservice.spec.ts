import { TestBed } from '@angular/core/testing';
import { DbserviceService } from './dbservice';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

class MockSQLite {}

describe('DbserviceService', () => {
  let service: DbserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DbserviceService,
        { provide: SQLite, useClass: MockSQLite }
      ]
    });
    service = TestBed.inject(DbserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
