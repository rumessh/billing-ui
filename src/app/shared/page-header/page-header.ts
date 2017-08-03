import {Component, EventEmitter, ViewChild, NgModule, Output} from '@angular/core';
import 'rxjs/add/operator/first';
import {PageUtil} from '../page-util/page-util';
import { MdButtonModule, MdMenuModule, MdToolbarModule, MdIconModule} from '@angular/material';

@Component({
  selector: 'page-header',
  templateUrl: './page-header.html',
  styleUrls: ['./page-header.scss']
})
export class PageHeader {
  constructor(public _pageUtil: PageUtil) { }

  @Output() toggleSidenav = new EventEmitter<void>();

  getTitle() {
    return this._pageUtil.title;
  }
}

@NgModule({
  imports: [ 
    MdButtonModule,
    MdMenuModule,
    MdToolbarModule,
    MdIconModule
  ],
  exports: [PageHeader],
  declarations: [PageHeader],
  providers: [PageUtil],
})
export class PageHeaderModule { }