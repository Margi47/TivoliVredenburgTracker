import { Component, Input} from "@angular/core";
import { EventsService } from "../shared/eventsService";
import { Observable } from 'rxjs/Observable';

@Component({
    selector: "records-list",
    templateUrl: `./historyPage/recordsList.component.html`,
})
export class RecordsListComponent{
    @Input() records: any[];
}