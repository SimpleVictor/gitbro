import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";

@Component({
    selector: "my-text-editor",
    styleUrls: ['./client/components/texteditor/texteditor.component.css'],
    templateUrl: './client/components/texteditor/texteditor.component.html'
})
export class TextEditorComponent implements OnInit{

    @Input() sendForm;



    constructor(){
    }

    ngOnInit(){
    }

}
