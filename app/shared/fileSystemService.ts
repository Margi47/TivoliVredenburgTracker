import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/expand";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/last";
import { knownFolders, File, Folder } from "file-system";

import { MusEvent } from "./musEvent";
import { Record } from "./record";

import { WebService } from "../shared/webService";

@Injectable()
export class FileSystemService {
    private oldRecords: Record[];

    constructor(private webService: WebService) {}

    getNewEvents(category: string): Observable<MusEvent[]>{
        //getting all events, then getting old events, comparing, writing to file
        return this.webService.getAllEvents(category).last().mergeMap(newEvents =>{
            return this.getHistory(category).map(records => {
                if (records.length != 0){
                    let eventsToAdd: MusEvent[] = [];
                    for(let newEv of newEvents){
                        let isNew = true;

                        for(let rec of records){
                            for(let oldEv of rec.musEvents){
                                if(newEv.date == oldEv.date && newEv.name == oldEv.name){
                                        isNew = false;
                                }
                            }
                        }

                        if(isNew){
                            eventsToAdd.push(newEv);
                        }
                    }
                    return eventsToAdd;
                }
                else{
                    return newEvents;
                }
            })
        }).switchMap(result =>{
            if(result.length > 0){
                return this.pushEventsToFile(result, category);
            }
            else{
                return Observable.of(result);
            }
        });

    }

    getHistory(category: string): Observable<Record[]>{
        return Observable.fromPromise(this.getFile(category).readText()
            .then(res => {
                console.log(this.getFile(category).name);
                console.log(res);
                if(res.length > 0){
                    let result = JSON.parse(res);
                    this.oldRecords = result;
                    return result.reverse();
                }
                else{
                    this.oldRecords = [];
                    return [];
                }
            }).catch(err => {
                console.log("file error");
            }));
    }

    removeHistory(): Promise<void>{
        return knownFolders.documents().getFolder("history").remove();
    }

    getFile(category: string){
        switch(category){
            case "pop" : {
                 return knownFolders.documents().getFolder("history").getFile("pophistory.txt");
            }
            case "klassiek" : {
                return knownFolders.documents().getFolder("history").getFile("klassiekhistory.txt");
            }
            case "jazz" : {
                return knownFolders.documents().getFolder("history").getFile("jazzhistory.txt");
            }
            case "by-night" : {
                return knownFolders.documents().getFolder("history").getFile("bynighthistory.txt");
            }
            case "familie" : {
                return knownFolders.documents().getFolder("history").getFile("familiehistory.txt");
            }
            case "anders" : {
                return knownFolders.documents().getFolder("history").getFile("andershistory.txt");
            }
        }
    }

    pushEventsToFile(events, category): Observable<MusEvent[]>{
        let file = this.getFile(category);
        let date = new Date();
        let dd = date.getDate();
        let monthNum = date.getMonth() +1;
        let mm = monthNum<10?"0"+monthNum.toString():monthNum.toString();
        let yy = date.getFullYear();
        let checkDate = yy.toString()+'/'+mm.toString()+'/'+dd.toString()
        let todayRecord:Record = {checkDate: checkDate, musEvents: events};
        this.oldRecords.push(todayRecord);

        //pushes new updated array as a string
        return Observable.fromPromise(file.remove()
            .then(()=> this.getFile(category))
                .then(() => file.writeText(JSON.stringify(this.getClearedData(monthNum, yy)))
                    .then(() => events)));
    }

    getClearedData(month: number, year: number): Record[]{
        for(let rec of this.oldRecords){
            for(let eve of rec.musEvents){
                let yy = parseInt(eve.date.substring(0,4));
                let mm = parseInt(eve.date.substring(6,7));
                if(yy < year || mm < month ){
                    rec.musEvents.splice(rec.musEvents.indexOf(eve),1);
                }
            }
        }
        return this.oldRecords;
    }
}