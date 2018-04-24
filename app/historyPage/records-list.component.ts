import { Component, Input} from "@angular/core";
import { Observable } from 'rxjs/Observable';

@Component({
    selector: "records-list",
    templateUrl: `./historyPage/records-list.component.html`
})
export class RecordsListComponent{
    @Input() records: any[];
    @Input() isLoading:boolean;
    @Input() dialogShowing: boolean;
}