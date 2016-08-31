import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";

import {  } from "../../service/api.service";
import {GithubService} from "../../services/github.service";
import {HttpModule} from "@angular/http";
import {FileSplitter} from "../../services/filesplitter.service";

@NgModule({
    imports:      [ CommonModule, HttpModule],
    declarations: [ /* Declare components and pipes */],
    exports:      [ /* Export them */ ]
})
export class SharedModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                GithubService,
                FileSplitter
                ]
        };
    }
}
