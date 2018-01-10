import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/expand";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";
import { knownFolders, File, Folder } from "file-system";

import { MusEvent } from "./musEvent";

@Injectable()
export class EventsService {
    private oldEvents: MusEvent[];
    private newEvents: MusEvent[];
    private folder = knownFolders.documents().getFolder("history");
    private fileName = "history.txt";
    private page;
    private year;
    private month;
    constructor(private http: Http) {}

    getAllEvents(){
        this.getOldEvents();       
        this.newEvents = [];
        this.page = 1;
        let curDate = new Date();
        this.year = curDate.getFullYear();
        this.month = curDate.getMonth()+1;
        let request$ = this.getEventsByDate(this.page, this.year, this.month);

        return request$
            .expand(response => {
                if(response.toString() == "false"){  
                    if(this.page >1){
                        this.page = 1;
                        this.year = this.month==12?++this.year:this.year;
                        this.month = this.month==12?1:++this.month;
                        return this.getEventsByDate(this.page,this.year,this.month);
                    }
                    else{                            
                        console.log(this.newEvents.length, this.oldEvents.length);
                        this.pushEventsToFile();
                        return Observable.empty();                
                    }
                }
                else{  
                    this.parseResponse(response);

                    this.page += 1;
                    return this.getEventsByDate(this.page, this.year, this.month);
                }
            }).map(() => this.newEvents);
    }

    getEventsByDate(page, year, month){
        console.log(page, year, month);
        var monthString = month<10?"0"+month.toString():month.toString();
        return this.http.get(`https://www.tivolivredenburg.nl/wp-admin/admin-ajax.php?action=get_events&page=${page}&maand=${year.toString()+monthString}&category=pop`)
            .map(response => response.json());
    }

    getOldEvents(){
        this.folder.getFile(this.fileName).readText()
            .then(res => {
                console.log("trying");
                if(res.length > 0){
                    console.log("Parsing");
                    this.oldEvents = JSON.parse(res);
                }
            }).catch(err => {
                console.log("file error");
            });
    }

    pushEventsToFile(){
        this.folder.getFile(this.fileName).writeText(JSON.stringify(this.newEvents)).then(() =>{
            this.folder.getFile(this.fileName).readText().then(result => console.log(JSON.parse(result).length));
        })
    }

    emptyFile(){
        
        this.folder.getFile(this.fileName).remove().then(()=> console.log("removed"));
    }

    parseResponse(response){
        for(let val of response){
            var name = val.title;
            var timeText = val.day.split(" ");                     
            var day = timeText[1]; 
            var newEvent = true;
            if(this.oldEvents.length > 0){
                console.log("comparing");
                for(let old of this.oldEvents){
                    if(old.year == this.year && old.month == this.month 
                        && old.name == name && old.day == day){
                        newEvent = false;
                    }
                }                                                   
            }

            if(newEvent){    
                let nEv: MusEvent = {year: this.year, month: this.month, day: day, name: name};              
                this.newEvents.push(nEv);   
            }           
        }
    }
}