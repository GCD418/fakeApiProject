import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceFeedComponent } from './price-feed.component';

describe('PriceFeedComponent', () => {
  let component: PriceFeedComponent;
  let fixture: ComponentFixture<PriceFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
