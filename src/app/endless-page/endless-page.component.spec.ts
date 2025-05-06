import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndlessPageComponent } from './endless-page.component';

describe('EndlessPageComponent', () => {
    let component: EndlessPageComponent;
    let fixture: ComponentFixture<EndlessPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EndlessPageComponent]
        })
        .compileComponents();

        fixture = TestBed.createComponent(EndlessPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
