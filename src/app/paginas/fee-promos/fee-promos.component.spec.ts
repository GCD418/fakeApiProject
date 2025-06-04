import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeePromosComponent } from './fee-promos.component';

describe('FeePromosComponent', () => {
  let component: FeePromosComponent;
  let fixture: ComponentFixture<FeePromosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeePromosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeePromosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
