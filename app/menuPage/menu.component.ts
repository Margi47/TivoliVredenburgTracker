import { Component} from "@angular/core";
import { Router } from "@angular/router";
import { FileSystemService } from "../shared/fileSystemService";
import * as dialogs from "ui/dialogs";
import * as Toast from "nativescript-toast";

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

    cleanHistory(){
        dialogs.confirm({
            title: "Alert",
            message: "You want to delete history? This action cannot be undone.",
            okButtonText: "Ok",
            cancelButtonText: "Cancel"
        }).then(result => {
            if(result){
                this.fileService.removeHistory().then(() => Toast.makeText("History is cleaned").show());
            }
        });
    }
}