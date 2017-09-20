import { Component, AfterViewInit} from '@angular/core';
import { MdInputModule, MdDialog, MdDialogRef } from '@angular/material';

@Component({
    selector: 'update-dialog',
    template: '<h1 md-dialog-title>{{title}}</h1>' +
    '<div md-dialog-content><md-form-field><input type="number" mdInput [(ngModel)]="updateModel"/></md-form-field></div>' +
    '<div md-dialog-actions>' +
    '  <button md-raised-button md-dialog-close={{updateModel}}>Save</button>' +
    '  <button md-raised-button md-dialog-close={{previousValue}}>Cancel</button>' +
    '</div>',
})
export class UpdateDialog {
    updateModel: number;
    previousValue: number;
    title: String;
    constructor(public dialogRef: MdDialogRef<UpdateDialog>) {
    }

    ngAfterViewInit() {
        this.updateModel = this.dialogRef.componentInstance.previousValue;
    }    
}