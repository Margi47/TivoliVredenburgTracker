import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

import { MenuComponent } from "../menuPage/menu.component";
import { EventsComponent } from "../newEventsPage/events.component";
import { EventsListComponent } from "../newEventsPage/events-list.component";
import { HistoryComponent } from "../historyPage/history.component";
import { RecordsListComponent } from "../historyPage/records-list.component";
import { WebService } from "./webService";
import { FileSystemService } from "./fileSystemService";
import { CounterService } from "./counterService";

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
import { NativeScriptHttpModule } from "nativescript-angular/http";
var Orientation = require("nativescript-orientation");

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpModule
    ],
    declarations: [
        AppComponent,
        MenuComponent,
        EventsComponent,
        EventsListComponent,
        HistoryComponent,
        RecordsListComponent
    ],
    providers: [
        WebService,
        FileSystemService,
        CounterService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {}
