import { Component} from '@angular/core';
import { MdInputModule, MdDialog, MdDialogRef } from '@angular/material';

@Component({
    selector: 'product-quantity-dialog',
    template: '<h1 md-dialog-title>Update Quantity</h1>' +
    '<div md-dialog-content><md-input-container><input type="number" mdInput [(ngModel)]="quantity"/></md-input-container></div>' +
    '<div md-dialog-actions>' +
    '  <button md-button md-dialog-close={{quantity}}>Save</button>' +
    '  <button md-button md-dialog-close>Cancel</button>' +
    '</div>',
})
export class QuantityDialog {
    previousQuantity: Number;
    constructor(public dialogRef: MdDialogRef<QuantityDialog>) {
        this.previousQuantity = 12;
    }
}