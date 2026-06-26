import { TestBed } from '@angular/core/testing';

import { ClinicalRecordService } from './clinical-record.service';

describe('ClinicalRecordService', () => {
  let service: ClinicalRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicalRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
