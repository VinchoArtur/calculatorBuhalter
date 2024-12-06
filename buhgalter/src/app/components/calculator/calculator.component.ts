import {Component, OnChanges, OnInit} from '@angular/core';
import {Cost, CostsService} from "../../services/costs/costs.service";
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from "@angular/forms";
import { CurrencyPipe } from "@angular/common";
import { MatCheckbox } from "@angular/material/checkbox";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
@UntilDestroy()
@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    MatTableModule,
    MatCheckbox
  ],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit, OnChanges{
  costs: (Cost & { selected?: boolean })[] = [];
  minPrice = 0;
  currentPrice = 0;

  constructor(private costsService: CostsService) {
    this.loadCosts();
  }

  ngOnInit(): void {
    this.loadCosts();
    this.costsService.costs$.pipe(untilDestroyed(this)).subscribe(costs => {this.costs = costs;});
  }

  ngOnChanges(): void {
    this.loadCosts();

  }

  // Загрузить затраты (жестко заданные)
  loadCosts(): void {
    this.costs = this.costsService.getCosts().map((cost) => ({
      ...cost,
      selected: false,
      costWithoutProfit: this.calculateCostWithoutProfit(cost),
      costWithProfit: this.calculateCostWithProfit(cost)
    }));
    this.recalculate();
  }

  // Пересчитать итоговые суммы
  recalculate(): void {
    this.minPrice = this.costs
      .filter((cost) => cost.selected)
      .reduce((acc, cost) => acc + (cost.costWithoutProfit || 0), 0);
    this.currentPrice = this.costs
      .filter((cost) => cost.selected)
      .reduce((acc, cost) => acc + (cost.costWithProfit || 0), 0);
  }

  // Вычислить стоимость без 35% прибыли
  calculateCostWithoutProfit(cost: Cost): number {
    return cost.hourlyRate * cost.hours;
  }

  // Вычислить стоимость с 35% прибыли
  calculateCostWithProfit(cost: Cost): number {
    return cost.costWithoutProfit! * 1.35; // 35% прибыли
  }


  // Обработать изменение выбора услуги
  toggleSelection(cost: Cost & { selected?: boolean }): void {
    cost.selected = !cost.selected;
    this.recalculate();
  }
}
