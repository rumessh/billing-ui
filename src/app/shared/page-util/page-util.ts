import {Injectable} from '@angular/core';
import {MdSidenav} from '@angular/material';

/**
 * Service responsible for setting the title that appears above the components and guide pages.
 */
@Injectable()
export class PageUtil {
  _title = '';
  _totalCount = 0;
  _pageSize = 20;
  _sidenav: MdSidenav | null;

  get title(): string { return this._title; }

  set title(title: string) {
    this._title = title;
    if (title !== '') {
      title = `${title} | `;
    }
  }

  get totalCount(): number {
    return this._totalCount;
  }

  set totalCount(totalCount: number) {
    this._totalCount = totalCount;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(pageSize: number) {
    this._pageSize = pageSize;
  }

  get sidenav(): MdSidenav { return this._sidenav; }

  set sidenav(sidenav: MdSidenav) {
    this._sidenav = sidenav;
  }

  isMobile(): boolean {
    return navigator.userAgent.indexOf('Mobi') >= 0;
  }
}