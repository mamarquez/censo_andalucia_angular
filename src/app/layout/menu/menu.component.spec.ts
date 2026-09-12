import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { signal } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';

import { MenuComponent } from './menu.component';
import { CensoService } from '../../services/censoService.service';

describe('MenuComponent', () => {
  let censoServiceMock: { menuAbierto: ReturnType<typeof signal<boolean>> };

  beforeEach(() => {
    censoServiceMock = { menuAbierto: signal(true) };

    TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        { provide: CensoService, useValue: censoServiceMock },
        provideTranslateService(),
        provideRouter([])
      ]
    });
  });

  it('expone menuAbierto desde CensoService', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.menuAbierto()).toBe(true);
  });

  it('cerrarMenu pone menuAbierto en false', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();

    fixture.componentInstance.cerrarMenu();
    expect(censoServiceMock.menuAbierto()).toBe(false);
  });
});
