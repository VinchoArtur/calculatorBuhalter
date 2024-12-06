import {ChangeDetectorRef, Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Cost, CostsService } from '../../../services/costs/costs.service';
import {CurrencyPipe, NgForOf} from "@angular/common";
import {MatRipple} from "@angular/material/core";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    NgForOf,
    MatRipple,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent {
  constructor(private cd: ChangeDetectorRef, private readonly costsService: CostsService) {
  }
  displayedColumns: string[] = ['name', 'hourlyRate', 'hours', 'costWithoutProfit', 'costWithProfit', 'actions'];
  costs = [
    { name: 'Услуга 1', hourlyRate: 500, hours: 2, costWithoutProfit: 1000, costWithProfit: 1350, id: 1 },
    { name: 'Услуга 2', hourlyRate: 600, hours: 3, costWithoutProfit: 1800, costWithProfit: 2430, id: 2 },
    // Ваши данные
  ];

  newCost = {
    name: '',
    hourlyRate: 0,
    hours: 0
  };

  addCost() {
    const cost: Cost = {
      price: 0,
      ...this.newCost,
      costWithoutProfit: this.calculateCostWithoutProfit(),
      costWithProfit: this.calculateCostWithProfit(),
      id: this.costs.length + 1 // Простой способ создания уникального ID
    };
    this.costs = [...this.costs, cost] // Создание нового массива
    this.costsService.addCost(cost);
    this.cd.detectChanges();
  }

  calculateCostWithoutProfit(): number {
    return this.newCost.hourlyRate * this.newCost.hours;
  }

  calculateCostWithProfit(): number {
    return this.calculateCostWithoutProfit() * 1.35; // Добавление 35% прибыли
  }

  deleteCost(id: number) {
    this.costs = this.costs.filter(cost => cost.id !== id);
  }

  resetForm() {
    this.newCost = { name: '', hourlyRate: 0, hours: 0 };
  }

  trackById(index: number, item: any): any {
    return item.id;  // Возвращаем уникальный идентификатор
  }

}
