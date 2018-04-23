import { Component, OnInit} from "@angular/core";
import { FileSystemService } from "../shared/fileSystemService";
import { Observable } from 'rxjs/Observable';

import { action } from "ui/dialogs";

@Component({
    selector: "history",
    template: `
    <ActionBar [title]='categoryTitle'>
        <NavigationButton text="Go Back"></NavigationButton>
    </ActionBar>
    <StackLayout>
        <Button text="Choose another category" (tap)="showDialog()"></Button>
        <records-list [records]="records$|async" [isLoading]="isLoading" [dialogShowing]="dialogShowing"></records-list>
    </StackLayout>`
})
export class HistoryComponent implements OnInit{
    records$: Observable<any>;
    isLoading: boolean;
    dialogShowing: boolean;

    categories: string[] = ["pop", "klassiek", "jazz", "by-night", "familie", "anders"];
    private _categoryTitle: string;
    get categoryTitle(): string{
        if (this._categoryTitle == null){
            return "History";
        }
        else{
            return this._categoryTitle;
        }
    }
    set categoryTitle(value: string){
        this._categoryTitle = value.charAt(0).toUpperCase().concat(value.substring(1), " history"); 
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
            this.records$ = this.fileService.getHistory(result).map((records) => {
                this.isLoading = false;     
                return records;
            });;
        });
    }
}