import {Component, NgModule, OnInit} from '@angular/core';
import { MatButtonModule, MatCardModule } from '@angular/material';
import {RouterModule} from '@angular/router';
import {PageUtil} from '../../shared/page-util/page-util';
import {SideNavModule} from '../../shared/sidenav/sidenav';
import {MenuItems} from '../../shared/menu-items/menu-items';
import {CommonModule} from '@angular/common';
import {BaseMaterialModule} from '../../app.material.module';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.html',
    styleUrls: ['./homepage.scss']
})

export class Homepage implements OnInit {
  constructor(public _pageUtil: PageUtil,
              public menuItems: MenuItems) {}

  ngOnInit(): void {
    this._pageUtil.title = 'Home';
  }
}

@NgModule({
  imports: [BaseMaterialModule, MatButtonModule, RouterModule, MatCardModule, SideNavModule, CommonModule],
  exports: [Homepage],
  declarations: [Homepage],
  providers: [MenuItems, PageUtil]
})
export class HomepageModule {}