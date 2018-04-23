import { Component, OnInit} from "@angular/core";
import { FileSystemService } from "../shared/fileSystemService";
import { Observable } from 'rxjs/Observable';

import { action } from "ui/dialogs";

@Component({
    selector: "new-events",
    template: `
    <ActionBar [title]='categoryTitle'>
        <NavigationButton text="Go Back"></NavigationButton>
    </ActionBar>
    <StackLayout>
        <Button text="Choose another category" (tap)="showDialog()"></Button>
        <events-list [events]="events$|async" [isLoading]="isLoading" [dialogShowing]="dialogShowing"></events-list>
    </StackLayout>`
})
export class EventsComponent implements OnInit{
    events$: Observable<any>;
    isLoading: boolean;
    dialogShowing: boolean;

    categories: string[] = ["pop", "klassiek", "jazz", "by-night", "familie", "anders"];
    private _categoryTitle: string;
    get categoryTitle(): string{
        if (this._categoryTitle == null){
            return "New Events";
        }
        else{
            return this._categoryTitle;
        }
    }
    set categoryTitle(value: string){
        this._categoryTitle = String().concat("New ", value.charAt(0).toUpperCase(), value.substring(1), " events"); 
    }

    constructor(private fileService: FileSystemService){}

    ngOnInit(){
        this.showDialog();
    }

    showDialog(){
        this.dialogShowing = true;
        let options = {
            title: "Category selection",
            message: "Choose category",
            cancelButtonText: "Cancel",
            actions: this.categories
        };
        action(options).then((result) => {
            this.dialogShowing = false;
            this.isLoading = true;
            this.categoryTitle = result;
            this.events$ = this.fileService.getNewEvents(result).map((events) => {
                this.isLoading = false;
                return events;
            });
        });
    }
}