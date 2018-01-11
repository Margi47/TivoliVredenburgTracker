import { Component} from "@angular/core";
import { Router } from "@angular/router";
import { EventsService } from "../shared/eventsService";

@Component({
    selector: "menu",
    templateUrl: "./menuPage/menu.component.html",
    styleUrls: ["./menuPage/menu.component.css"]
})
export class MenuComponent {
    constructor(private router: Router, private eventsService: EventsService){}
    getNewEvents(){
        this.router.navigate(["/newEvents"]);
    }

    showHistory(){
        this.router.navigate(["/history"]);
    }

    clearHistory(){
        this.eventsService.emptyFile();
    }
}