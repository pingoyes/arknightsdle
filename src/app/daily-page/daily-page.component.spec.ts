import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPageComponent } from './daily-page.component';

describe('DailyComponent', () => {
  let component: DailyPageComponent;
  let fixture: ComponentFixture<DailyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
