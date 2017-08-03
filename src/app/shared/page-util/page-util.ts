import {Injectable} from '@angular/core';
import {MdSidenav} from '@angular/material';

/**
 * Service responsible for setting the title that appears above the components and guide pages.
 */
@Injectable()
export class PageUtil {
  _title = '';
  _sidenav: MdSidenav | null;

  get title(): string { return this._title; }

  set title(title: string) {
    this._title = title;
    if (title !== '') {
      title = `${title} | `;
    }
  }

  get sidenav(): MdSidenav { return this._sidenav; }

  set sidenav(sidenav: MdSidenav) {
    this._sidenav = sidenav;
  }
}