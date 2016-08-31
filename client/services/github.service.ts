import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";

@Injectable()
export class GithubService{

    testArg ="sdfsdf";
    secretToken:string= "<GITHUB API KEY>";

    constructor(private _http: Http){

    }

    getSouceCodeStructure(first_param, second_param){
        let first = first_param;
        let second = second_param;
        let setupUrl = `https://api.github.com/repos/${first}/${second}/contents?access_token=${this.secretToken}`;


        return this._http.get(setupUrl).map((res:Response) => res.json()).catch(this.handleError);

    }


    getFileContent(dataUrl){
        let setupUrl = `${dataUrl}?access_token=${this.secretToken}`;
        return this._http.get(setupUrl, {headers: {"Accept": "application/vnd.github-blob.raw"}}).catch(this.handleError);
    }

    getAdditionalDirectory(dataUrl){
        let setupUrl = `${dataUrl}&access_token=${this.secretToken}`;
        return this._http.get(setupUrl, {headers: {"Accept": "application/vnd.github-blob.raw"}})
            .map((res:Response) => res.json())
                .catch(this.handleError);
    }



    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}
