import {Injectable} from '@angular/core';

export interface MenuItem {
  id: string;
  name: string;
  type?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  summary: string;
  items: MenuItem[];
}

const MENUS = [
  {
    id: 'customers',
    name: 'Customers',
    summary: 'Create a customer or list all of my customers',
    action1label: 'CREATE CUSTOMER',
    action2label: 'VIEW CUSTOMERS',
    items: [
        {id: '', name: 'Create customer', type: 'create'},
        {id: '', name: 'List all customers'}
    ]
  },
  {
    id: 'orders',
    name: 'Sale Orders',
    summary: 'View all the order placed or create an order',
    action1label: 'CREATE ORDER',
    action2label: 'VIEW ORDERS',
    items: [
        {id: '', name: 'Create sale order', type: 'create'},
        {id: '', name: 'List all sale orders'}
    ]
  },
  {
    id: 'invoices',
    name: 'Invoices',
    summary: 'View invoices created for sale orders or create an invoice',
    action1label: 'CREATE INVOICE',
    action2label: 'VIEW INVOICES',
    items:  [
        {id: '', name: 'Create invoice', type: 'create'},
        {id: '', name: 'List all invoices'}
    ]
  },
  {
    id: 'catalog',
    name: 'Product Catalog',
    summary: 'Manage settings related to my company, custom fields and invoice templates',
    action1label: 'ADD A PRODUCT',
    action2label: 'VIEW PRODUCTS',
    default: 'product', //Used to assign link to home page card action button
    items: [
        {id: '', name: 'View products'},
        {id: 'product', name: 'Add a product to catalog', type: 'create'},
        {id: 'category', name: 'Add a product category', type: 'create'}
    ]
  }
];

const ALL_ITEMS = MENUS.reduce((result, category) => result.concat(category.items), []);

@Injectable()
export class MenuItems {

  getItemsInCategories(): MenuCategory[] {
    return MENUS;
  }

  getAllItems(): MenuItem[] {
    return ALL_ITEMS;
  }

  getItemById(id: string): MenuItem {
    return ALL_ITEMS.find(i => i.id === id);
  }

  getCategoryById(id: string): MenuCategory {
    return MENUS.find(m => m.id == id);
  }

}