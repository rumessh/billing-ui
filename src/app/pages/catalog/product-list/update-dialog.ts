import { Component, AfterViewInit} from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'update-dialog',
    template: '<h1 mat-dialog-title>{{title}}</h1>' +
    '<div mat-dialog-content><mat-form-field><input type="number" matInput [(ngModel)]="updateModel"/></mat-form-field></div>' +
    '<div mat-dialog-actions>' +
    '  <button mat-raised-button mat-dialog-close={{updateModel}}>Save</button>' +
    '  <button mat-raised-button mat-dialog-close={{previousValue}}>Cancel</button>' +
    '</div>',
})
export class UpdateDialog {
    updateModel: number;
    previousValue: number;
    title: String;
    constructor(public dialogRef: MatDialogRef<UpdateDialog>) {
    }

    ngAfterViewInit() {
        this.updateModel = this.dialogRef.componentInstance.previousValue;
    }    
}