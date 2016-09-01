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

    OpenedTabs: any[] = [];
    OpenedDirectory: any[] = [];



    constructor(private _gitService: GithubService, private _fileSplitter: FileSplitter, private el: ElementRef){
    }


    ngOnInit(){

        // //WE HAD TO SET IT UP THIS WAY BECAUSE "this" IS DIFFERENT INSIDE OF THE ON CLICK FUNCTION THAT JQUERY PROVIDES
        var vm = this;

            // //LISTEN FOR THE CLICK EVENTS ON THE FILES
            $(this.el.nativeElement).on("click", '.singleLI',function(data){
                //This is so the parent class's event binding doesn't get triggered as well
                data.stopImmediatePropagation();

                //Start LOADER
                // vm.searchingFile = true;

                //CHECK IF USERS CLICKS ON ARROW INSTEAD
                let newTarget;
                if( data.target.localName === "i"){
                    console.log("true");
                    newTarget = data.currentTarget.children[0];
                }else{
                    console.log("false");
                    newTarget = data.target;
                };

                let objectURL = newTarget.children[1].innerHTML;
                if (newTarget.children[2].className === 'file text outline icon') {
                    vm.currentLanguage = newTarget.children[3].innerHTML;
                    vm.fileClicked(objectURL);

                };
                if (newTarget.children[2].className === 'folder outline icon') {
                    let elementID = newTarget.id;
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
        //Delete any previous ones
        $("#directory-holder").remove();

        let liCSS = "font-size: 20px;cursor: pointer; display: table";
        let ulCSS = "list-style: none;padding: 0 20px 20px 20px;";



            let myHTML      = ``;

        myHTML          += `<ul id="directory-holder" style="${ulCSS}">`;

        for(let i in data){
            //WE USE THE RANDOM NUMBER TO GENERATE A UNIQUE ID FOR EACH DIRECTORY
            //THE USE OF THIS IS TO BE ABLE TO TOGGLE THE DIRECTORY TO CLOSE AND ALL
            let randomNum = Math.floor(Math.random()*200);
            let dataPath = data[i].path;
            let idPath = ""+dataPath+randomNum+"";

            myHTML      += `<li style="${liCSS}" class="singleLI" id="${data[i].path}">`;

            myHTML      += `<div id="${idPath}">`;

            myHTML      += `<i class="chevron right icon"></i>`;

            myHTML      += `<p style="display: none">${data[i].url}</p>`;
            //IF OBJECT IS A FILE
            if(data[i].type === "file"){
                myHTML  += `<i style="color: green" class='file text outline icon'></i> `;
                myHTML  += `<p style="display: none">${data[i].language}</p>`;
            };
            //IF OBJECT IS A DIRECTORY
            if(data[i].type === "dir"){
                myHTML  += `<i style="color: green" class='folder outline icon'></i> `;
                myHTML  += `<p style="display: none">${data[i].language}</p>`;
            };
            myHTML      += `${data[i].name}`;

            myHTML      += `</div>`;

            myHTML      += `</li>`;
        };

        myHTML          += `</ul>`;

        $(this.el.nativeElement).find('.directory-file').append(myHTML);

    }

// <i class="chevron right icon"></i>
// <i class="chevron down icon"></i>



    fileClicked(dataUrl){
        this._gitService.getFileContent(dataUrl)
            .subscribe(
                data => {
                    this.searchingFile = false;
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
        //GRAB THE DIR HTML WE SET UP BEFORE
        let targetHTML = $(`#${id}`);

        let liCSS = "font-size: 20px;cursor: pointer; display: table";
        let ulCSS = "list-style: none;padding: 0 20px 0 20px;";

        let myHTML      = "";



        myHTML          += `<ul style="${ulCSS}">`;

        for(let i in data){
            //WE USE THE RANDOM NUMBER TO GENERATE A UNIQUE ID FOR EACH DIRECTORY
            //THE USE OF THIS IS TO BE ABLE TO TOGGLE THE DIRECTORY TO CLOSE AND ALL
            let randomNum = Math.floor(Math.random()*200);
            let dataPath = data[i].path;
            let idPath = ""+dataPath+randomNum+"";

            myHTML      += `<li style="${liCSS}" class="singleLI" id="${data[i].path}">`;

            myHTML      += `<div id="${idPath}">`;

            myHTML      += `<i class="chevron right icon"></i>`;

            myHTML      += `<p style="display: none">${data[i].url}</p>`;
            //IF OBJECT IS A FILE
            if(data[i].type === "file"){
                myHTML  += `<i style="color: green" class='file text outline icon'></i> `;
                myHTML  += `<p style="display: none">${data[i].language}</p>`;
            };
            //IF OBJECT IS A DIRECTORY
            if(data[i].type === "dir"){
                myHTML  += `<i style="color: green" class='folder outline icon'></i> `;
                myHTML  += `<p style="display: none">${data[i].language}</p>`;
            };
            myHTML      += `${data[i].name}`;

            myHTML      += `</div>`;

            myHTML      += `</li>`;
        };

        myHTML          += `</ul>`;

        this.searchingFile = false;
        targetHTML.append(myHTML);





    }



    hideBar(){

        // console.log()
        $("#testMan").slideToggle();
    }





}























