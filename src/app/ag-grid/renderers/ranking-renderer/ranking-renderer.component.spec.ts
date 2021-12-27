import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingRendererComponent } from './ranking-renderer.component';

describe('RankingRendererComponent', () => {
  let component: RankingRendererComponent;
  let fixture: ComponentFixture<RankingRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankingRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
