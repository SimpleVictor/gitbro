import {Component, OnInit, AfterViewChecked} from "@angular/core";

@Component({
    selector: "home",
    styleUrls: ['client/modules/home/home.component.css'],
    templateUrl: `client/modules/home/home.component.html`
})
export class HomeComponent implements OnInit, AfterViewChecked {

    testParent;
    urlForm = {
        first_param: '',
        second_param: ''
    };
    buttonPressed;

    constructor() {
    }

    ngOnInit(){
    }

    onSubmit(){
        this.buttonPressed = this.urlForm;
    }

    ngAfterViewChecked(){
        this.buttonPressed = undefined;
    }

}
