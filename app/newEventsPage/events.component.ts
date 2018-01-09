import { Component, OnInit} from "@angular/core";
import { EventsService } from "../shared/eventsService";
import { Observable } from 'rxjs/Observable';

@Component({
    selector: "new-events",
    template: '<StackLayout><events-list [events]="events$|async"></events-list></StackLayout>',
    styleUrls: ["./newEventsPage/events.component.css"]
})
export class EventsComponent implements OnInit{
    events$: Observable<any>;
    constructor(private eventsService: EventsService){
    }

    ngOnInit(){
        this.events$ = this.eventsService.getAllEvents();
    }
}