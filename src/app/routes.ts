import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { SideNav } from './shared/sidenav/sidenav';
import { CustomerList } from './pages/customer/customer-list/customer-list';
import { CustomerCreate } from './pages/customer/customer-create/customer-create';
import { ProductList } from './pages/catalog/product-list/product-list';
import { CategoryCreate } from './pages/catalog/category-create/category-create';
import { ProductCreate } from './pages/catalog/product-create/product-create';
import { OrderCreate } from './pages/order/order-create/order-create';
import { OrderList } from './pages/order/order-list/order-list';
import {OrderDetail} from './pages/order/order-detail/order-detail';

export const AppRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        component: SideNav,
        children: [
            { path: '', component: Homepage }
        ]
    },
    {
        path: 'customers',
        component: SideNav,
        children: [
            { path: '', component: CustomerList },
            { path: 'create', component: CustomerCreate, pathMatch: 'full' }
        ]
    },
    {
        path: 'customer/:id', 
        component: SideNav,
        children: [
            { path: '', component: CustomerCreate},
            { path: 'orders/create', component: OrderCreate, pathMatch: 'full' }
        ]
    },
    { path: 'customers/', redirectTo: '/customers' },
    {
        path: 'catalog',
        component: SideNav,
        children: [
            { path: '', component: ProductList, pathMatch: 'full' },
            { path: 'category/create', component: CategoryCreate, pathMatch: 'full' },
            { path: 'product/create', component: ProductCreate, pathMatch: 'full' }
        ]
    },
    {
        path: 'catalog/',
        redirectTo: '/catalog'
    },
    {
        path: 'orders',
        component: SideNav,
        children: [
            { path: 'create', component: OrderCreate },
            {path: '', component: OrderList, pathMatch: 'full'}
            //{path: 'order/:id', component: OrderDetail, pathMatch: 'full'}
        ]
    },
    {
        path: 'order',
        component: SideNav,
        children: [
            {path: ':id', component: OrderDetail }
        ]
    },
    {
        path: 'orders/',
        redirectTo: '/orders'
    },
    /* {
      path: 'customers',
      component: SideNav,
      children: [
              {path: '', component: CustomerListComponent},
              {path: 'customer/:id', redirectTo: ':id', pathMatch: 'full'},
              {path: 'customer/:id/orders', redirectTo: ':id/orders', pathMatch: 'full'},
              {path: 'customer/:id/invoices', redirectTo: ':id/invoices', pathMatch: 'full'},
              {
                  path: ':id',
                  component: CustomerDetailViewer,
                  children: [
                      {path: '', redirectTo: 'detail', pathMatch: 'full'},
                      {path: 'detail', component: CustomerDetail, pathMatch: 'full'},
                      {path: 'orders', component: OrderList, pathMatch: 'full'},
                      {path: 'invoices', component: InvoiceList, pathMatch: 'full'},
                      {path: '**', redirectTo: 'overview'}
                  ],
              },
          ],
      },
      {
          path: 'invoices',
          component: SideNav,
          children: [
              {path: '', component: InvoiceList, pathMatch: 'full'},
              {path: 'invoice/:id', component: InvoiceDetail, pathMatch: 'full'}
          ]
      }, */
    {path: '**', redirectTo: '/home'}
];
