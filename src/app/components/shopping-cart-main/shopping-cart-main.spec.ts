import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartMain } from './shopping-cart-main';

describe('ShoppingCartMain', () => {
  let component: ShoppingCartMain;
  let fixture: ComponentFixture<ShoppingCartMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingCartMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingCartMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
