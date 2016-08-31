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

    codeOutput: string;

    //Dynamically changing current language on <code>
    currentLanguage:string;

    //LOADER
    searchingUrl:boolean = false;
    searchingFile:boolean = false;
    startNow: boolean = false;



    constructor(private _gitService: GithubService, private _fileSplitter: FileSplitter, private el: ElementRef){

    }


    ngOnInit(){
        //WE HAD TO SET IT UP THIS WAY BECAUSE "this" IS DIFFERENT INSIDE OF THE ON CLICK FUNCTION THAT JQUERY PROVIDES
        var vm = this;


        //LISTEN FOR THE CLICK EVENTS ON THE FILES
        $(this.el.nativeElement).on("click", '.singleLI',function(data){
            vm.searchingFile = true;
            let objectURL = data.target.children[0].innerHTML;
            if (data.target.children[1].className === 'file text outline icon') {
                vm.currentLanguage = data.target.children[2].innerHTML;
                vm.fileClicked(objectURL);

            };
            if (data.target.children[1].className === 'folder outline icon') {
                let elementID = data.target.id;
                vm.directoryClicked(objectURL, elementID);
            };
        });

    }

    ngDoCheck(){
        if(this.myUrl){
            console.log("loading should begin now");
            let emptyResult = this._fileSplitter.emptyDirectory();
            console.log("Emptying last query.." + emptyResult);
            this.searchingUrl = true;
            let returnState = this._gitService.getSouceCodeStructure(this.myUrl.first_param, this.myUrl.second_param)
            .subscribe(
                data => {
                    this.searchingUrl = false;
                    console.log(data);
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
        //MAKES IT SO IT APPIES THE CSS AND JS TO ALL OF "PRE"/"CODE" ELEMENTS
        Prism.highlightAll();
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

        //Delete any previous ones
        $("#directory-holder").remove();

        let liCSS = "font-size: 20px;cursor: pointer; display: table";
        let ulCSS = "list-style: none;padding: 0 20px 20px 20px;";

        let myHTML = "";

        myHTML += `<ul id="directory-holder" style="${ulCSS}">`;

        for(let i in data){

            myHTML += `<li style="${liCSS}" class="singleLI" id="${data[i].path}">`;

            myHTML += `<p style="display: none">${data[i].url}</p>`;
            //IF OBJECT IS A FILE
            if(data[i].type === "file"){
                myHTML += `<i style="color: green" class='file text outline icon'></i> `;
                myHTML += `<p style="display: none">${data[i].language}</p>`;
            };
            //IF OBJECT IS A DIRECTORY
            if(data[i].type === "dir"){
                myHTML += `<i style="color: green" class='folder outline icon'></i> `;
                myHTML += `<p style="display: none">${data[i].language}</p>`;
            };
            myHTML += `${data[i].name}`;
            myHTML += `</li>`;
        };

        myHTML += `</ul>`;

        $(this.el.nativeElement).find('.directory-file').append(myHTML);
        console.log("all done!");

    }


    fileClicked(dataUrl){
        this._gitService.getFileContent(dataUrl)
            .subscribe(
                data => {
                    this.searchingFile = false;
                    console.log(this.currentLanguage);
                    $('#mycodeoutput').empty();
                    $('#mycodeoutput').attr('class', `language-${this.currentLanguage}`);
                    $('#mycodeoutput').append(data._body);

                    // this.codeOutput = data._body;
                }, err => {
                    this.searchingFile = false;
                    console.log(err);
                }
            );
    }

    directoryClicked(dataUrl, elemID){

        this._gitService.getAdditionalDirectory(dataUrl).subscribe(
            data => {
                let returnData = this._fileSplitter.rootDirectorySplit(data, 2);
                this.OutputToHtmlAnotherDirectory(returnData, elemID);
            }, err => {
                this.searchingFile = false;
                console.log(err)
            }
        );

    }


    OutputToHtmlAnotherDirectory(data, id){
        console.log(data);
        console.log(id);

        //GRAB THE DIR HTML WE SET UP BEFORE
        let targetHTML = $(`#${id}`);




        let liCSS = "font-size: 20px;cursor: pointer; display: table";
        let ulCSS = "list-style: none;padding: 0 20px 0 20px;";

        let myHTML = "";

        myHTML += `<ul style="${ulCSS}">`;

        for(let i in data){

            myHTML += `<li style="${liCSS}" class="singleLI" id="${data[i].path}">`;

            myHTML += `<p style="display: none">${data[i].url}</p>`;
            //IF OBJECT IS A FILE
            if(data[i].type === "file"){
                myHTML += `<i style="color: green" class='file text outline icon'></i> `;
                myHTML += `<p style="display: none">${data[i].language}</p>`;
            };
            //IF OBJECT IS A DIRECTORY
            if(data[i].type === "dir"){
                myHTML += `<i style="color: green" class='folder outline icon'></i> `;
                myHTML += `<p style="display: none">${data[i].language}</p>`;
            };
            myHTML += `${data[i].name}`;
            myHTML += `</li>`;
        };

        myHTML += `</ul>`;

        this.searchingFile = false;
        targetHTML.append(myHTML);
        console.log("Second all done");





    }





}























