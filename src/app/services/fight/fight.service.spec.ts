import { TestBed } from '@angular/core/testing';

import { FightService } from './fight.service';

describe('FightService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FightService = TestBed.get(FightService);
    expect(service).toBeTruthy();
  });
});
