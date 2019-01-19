import { TestBed } from '@angular/core/testing';

import { FightEndService } from './fight-end.service';

describe('FightEndService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FightEndService = TestBed.get(FightEndService);
    expect(service).toBeTruthy();
  });
});
