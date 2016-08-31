import {
    Component, Input, Output, EventEmitter, OnInit, AfterViewChecked, AfterContentInit,
    DoCheck, ElementRef
} from "@angular/core";
import {GithubService} from "../../services/github.service";
import {FileSplitter} from "../../services/filesplitter.service";


declare var Prism:any;
declare var $:any;

@Component({
    selector: "my-text-editor",
    styleUrls: ['./client/components/texteditor/texteditor.component.css'],
    templateUrl: './client/components/texteditor/texteditor.component.html',
})
export class TextEditorComponent implements OnInit, AfterViewChecked, DoCheck{

    //WILL CONTAIN THE INPUT FIELDS FROM THE PARENT'S COMPONENT
    @Input() myUrl;

    testOutput;

    //LOADER
    searchingUrl:boolean = false;
    startNow: boolean = false;



    constructor(private _gitService: GithubService, private _fileSplitter: FileSplitter, private el: ElementRef){
    }


    ngOnInit(){
        //MAKES IT SO IT APPIES THE CSS AND JS TO ALL OF "PRE"/"CODE" ELEMENTS
        Prism.highlightAll();

        //LISTEN FOR THE CLICK EVENTS ON THE FILES
        $(this.el.nativeElement).on("click", '.singleLI',function(data){
           console.log(data.target.children[0].innerHTML);
        });

    }

    ngDoCheck(){
        if(this.myUrl){
            console.log("loading should begin now");
            this.searchingUrl = true;
            let returnState = this._gitService.getSouceCodeStructure(this.myUrl.first_param, this.myUrl.second_param)
            .subscribe(
                data => {
                    this.searchingUrl = false;
                    this.splitTree(data);
                    return;
                },
                err => {
                    if(err){
                        this.searchingUrl = false;
                        return console.log(err);
                    };
                }
            );
        };
    }

    ngAfterViewChecked(){
    }


    splitTree(data){
        //SEND IT TO THE SERVICE TO SPLIT UP THE FILES
        //THE RETURN TYPE WILL BE AN ARRAY OF FOLDERS/FILES IN THE "FIRST" DIRECTORY
        //HENCE THE 1 IN THE SECOND ARGUMENT
        let returnedData = this._fileSplitter.rootDirectorySplit(data, 1);
        this.OutputToHtml(returnedData);
    }

    OutputToHtml(data){
        console.log(data);

        let liCSS = "font-size: 20px;";
        let ulCSS = "list-style: none;padding: 0 20px 20px 20px;";

        let myHTML = "";

        myHTML += `<ul style="${ulCSS}">`;

        for(let i in data){

            myHTML += `<li style="${liCSS}" class="singleLI">`;
            myHTML += `<p style="display: none">${data[i].url}</p>`;
            //IF OBJECT IS A FILE
            if(data[i].type === "file"){
                myHTML += `<i style="color: green" class='file text outline icon'></i> `;
            };
            //IF OBJECT IS A DIRECTORY
            if(data[i].type === "dir"){
                myHTML += `<i style="color: green" class='folder outline icon'></i> `;
            };
            myHTML += `${data[i].name}`;
            myHTML += `</li>`;
        };

        myHTML += `</ul>`;

        $(this.el.nativeElement).find('.directory-file').append(myHTML);
        console.log("all done!");

    }


}























