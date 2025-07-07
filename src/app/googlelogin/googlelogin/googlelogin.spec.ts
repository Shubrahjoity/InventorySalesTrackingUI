import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Googlelogin } from './googlelogin';

describe('Googlelogin', () => {
  let component: Googlelogin;
  let fixture: ComponentFixture<Googlelogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Googlelogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Googlelogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
