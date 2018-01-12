import { Component, OnInit} from "@angular/core";
import { FileSystemService } from "../shared/fileSystemService";
import { Observable } from 'rxjs/Observable';

@Component({
    selector: "history",
    template: `
    <ActionBar title="History">
        <NavigationButton text="Go Back"></NavigationButton>
    </ActionBar>
    <StackLayout><records-list [records]="records$|async" [isLoading]="isLoading"></records-list></StackLayout>`
})
export class HistoryComponent implements OnInit{
    records$: Observable<any>;
    isLoading: boolean;
    constructor(private fileService: FileSystemService){}

    ngOnInit(){
        this.isLoading = true;
        this.records$ = this.fileService.getHistory().map((result) => {
            this.isLoading = false;
            return result;
        });;
    }
}