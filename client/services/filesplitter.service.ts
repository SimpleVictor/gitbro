import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class FileSplitter{

    fullDirectory:any[] = [];

    constructor(private _http: Http){

    }

    rootDirectorySplit(data, dirLevel){
        for(let i in data){
            let singleData = data[i];
            let splitObject;
            //IF FILE
            if(singleData.type === "file"){
                splitObject = {
                    url: singleData.git_url,
                    type: singleData.type,
                    name: singleData.name,
                    level: dirLevel
                }
            }
            //IF DIRECTORY
            if(singleData.type === "dir"){
                splitObject = {
                    url: singleData.url,
                    type: singleData.type,
                    name: singleData.name,
                    level: dirLevel
                }
            }

            //AFTER FINISHING THIS SINGLE OBJECT, PUSH IT TO THE ARRAY
            this.fullDirectory.push(splitObject);

        };
        return this.fullDirectory;
    }

    splitUpFile(){

    }

    splitUpDirectory(){

    }

}
