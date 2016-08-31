import {Component, OnInit} from "@angular/core";

@Component({
    selector: "home",
    styleUrls: ['client/modules/home/home.component.css'],
    templateUrl: `client/modules/home/home.component.html`
})
export class HomeComponent implements OnInit {

    testParent;
    urlForm = {
        first_param: '',
        second_param: ''
    };

    constructor() {
    }

    ngOnInit(){
    }

}
