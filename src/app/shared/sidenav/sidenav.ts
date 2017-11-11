import {Component, ViewEncapsulation, ViewChild, OnInit, NgModule} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {PageHeaderModule} from '../page-header/page-header';
import {MenuItems} from '../menu-items/menu-items';
import {BaseMaterialModule} from '../../app.material.module';

const SMALL_WIDTH_BREAKPOINT = 840;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SideNav implements OnInit {
  constructor(public menuItems: MenuItems,
              private _router: Router) {}

  @ViewChild(MatSidenav) sidenav: MatSidenav;

  ngOnInit() {
    this._router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });
  }

  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }
}

@NgModule({
  imports: [BaseMaterialModule, RouterModule, CommonModule, PageHeaderModule],
  exports: [SideNav],
  declarations: [SideNav],
  providers: [MenuItems],
})
export class SideNavModule {}