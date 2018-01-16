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

    pushEventsToFile(events): Observable<MusEvent[]>{
        let date = new Date();
        let dd = date.getDate();
        let monthNum = date.getMonth() +1;
        let mm = monthNum<10?"0"+monthNum.toString():monthNum.toString();
        let yy = date.getFullYear();
        let checkDate = yy.toString()+'/'+mm.toString()+'/'+dd.toString()
        let todayRecord:Record = {checkDate: checkDate, musEvents: events};
        this.oldRecords.push(todayRecord);

        //pushes new updated array as a string
        return Observable.fromPromise(this.emptyFile()
                .then(() => this.file.writeText(JSON.stringify(this.getClearedData(monthNum, yy)))
                    .then(() => events)));
    }

    emptyFile(): Promise<void>{
        //removes old file and creates emty one
        return this.file.remove().then(()=> {this.file = knownFolders.documents().getFolder("history").getFile("history.txt");});
    }

    getClearedData(month: number, year: number): Record[]{
        for(let rec of this.oldRecords){
            for(let eve of rec.musEvents){
                let yy = parseInt(eve.date.substring(0,4));
                let mm = parseInt(eve.date.substring(6,7));
                if(yy < year || mm < month){
                    rec.musEvents.splice(rec.musEvents.indexOf(eve),1);
                }
            }
        }
        return this.oldRecords;
    }
}