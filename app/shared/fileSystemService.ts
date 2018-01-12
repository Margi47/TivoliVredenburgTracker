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
    private oldEvents: Record[];
    private file: File;

    constructor(private webService: WebService) {
        this.file = knownFolders.documents().getFolder("history").getFile("history.txt");
    }

    getNewEvents(): Observable<MusEvent[]>{
        //getting all events, then getting old events, comparing, writing to file
        return this.webService.getAllEvents().last().mergeMap(newEvents =>{
            return this.getHistory().map(records => {
                if (records.length != 0){
                    let eventsToAdd: MusEvent[] = [];
                    for(let newEv of newEvents){
                        let isNew = true;

                        for(let rec of records){
                            for(let oldEv of rec.musEvents){
                                if(newEv.year == oldEv.year && newEv.month == oldEv.month 
                                    && newEv.day == oldEv.day && newEv.name == oldEv.name){
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
                return this.pushEventsToFile(result);
            }
            else{
                return Observable.of(result);
            }
        });

    }

    getHistory(): Observable<Record[]>{
        return Observable.fromPromise(this.file.readText()
            .then(res => {
                if(res.length > 0){
                    let result = JSON.parse(res);
                    this.oldEvents = result;
                    return result.reverse();
                }
                else{
                    this.oldEvents = [];
                    return [];
                }
            }).catch(err => {
                console.log("file error");
            }));
    }

    pushEventsToFile(events): Observable<MusEvent[]>{
        let date = new Date();
        let dd = date.getDate();
        let mm = date.getMonth()+1;
        let yyyy = date.getFullYear();
        let todayRecord:Record = {checkDate: yyyy.toString()+'-'+mm.toString()+'-'+dd.toString(), musEvents: events};
        this.oldEvents.push(todayRecord);
        //pushes new updated array as a string
        return Observable.fromPromise(this.emptyFile()
                .then(() => this.file.writeText(JSON.stringify(this.oldEvents))
                    .then(() => events)));
    }

    emptyFile(): Promise<void>{
        //removes old file and creates emty one
        return this.file.remove().then(()=> {this.file = knownFolders.documents().getFolder("history").getFile("history.txt");});
    }
}