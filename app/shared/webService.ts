import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/expand";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";

import { MusEvent } from "./musEvent";

@Injectable()
export class WebService {
    constructor(private http: Http) {}

    getAllEvents(category: string): Observable<MusEvent[]>{     
        let newEvents: MusEvent[] = [];
        let page = 1;
        let curDate = new Date();
        let year = curDate.getFullYear();
        let month = curDate.getMonth()+1; //month numbers start from 0
        let request$ = this.getEventsByDate(page, year, month,category);

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
                        if (day < curDate.getDate()){
                            let name = val.title.indexOf("&#") !=-1 ? val.title.replace(/&#.+.+.+.+;/gi, "&") : val.title;                          
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
                    return this.getEventsByDate(page, year, month, category);
                }
            }).map(() => newEvents);
    }

    getEventsByDate(page, year, month, category): Observable<any>{
        console.log(month.toString());
        var monthString = month<10?"0"+month.toString():month.toString(); //adjusting month to xx format
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