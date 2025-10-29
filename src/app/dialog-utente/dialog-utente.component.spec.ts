import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUtenteComponent } from './dialog-utente.component';

describe('DialogUtenteComponent', () => {
  let component: DialogUtenteComponent;
  let fixture: ComponentFixture<DialogUtenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUtenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUtenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
