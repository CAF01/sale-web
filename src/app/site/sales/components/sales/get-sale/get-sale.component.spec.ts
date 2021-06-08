import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSaleComponent } from './get-sale.component';

describe('GetSaleComponent', () => {
  let component: GetSaleComponent;
  let fixture: ComponentFixture<GetSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
