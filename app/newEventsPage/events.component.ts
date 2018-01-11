import { Component, OnInit} from "@angular/core";
import { FileSystemService } from "../shared/fileSystemService";
import { Observable } from 'rxjs/Observable';

@Component({
    selector: "new-events",
    template: '<StackLayout><events-list [events]="events$|async"></events-list></StackLayout>',
    styleUrls: ["./newEventsPage/events.component.css"]
})
export class EventsComponent implements OnInit{
    events$: Observable<any>;
    constructor(private fileService: FileSystemService){}

    ngOnInit(){
        this.events$ = this.fileService.getNewEvents();
    }
}