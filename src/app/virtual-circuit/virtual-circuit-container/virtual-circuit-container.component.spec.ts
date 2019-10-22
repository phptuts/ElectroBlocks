import { SettingsContainerComponent } from './../settings-container/settings-container.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualCircuitContainerComponent } from './virtual-circuit-container.component';
import {
  MatTabsModule,
  MatFormFieldModule,
  MatOptionModule,
  MatSelectModule,
  MatInputModule,
  MatSlideToggleModule,
  MatIconModule
} from '@angular/material';
import { SvgComponent } from '../svg/svg.component';
import { VariablesComponent } from '../settings/variables/variables.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BlocklyService } from '../../core/services/blockly.service';

describe('VirtualCircuitContainerComponent', () => {
  let component: VirtualCircuitContainerComponent;
  let fixture: ComponentFixture<VirtualCircuitContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        VirtualCircuitContainerComponent,
        SvgComponent,
        SettingsContainerComponent,
        VariablesComponent
      ],
      imports: [
        MatTabsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatOptionModule,
        BrowserAnimationsModule,
        MatSlideToggleModule,
        MatIconModule
      ],
      providers: [
        {
          provide: BlocklyService,
          useValue: {
            resizeWorkspace() {}
          },
          multi: false
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualCircuitContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
