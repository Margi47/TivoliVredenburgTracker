import { Component, Input, OnChanges} from "@angular/core";

@Component({
    selector: "events-list",
    templateUrl: "./newEventsPage/events-list.component.html"
})
export class EventsListComponent implements OnChanges{
    @Input() events: any[];
    @Input() isLoading: boolean;
    @Input() dialogShowing: boolean;
    @Input() counter: number[];

    ngOnChanges(){
        console.log(this.counter);
    }
}