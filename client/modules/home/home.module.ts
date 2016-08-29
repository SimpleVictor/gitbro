import { NgModule } from '@angular/core';
import { NgSemanticModule } from "ng-semantic";
import { CommonModule } from "@angular/common";

import { HomeComponent } from "./home.component";
import { routing } from "./home.routing";
import { SharedModule } from "../shared/shared.module";
import {TextEditorComponent} from "../../components/texteditor/texteditor.component";

@NgModule({
    imports: [
        CommonModule,
        routing,
        SharedModule.forRoot(),
        NgSemanticModule,
    ],
    declarations: [ HomeComponent, TextEditorComponent ],
    bootstrap:    [ HomeComponent ]
})
export class HomeModule { }
