import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/expand";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";
import { Observer } from "rxjs/Observer";
import { WebService } from "./webService";

@Injectable()
export class CounterService {
    counter: number = 0;
    counter$:Observable<number>;
    observer: Observer<number>;

    getPageCounter(): Observable<number>{  
        this.counter$ = Observable.create(
            (observer) => this.observer = observer); 
        return this.counter$;
    }

    addNextPage(){ 
        this.observer.next(this.counter++);
    }

    dropCounter(){
        this.counter = 0;
        this.observer.next(this.counter);
    }
}