import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  date = new Date();

  /**
   * constructor
   */
  constructor(
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) public _locale: any
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Change locale to input value
   *
   * @param value
   */
  changeLocale(value: 'en-US' | 'fa-IR' | 'ar-SA'): void {
    this._locale = value;
    this._adapter.setLocale(this._locale);

    this.changeDate(this.date);
  }

  /**
   * Check is current locale
   *
   * @param value
   */
  isLocale(value: string | string[]): boolean {
    return Array.isArray(value)
      ? value.some((x) => x === this._locale)
      : this._locale === value;
  }

  /**
   * Change datepicker
   *
   * @param value
   */
  changeDate(value: Date) {
    console.log(
      `Change:
      Date: ${value}
      ISO : ${value?.toISOString()}
      Local(${this._locale}): ${value.toLocaleString(this._locale)}`
    );

    this.date = value;
  }
}
