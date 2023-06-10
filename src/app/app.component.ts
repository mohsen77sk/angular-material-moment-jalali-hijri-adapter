import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { Moment, isMoment } from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  date: Date | Moment = new Date();

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
  changeDate(value: Date | Moment) {
    // Fix change date in sample
    if (value == this.date) {
      if (isMoment(value)) {
        value = moment(value).second(value.second() + 1);
      } else {
        value = new Date(value.setSeconds(value.getSeconds() + 1));
      }
    }

    console.log(
      `Change:
      Date: ${value}
      ISO : ${value?.toISOString()}
      Local(${this._locale}): ${value.toLocaleString(this._locale)}`
    );

    this.date = value;
  }
}
