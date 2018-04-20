import { Component, OnInit} from "@angular/core";
import { FileSystemService } from "../shared/fileSystemService";
import { Observable } from 'rxjs/Observable';

import { action } from "ui/dialogs";

@Component({
    selector: "history",
    template: `
    <ActionBar title="History">
        <NavigationButton text="Go Back"></NavigationButton>
    </ActionBar>
    <StackLayout>
        <Button text="Choose another category" (tap)="showDialogue()"></Button>
        <records-list [records]="records$|async" [isLoading]="isLoading"></records-list>
    </StackLayout>`
})
export class HistoryComponent implements OnInit{
    records$: Observable<any>;
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
            this.records$ = this.fileService.getHistory("pop").map((result) => {
                this.isLoading = false;
                return result;
            });;
        });
    }
}