import { Component, OnInit} from "@angular/core";
import { FileSystemService } from "../shared/fileSystemService";
import { Observable } from 'rxjs/Observable';

@Component({
    selector: "history",
    template: '<StackLayout><records-list [records]="records$|async"></records-list></StackLayout>'
})
export class HistoryComponent implements OnInit{
    records$: Observable<any>;
    constructor(private fileService: FileSystemService){}

    ngOnInit(){
        this.records$ = this.fileService.getHistory();
    }
}