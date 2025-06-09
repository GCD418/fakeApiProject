import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradesDetailsComponent } from './trades-details.component';

describe('TradesDetailsComponent', () => {
  let component: TradesDetailsComponent;
  let fixture: ComponentFixture<TradesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
