import { Routes } from '@angular/router';
import {CalculatorComponent} from "./components/calculator/calculator.component";
import {AdminPanelComponent} from "./admin/panel/admin-panel/admin-panel.component";

const routes: Routes = [
  { path: 'admin', component: AdminPanelComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: '', redirectTo: '/calculator', pathMatch: 'full' },
];

export default routes;
