import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class FileSplitter{

    public fullDirectory:any[] = [];

    constructor(private _http: Http){

    }

    rootDirectorySplit(data, dirLevel){
        let anotherDirectory = [];
        for(let i in data){
            let singleData = data[i];
            let splitObject;
            //IF FILE
            if(singleData.type === "file"){
                let returnLanguage = this.findLanguage(singleData.name);
                splitObject = {
                    url: singleData.git_url,
                    path: singleData.path,
                    type: singleData.type,
                    name: singleData.name,
                    language: returnLanguage,
                    level: dirLevel
                }
            }
            //IF DIRECTORY
            if(singleData.type === "dir"){
                splitObject = {
                    language: "none",
                    path: singleData.path,
                    url: singleData.url,
                    type: singleData.type,
                    name: singleData.name,
                    level: dirLevel
                }
            }

            if(dirLevel > 1){
                anotherDirectory.push(splitObject);
            }

            //AFTER FINISHING THIS SINGLE OBJECT, PUSH IT TO THE ARRAY
            this.fullDirectory.push(splitObject);

        };
        if(dirLevel > 1){
            return anotherDirectory;
        }else{
            return this.fullDirectory;
        }
    }

    findLanguage(name){
        let searchHTML = name.search("html");
        let searchTS = name.search("ts");
        let searchJSON = name.search("json");
        let searchPHP = name.search("php");
        let searchPYTHON = name.search("py");

        if(searchPHP >= 1){
            return "php";
        } else if(searchHTML >= 1){
            return "markup";
        } else if(searchJSON >= 1){
            return "json";
        }else if(searchPYTHON >= 1){
            return "py";
        }else if(searchTS){
            return "typescript";
        } else{
            return "javascript";
        };
    }


    splitUpFile(){

    }

    splitUpDirectory(){

    }

    emptyDirectory(){
        this.fullDirectory = [];
        return "success!";
    }

}
