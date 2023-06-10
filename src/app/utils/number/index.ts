export class Number {
  public static toEngNumber(value: number | string): string {
    const num = value as string;
    return this.persianNumberToEng(this.arabicNumberToEng(num));
  }

  public static toPersianNumber(value: number | string): string {
    const num = value as string;
    return this.arabicNumberToPersian(this.engNumberToPersian(num));
  }

  public static toArabianNumber(value: number | string): string {
    const num = value as string;
    return this.persianNumberToArabic(this.engNumberToArabic(num));
  }

  private static engNumberToPersian(value: string): string {
    if (value === undefined || value === null) {
      return '';
    }
    let str = value.toString().trim();
    if (str === '') {
      return '';
    }
    str = str.replace(/0/g, '۰');
    str = str.replace(/1/g, '۱');
    str = str.replace(/2/g, '۲');
    str = str.replace(/3/g, '۳');
    str = str.replace(/4/g, '۴');
    str = str.replace(/5/g, '۵');
    str = str.replace(/6/g, '۶');
    str = str.replace(/7/g, '۷');
    str = str.replace(/8/g, '۸');
    str = str.replace(/9/g, '۹');
    return str;
  }

  private static arabicNumberToPersian(value: string): string {
    if (value === undefined) {
      return '';
    }
    let str = value.toString().trim();
    if (str === '') {
      return '';
    }
    str = str.replace(/٤/g, '۴');
    str = str.replace(/٥/g, '۵');
    str = str.replace(/٦/g, '۶');
    return str;
  }

  private static arabicNumberToEng(value: string): string {
    if (value === undefined) {
      return '';
    }
    let str = value.toString().trim();
    if (str === '') {
      return '';
    }
    str = str.replace(/٤/g, '4');
    str = str.replace(/٥/g, '5');
    str = str.replace(/٦/g, '6');
    return str;
  }

  private static persianNumberToEng(value: string): string {
    if (value === undefined) {
      return '';
    }
    let str = value.toString().trim();
    if (str === '') {
      return '';
    }
    str = str.replace(/۰/g, '0');
    str = str.replace(/۱/g, '1');
    str = str.replace(/۲/g, '2');
    str = str.replace(/۳/g, '3');
    str = str.replace(/۴/g, '4');
    str = str.replace(/۵/g, '5');
    str = str.replace(/۶/g, '6');
    str = str.replace(/۷/g, '7');
    str = str.replace(/۸/g, '8');
    str = str.replace(/۹/g, '9');
    return str;
  }

  private static persianNumberToArabic(value: string): string {
    if (value === undefined) {
      return '';
    }
    let str = value.toString().trim();
    if (str === '') {
      return '';
    }
    str = str.replace(/۴/g, '٤');
    str = str.replace(/۵/g, '٥');
    str = str.replace(/۶/g, '٦');
    return str;
  }

  private static engNumberToArabic(value: string): string {
    if (value === undefined || value === null) {
      return '';
    }
    let str = value.toString().trim();
    if (str === '') {
      return '';
    }
    str = str.replace(/0/g, '۰');
    str = str.replace(/1/g, '۱');
    str = str.replace(/2/g, '۲');
    str = str.replace(/3/g, '۳');
    str = str.replace(/4/g, '٤');
    str = str.replace(/5/g, '٥');
    str = str.replace(/6/g, '٦');
    str = str.replace(/7/g, '۷');
    str = str.replace(/8/g, '۸');
    str = str.replace(/9/g, '۹');
    return str;
  }
}
