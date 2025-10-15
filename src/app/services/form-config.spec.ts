import { TestBed } from '@angular/core/testing';

import { FormConfig } from './form-config';

describe('FormConfig', () => {
  let service: FormConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
