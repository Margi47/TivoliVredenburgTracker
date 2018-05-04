import { Component, OnInit} from "@angular/core";
import { FileSystemService } from "../shared/fileSystemService";
import { Observable } from 'rxjs/Observable';
import { RouterExtensions } from "nativescript-angular/router";
import { action } from "ui/dialogs";
import { CounterService } from "../shared/counterService";

@Component({
    selector: "new-events",
    template: `
    <ActionBar [title]='categoryTitle'>
        <NavigationButton text="Go Back"></NavigationButton>
        <ActionItem icon="res://ic_reorder" ios.position="right" (tap)="showDialog()"></ActionItem>
    </ActionBar>
    <StackLayout>
        <events-list [events]="events$|async" [isLoading]="isLoading" [dialogShowing]="dialogShowing" [counter]="counter$|async"></events-list>
    </StackLayout>`
})
export class EventsComponent implements OnInit{
    events$: Observable<any>;
    isLoading: boolean;
    dialogShowing: boolean;
    counter$: Observable<number>;

    categories: string[] = ["pop", "classic", "jazz", "by-night", "family", "other"];
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

    constructor(private fileService: FileSystemService, private routerExtensions: RouterExtensions, private counterService: CounterService){
        this.counter$ = this.counterService.getPageCounter();
    }

    ngOnInit(){
        this.showDialog();
    }

    showDialog(){
        this.dialogShowing = true;
        let options = {
            message: "Choose a category",
            cancelButtonText: "Cancel",
            actions: this.categories
        };
        action(options).then((result) => {
            if(result != "Cancel"){
                this.dialogShowing = false;
                this.isLoading = true;
                this.categoryTitle = result;
                this.events$ = this.fileService.getNewEvents(result).map((events) => {
                    this.isLoading = false;
                    return events;
                });
            }
            else{
                this.dialogShowing = false;
                if(this.events$ == undefined){
                    this.routerExtensions.back();
                }
            }
        });
    }
}