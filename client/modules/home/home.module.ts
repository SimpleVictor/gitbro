import { NgModule } from '@angular/core';
import { NgSemanticModule } from "ng-semantic";
import { CommonModule } from "@angular/common";

import { HomeComponent } from "./home.component";
import { routing } from "./home.routing";
import { SharedModule } from "../shared/shared.module";
import {TextEditorComponent} from "../../components/texteditor/texteditor.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        BrowserModule,
        routing,
        FormsModule,
        SharedModule.forRoot(),
        NgSemanticModule,
    ],
    declarations: [ HomeComponent, TextEditorComponent ],
    bootstrap:    [ HomeComponent ]
})
export class HomeModule { }
