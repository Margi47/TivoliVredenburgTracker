import { Component, OnInit} from "@angular/core";
import { FileSystemService } from "../shared/fileSystemService";
import { Observable } from 'rxjs/Observable';

@Component({
    selector: "new-events",
    template: `
    <ActionBar title="New Events">
        <NavigationButton text="Go Back"></NavigationButton>
    </ActionBar>
    <StackLayout><events-list [events]="events$|async" [isLoading]="isLoading"></events-list></StackLayout>`,
    styleUrls: ["./newEventsPage/events.component.css"]
})
export class EventsComponent implements OnInit{
    events$: Observable<any>;
    isLoading: boolean;
    constructor(private fileService: FileSystemService){}

    ngOnInit(){
        this.isLoading = true;
        this.events$ = this.fileService.getNewEvents().map((result) => {
            this.isLoading = false;
            return result;
        });
    }
}