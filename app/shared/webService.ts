import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/expand";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";

import { MusEvent } from "./musEvent";
import { CounterService } from "./counterService";

import * as s from "string";

@Injectable()
export class WebService {
    public counter:number;
    constructor(private http: Http, private counterService: CounterService) {}

    getAllEvents(category: string): Observable<MusEvent[]>{   
        this.counterService.dropCounter();  
        let newEvents: MusEvent[] = [];
        let page = 1;
        let curDate = new Date();
        let year = curDate.getFullYear();
        let month = curDate.getMonth()+1; //month numbers start from 0
        let requestCategory: string;
        if(category == "classic"){
            requestCategory = "klassiek";
        }
        else if(category == "family"){
            requestCategory = "familie";
        }
        else if(category == "other"){
            requestCategory = "anders";
        }
        else{
            requestCategory = category;
        }
        let request$ = this.getEventsByDate(page, year, month,requestCategory);

        return request$
            .expand(response => {
                if(response == null){  
                    if(page >1){ //if current month is not empty,switching to next one 
                        page = 1;
                        year = month==12?++year:year;
                        month = month==12?1:++month;
                        return this.getEventsByDate(page,year,month,category);
                    }
                    else{ //no more data available
                        return Observable.empty();               
                    }
                }
                else{  
                    for(let val of response){
                        let timeText = val.day.split(" ");                     
                        let day = parseInt(timeText[1]);

                        //check for relevance
                        if (day >= curDate.getDate() || month > curDate.getMonth()+1 || year > curDate.getFullYear()){
                            let name:string = s(val.title).decodeHTMLEntities().s;                   
                            var monthString = month<10?"0"+month.toString():month.toString(); 
                            var dayString = day<10?"0"+day.toString():day.toString();
                            let nEv: MusEvent = {
                                date: year.toString() + '/' + monthString + '/' + dayString, 
                                name: name
                            };              
                            newEvents.push(nEv); 
                        }
                    }
                    page += 1;
                    return this.getEventsByDate(page, year, month, requestCategory);
                }
            }).map(() => newEvents);
    }

    getEventsByDate(page, year, month, category): Observable<any>{
        console.log(month.toString());
        var monthString = month<10?"0"+month.toString():month.toString(); //adjusting month to xx format
        this.counterService.addNextPage();
        return this.http.get(`https://www.tivolivredenburg.nl/wp-admin/admin-ajax.php?action=get_events&page=${page}&maand=${year.toString()+monthString}&categorie=${category}`)
            .map(response => {
                if(response.text() == "false"){
                    return null;
                }
                else{
                    return response.json();
                }
            });
    }    
}