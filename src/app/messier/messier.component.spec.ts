import {ComponentFixture, TestBed} from '@angular/core/testing';
import { MonitoraggiComponent } from './messier.component';

describe('MonitoraggiComponent', () => {
  let component: MonitoraggiComponent;
  let fixture: ComponentFixture<MonitoraggiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoraggiComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MonitoraggiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
