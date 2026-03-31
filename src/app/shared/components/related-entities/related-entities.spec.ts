import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedEntities } from './related-entities';

describe('RelatedEntities', () => {
  let component: RelatedEntities;
  let fixture: ComponentFixture<RelatedEntities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedEntities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedEntities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
