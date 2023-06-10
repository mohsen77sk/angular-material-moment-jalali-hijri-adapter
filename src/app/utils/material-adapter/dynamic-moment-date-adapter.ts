import { Inject, Optional } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MatMomentDateAdapterOptions,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { Number } from '../number';

import * as moment from 'moment';
import * as momentHijri from 'moment-hijri';
import * as momentJalaali from 'moment-jalaali';
momentJalaali.loadPersian({
  usePersianDigits: true,
  dialect: 'persian-modern',
});

/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

export class DynamicMomentDateAdapter extends DateAdapter<moment.Moment> {
  // Note: all of the methods that accept a `Moment` input parameter immediately call `this.clone`
  // on it. This is to ensure that we're working with a `Moment` that has the correct locale setting
  // while avoiding mutating the original object passed to us. Just calling `.locale(...)` on the
  // input would mutate the object.

  /**
   * Calendar type
   */
  private calendarType!: 'Gregorian' | 'Jalaali' | 'Hijri';

  private _localeData!: {
    firstDayOfWeek: number;
    longMonths: string[];
    shortMonths: string[];
    dates: string[];
    longDaysOfWeek: string[];
    shortDaysOfWeek: string[];
    narrowDaysOfWeek: string[];
  };

  constructor(
    @Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string,
    @Optional()
    @Inject(MAT_MOMENT_DATE_ADAPTER_OPTIONS)
    private _options?: MatMomentDateAdapterOptions
  ) {
    super();
    this.setLocale(dateLocale);
  }

  override setLocale(locale: string) {
    super.setLocale(locale);

    let momentLocaleData;
    switch (locale) {
      case 'en-US':
        this.calendarType = 'Gregorian';
        momentLocaleData = moment.localeData(locale);
        break;
      case 'fa-IR':
        this.calendarType = 'Jalaali';
        momentLocaleData = momentJalaali.localeData(locale);
        break;
      case 'ar-SA':
        this.calendarType = 'Hijri';
        momentLocaleData = momentHijri.localeData(locale);
        break;
      default:
        throw new Error(`Not Support LOCALE_ID (${locale})`);
    }

    if (this.calendarType === 'Gregorian') {
      this._localeData = {
        firstDayOfWeek: momentLocaleData.firstDayOfWeek(),
        longMonths: momentLocaleData.months(),
        shortMonths: momentLocaleData.monthsShort(),
        dates: range(31, (i) => this.createDate(2017, 0, i + 1).format('D')),
        longDaysOfWeek: momentLocaleData.weekdays(),
        shortDaysOfWeek: momentLocaleData.weekdaysShort(),
        narrowDaysOfWeek: momentLocaleData.weekdaysMin(),
      };
    } else if (this.calendarType === 'Jalaali') {
      this._localeData = {
        firstDayOfWeek: momentLocaleData.firstDayOfWeek(),
        longMonths: (momentLocaleData as any)._jMonths,
        shortMonths: (momentLocaleData as any)._jMonths, // _jMonthsShort
        dates: range(31, (i) =>
          this.createPersianDateFrom3Numbers(1397, 0, i + 1).format('jD')
        ),
        longDaysOfWeek: momentLocaleData.weekdays(),
        shortDaysOfWeek: momentLocaleData.weekdaysShort(),
        narrowDaysOfWeek: momentLocaleData.weekdaysMin(),
      };
    } else if (this.calendarType === 'Hijri') {
      this._localeData = {
        firstDayOfWeek: momentLocaleData.firstDayOfWeek(),
        longMonths: (momentLocaleData as any)._iMonths,
        shortMonths: (momentLocaleData as any)._iMonthsShort,
        dates: range(31, (i) =>
          this.createArabianDateFrom3Numbers(1440, 0, i + 1).format('iD')
        ),
        longDaysOfWeek: momentLocaleData.weekdays(),
        shortDaysOfWeek: momentLocaleData.weekdaysShort(),
        narrowDaysOfWeek: momentLocaleData.weekdaysMin(),
      };
    }
  }

  getYear(date: moment.Moment): number {
    switch (this.calendarType) {
      case 'Gregorian':
        return this.clone(date).year();
      case 'Jalaali':
        return this.clone(date).jYear();
      case 'Hijri':
        return this.clone(date).iYear();
    }
  }

  getMonth(date: moment.Moment): number {
    switch (this.calendarType) {
      case 'Gregorian':
        return this.clone(date).month();
      case 'Jalaali':
        return this.clone(date).jMonth();
      case 'Hijri':
        return this.clone(date).iMonth();
    }
  }

  getDate(date: moment.Moment): number {
    switch (this.calendarType) {
      case 'Gregorian':
        return this.clone(date).date();
      case 'Jalaali':
        return this.clone(date).jDate();
      case 'Hijri':
        return this.clone(date).iDate();
    }
  }

  getDayOfWeek(date: moment.Moment): number {
    return this.clone(date).day();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    // Moment.js doesn't support narrow month names, so we just use short if narrow is requested.
    return style === 'long'
      ? this._localeData.longMonths
      : this._localeData.shortMonths;
  }

  getDateNames(): string[] {
    return this._localeData.dates;
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (style === 'long') {
      return this._localeData.longDaysOfWeek;
    }
    if (style === 'short') {
      return this._localeData.shortDaysOfWeek;
    }
    return this._localeData.narrowDaysOfWeek;
  }

  getYearName(date: moment.Moment): string {
    switch (this.calendarType) {
      case 'Gregorian':
        return this.clone(date).year().toString();
      case 'Jalaali':
        return Number.toPersianNumber(this.clone(date).jYear());
      case 'Hijri':
        return Number.toArabianNumber(this.clone(date).iYear());
    }
  }

  getFirstDayOfWeek(): number {
    return this._localeData.firstDayOfWeek;
  }

  getNumDaysInMonth(
    date: moment.Moment | momentJalaali.Moment | momentHijri.Moment
  ): number {
    switch (this.calendarType) {
      case 'Gregorian':
        return moment(date).locale('en-US').daysInMonth();
      case 'Jalaali':
        return momentJalaali.jDaysInMonth(date.jYear(), date.jMonth());
      case 'Hijri':
        return momentHijri.iDaysInMonth(date.iYear(), date.iMonth());
    }
  }

  clone(date: moment.Moment): any {
    // return date.clone().locale(this.locale);
    switch (this.calendarType) {
      case 'Gregorian':
        return moment(date).clone().locale('en-US');
      case 'Jalaali':
        return momentJalaali(date).clone().locale('fa-IR');
      case 'Hijri':
        return momentHijri(date).clone().locale('ar-SU');
    }
  }

  createDate(year: number, month: number, date: number): moment.Moment {
    // Moment.js will create an invalid date if any of the components are out of bounds, but we
    // explicitly check each case so we can throw more descriptive errors.
    if (month < 0 || month > 11) {
      throw Error(
        `Invalid month index "${month}". Month index has to be between 0 and 11.`
      );
    }
    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    let result;
    switch (this.calendarType) {
      case 'Gregorian':
        result = this._createMoment({ year, month, date }).locale(this.locale);
        break;
      case 'Jalaali':
        result = this.createPersianDateFrom3Numbers(year, month, date);
        break;
      case 'Hijri':
        result = this.createArabianDateFrom3Numbers(year, month, date);
        break;
    }

    // If the result isn't valid, the date must have been out of bounds for this month.
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }

  today(): moment.Moment {
    return this._createMoment().locale(this.locale);
  }

  parse(value: any, parseFormat: any): moment.Moment | null {
    if (value && typeof value === 'string') {
      value = Number.toEngNumber(value);
      switch (this.calendarType) {
        case 'Gregorian':
          return this._createMoment(value, parseFormat, this.locale);
        case 'Jalaali':
          return momentJalaali(value, parseFormat).locale('fa-IR');
        case 'Hijri':
          return momentHijri(value, parseFormat).locale('ar-SU');
      }
    }
    return value ? this._createMoment(value).locale(this.locale) : null;
  }

  format(date: moment.Moment, displayFormat: any): string {
    date = this.clone(date);
    if (!this.isValid(date)) {
      throw Error('MomentDateAdapter: Cannot format invalid date.');
    }
    switch (this.calendarType) {
      case 'Gregorian':
        if (displayFormat === 'my') {
          displayFormat = 'MMM YYYY';
        }
        return date.format(displayFormat);
      case 'Jalaali':
        if (displayFormat === 'my') {
          displayFormat = 'jMMMM jYYYY';
        }
        return date.format(displayFormat);
      case 'Hijri':
        if (displayFormat === 'l') {
          displayFormat = 'iYYYY/iM/iD';
        }
        if (displayFormat === 'L') {
          displayFormat = 'iYYYY/iMM/iDD';
        }
        if (displayFormat === 'my') {
          displayFormat = 'iMMM iYYYY';
        }
        return date.locale(this.locale).format(displayFormat);
    }
  }

  addCalendarYears(date: moment.Moment, years: number): moment.Moment {
    switch (this.calendarType) {
      case 'Gregorian':
        return this.clone(date).add(years, 'year');
      case 'Jalaali':
        return this.clone(date).add(years, 'jYear');
      case 'Hijri':
        return this.clone(date).add(years, 'iYear');
    }
  }

  addCalendarMonths(date: moment.Moment, months: number): moment.Moment {
    switch (this.calendarType) {
      case 'Gregorian':
        return this.clone(date).add(months, 'months');
      case 'Jalaali':
        return this.clone(date).add(months, 'jMonth');
      case 'Hijri':
        return this.clone(date).add(months, 'iMonth');
    }
  }

  addCalendarDays(date: moment.Moment, days: number): moment.Moment {
    switch (this.calendarType) {
      case 'Gregorian':
        return this.clone(date).add(days, 'day');
      case 'Jalaali':
        return this.clone(date).add(days, 'jDay');
      case 'Hijri':
        return this.clone(date).add(days, 'iDay');
    }
  }

  toIso8601(date: moment.Moment): string {
    return this.clone(date).format();
  }

  /**
   * Returns the given value if given a valid Moment or null. Deserializes valid ISO 8601 strings
   * (https://www.ietf.org/rfc/rfc3339.txt) and valid Date objects into valid Moments and empty
   * string into null. Returns an invalid date for all other values.
   */
  override deserialize(value: any): moment.Moment | null {
    let date;
    if (value instanceof Date) {
      // date = this._createMoment(value);
      switch (this.calendarType) {
        case 'Gregorian':
          date = moment(value);
          break;
        case 'Jalaali':
          date = momentJalaali(value);
          break;
        case 'Hijri':
          date = momentHijri(value);
          break;
      }
    } else if (this.isDateInstance(value)) {
      // Note: assumes that cloning also sets the correct locale.
      return this.clone(value);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      date = this._createMoment(value, moment.ISO_8601).locale(this.locale);
    }
    if (date && this.isValid(date)) {
      return date;
    }
    return super.deserialize(value);
  }

  isDateInstance(obj: any): boolean {
    switch (this.calendarType) {
      case 'Gregorian':
        return moment.isMoment(obj);
      case 'Jalaali':
        return momentJalaali.isMoment(obj);
      case 'Hijri':
        return momentHijri.isMoment(obj);
    }
  }

  isValid(date: moment.Moment): boolean {
    return this.clone(date).isValid();
  }

  invalid(): moment.Moment {
    switch (this.calendarType) {
      case 'Gregorian':
        return moment.invalid();
      case 'Jalaali':
        return momentJalaali.invalid();
      case 'Hijri':
        return momentHijri.invalid();
    }
  }

  /** Creates a Moment instance while respecting the current UTC settings. */
  private _createMoment(
    date?: moment.MomentInput,
    format?: moment.MomentFormatSpecification,
    locale?: string
  ): moment.Moment {
    const { strict, useUtc }: MatMomentDateAdapterOptions = this._options || {};
    return useUtc
      ? moment.utc(date, format, locale, strict)
      : moment(date, format, locale, strict);
  }

  private createPersianDateFrom3Numbers(
    year: number,
    month: number,
    date: number
  ): momentJalaali.Moment {
    let result: momentJalaali.Moment;

    if (this._options && this._options.useUtc) {
      result = momentJalaali().utc();
    } else {
      result = momentJalaali();
    }

    return result
      .jYear(year)
      .jMonth(month)
      .jDate(date)
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .locale('fa-IR');
  }

  private createArabianDateFrom3Numbers(
    year: number,
    month: number,
    date: number
  ): momentHijri.Moment {
    let result: momentHijri.Moment;

    if (this._options && this._options.useUtc) {
      result = momentHijri().utc();
    } else {
      result = momentHijri();
    }

    return result
      .iYear(year)
      .iMonth(month)
      .iDate(date)
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .locale('ar-SU');
  }
}
