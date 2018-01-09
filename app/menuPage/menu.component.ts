import { Component} from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "menu",
    templateUrl: "./menuPage/menu.component.html",
    styleUrls: ["./menuPage/menu.component.css"]
})
export class MenuComponent {
    constructor(private router: Router){}
    getNewEvents(){
        this.router.navigate(["/newEvents"]);
    }
    showHistory(){}
}