import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/expand";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";

import { MusEvent } from "./musEvent";

@Injectable()
export class EventsService {
    constructor(private http: Http) {}

    getAllEvents(){
        var curDate = new Date();
        var newEvents = [];
        var page = 1;
        var year = curDate.getFullYear();
        var month = curDate.getMonth()+1;
        var request$ = this.getEventsByDate(page, year, month);

        return request$
            .expand(response => {
                if(response.toString() == "false"){  
                    console.log("false"); 
                    if(page >1){
                        page = 1;
                        year = month==12?++year:year;
                        month = month==12?1:++month;
                        return this.getEventsByDate(page,year,month);
                    }
                    else{
                        console.log(newEvents.length);
                        return Observable.empty();                
                    }
                }
                else{  
                    console.log("true"); 
                    for(let val of response){
                        var name = val.title;
                        var timeText = val.day.split(" ");                     
                        var day = timeText[1];                 
                        newEvents.push({year: year, month: month, day: day, name: name});              
                    }

                    page += 1;
                    return this.getEventsByDate(page, year, month);
                }
            }).map(() => newEvents);
    }

    getEventsByDate(page, year, month){
        console.log(page, year, month);
        var monthString = month<10?"0"+month.toString():month.toString();
        return this.http.get(`https://www.tivolivredenburg.nl/wp-admin/admin-ajax.php?action=get_events&page=${page}&maand=${year.toString()+monthString}&category=pop`)
            .map(response => response.json());
    }
}