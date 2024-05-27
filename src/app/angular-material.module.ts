import { NgModule } from "@angular/core";
import {MatInputModule} from '@angular/material/input'; 
 import {MatButtonModule} from '@angular/material/button';
 import {MatCardModule} from '@angular/material/card';
 import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
    imports:[
        MatPaginatorModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        MatExpansionModule,
        MatListModule,
        MatFormFieldModule,
    ],
    exports:[
        MatPaginatorModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        MatExpansionModule,
        MatListModule,
        MatFormFieldModule,
    ]

})
export class AngularMaterialModule{

}