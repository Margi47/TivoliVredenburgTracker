import { Component, Input, OnChanges } from "@angular/core";

@Component({
    selector: "events-list",
    templateUrl: "./newEventsPage/events-list.component.html"
})
export class EventsListComponent implements OnChanges{
    @Input() events: any[];

    ngOnChanges(){
        //console.log(this.events.length);
    }
}