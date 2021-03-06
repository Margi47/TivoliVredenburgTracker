import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { MenuComponent } from "../menuPage/menu.component";
import { EventsComponent } from "../newEventsPage/events.component";
import { HistoryComponent } from "../historyPage/history.component";

const routes: Routes = [
    { path: "", redirectTo: "/menu", pathMatch: "full" },
    { path: "menu", component: MenuComponent },
    { path: "newEvents", component: EventsComponent },
    { path: "history", component: HistoryComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}