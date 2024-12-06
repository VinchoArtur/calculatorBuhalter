import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

// Обновляем интерфейс, чтобы включить новые поля для расчета
export interface Cost {
  id: number; // Уникальный идентификатор
  name: string; // Название услуги
  price: number; // Стоимость услуги
  hourlyRate: number; // Почасовая ставка
  hours: number; // Количество часов
  costWithoutProfit: number; // Стоимость без прибыли
  costWithProfit: number; // Стоимость с прибылью
}

@Injectable({
  providedIn: 'root',
})
export class CostsService {
  private costs: Cost[] = [];

  private _costs$: BehaviorSubject<Cost[]> = new BehaviorSubject<Cost[]>([]);


  get costs$(): BehaviorSubject<Cost[]> {
    return this._costs$;
  }

  set costs$(value: Cost[]) {
    this._costs$.next(value);
  }

  constructor() {
    this.loadFromLocalStorage();
  }

  // Получить список затрат
  getCosts(): Cost[] {
    return this.costs;
  }


  // Добавить новую затрату
  addCost(cost: Cost): void {
    const newCost: Cost = { ...cost }; // Генерация ID
    newCost.costWithoutProfit = this.calculateCostWithoutProfit(newCost);
    newCost.costWithProfit = this.calculateCostWithProfit(newCost);
    this.costs.push(newCost);
    this.costs$ = this.costs;
    this.saveToLocalStorage();
  }

  // Удалить затрату
  deleteCost(id: number): void {
    this.costs = this.costs.filter((cost) => cost.id !== id);
    this.saveToLocalStorage();
  }

  // Сохранение данных в localStorage
  private saveToLocalStorage(): void {
    localStorage.setItem('costs', JSON.stringify(this.costs));
  }

  // Загрузка данных из localStorage
  private loadFromLocalStorage(): void {
    const data = localStorage.getItem('costs');
    if (data) {
      this.costs = JSON.parse(data);
    } else {
      // Дефолтные значения, если localStorage пуст
      this.costs = [ ];
    }
  }

  // Метод для расчета стоимости без прибыли
  private calculateCostWithoutProfit(cost: Cost): number {
    return cost.hourlyRate * cost.hours;
  }

  // Метод для расчета стоимости с прибылью (35%)
  private calculateCostWithProfit(cost: Cost): number {
    return this.calculateCostWithoutProfit(cost) * 1.35;
  }
}
