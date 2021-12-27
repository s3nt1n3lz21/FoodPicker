import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameRendererComponent } from './name-renderer.component';

describe('NameRendererComponent', () => {
  let component: NameRendererComponent;
  let fixture: ComponentFixture<NameRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NameRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NameRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
