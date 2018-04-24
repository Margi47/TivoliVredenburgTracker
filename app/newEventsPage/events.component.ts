import { Component, OnInit} from "@angular/core";
import { FileSystemService } from "../shared/fileSystemService";
import { Observable } from 'rxjs/Observable';
import { RouterExtensions } from "nativescript-angular/router";
import { action } from "ui/dialogs";

@Component({
    selector: "new-events",
    template: `
    <ActionBar [title]='categoryTitle'>
        <NavigationButton text="Go Back"></NavigationButton>
        <ActionItem (tap)="showDialog()"
            ios.systemIcon="12" ios.position="right"
            android.systemIcon="ic_menu_search"></ActionItem>
    </ActionBar>
    <StackLayout>
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

    constructor(private fileService: FileSystemService, private routerExtensions: RouterExtensions){}

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
                this.routerExtensions.back();
            }
        });
    }
}