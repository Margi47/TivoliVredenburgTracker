import { Component} from "@angular/core";
import { Router } from "@angular/router";
import { FileSystemService } from "../shared/fileSystemService";
import * as dialogs from "ui/dialogs";

@Component({
    selector: "menu",
    templateUrl: "./menuPage/menu.component.html",
    styleUrls: ["./menuPage/menu.component.css"]
})
export class MenuComponent {
    constructor(private router: Router, private fileService: FileSystemService){}
    getNewEvents(){
        this.router.navigate(["/newEvents"]);
    }

    showHistory(){
        this.router.navigate(["/history"]);
    }

    clearHistory(){
        this.fileService.emptyFile().then(() => dialogs.alert({
            title: "Done",
            message: "History cleaned",
            okButtonText: "Ok"
        }).then(()=> {
            console.log("Dialog closed!");
        }));
    }
}