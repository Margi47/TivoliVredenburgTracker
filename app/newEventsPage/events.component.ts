import { Component, OnInit} from "@angular/core";
import { FileSystemService } from "../shared/fileSystemService";
import { Observable } from 'rxjs/Observable';

import { action } from "ui/dialogs";

@Component({
    selector: "new-events",
    template: `
    <ActionBar title="New Events">
        <NavigationButton text="Go Back"></NavigationButton>
    </ActionBar>
    <StackLayout>
        <Button text="Choose another category" (tap)="showDialogue()"></Button>
        <events-list [events]="events$|async" [isLoading]="isLoading"></events-list>
    </StackLayout>`
})
export class EventsComponent implements OnInit{
    events$: Observable<any>;
    isLoading: boolean;
    categories: string[] = ["pop", "klassiek", "jazz", "by-night", "familie", "anders"];
   
    constructor(private fileService: FileSystemService){}

    ngOnInit(){
        this.showDialogue();
    }

    showDialogue(){
        let options = {
            title: "Category selection",
            message: "Choose category",
            cancelButtonText: "Cancel",
            actions: this.categories
        };
        action(options).then((result) => {
            this.isLoading = true;
            this.events$ = this.fileService.getNewEvents(result).map((result) => {
                this.isLoading = false;
                return result;
            });
        });
    }
}