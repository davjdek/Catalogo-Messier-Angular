import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMessierComponent } from './dialog-messier.component';

describe('DialogComponent', () => {
  let component: DialogMessierComponent;
  let fixture: ComponentFixture<DialogMessierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMessierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogMessierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
