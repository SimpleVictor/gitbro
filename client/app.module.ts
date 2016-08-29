import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSemanticModule } from "ng-semantic";

import { AppComponent }  from './app.component';
import { routing } from "./routes";
import { HomeModule } from "./modules/home/home.module";

@NgModule({
    imports: [
        BrowserModule,
        NgSemanticModule,
        HomeModule,
        routing
    ],
    providers: [

    ],
    declarations: [ AppComponent ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
