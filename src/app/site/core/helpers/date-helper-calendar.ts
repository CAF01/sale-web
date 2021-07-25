import * as moment from "moment";
export class DateHelperCalendar {
  static ConvertToStringDate(
    date: Date,
    format: string = "DD-MMMM-YYYY"
  ): string {
    return moment(date).locale("es").format(format);
  }

  static DisplayRange(start: Date, end: Date): string {
    return (
      this.ConvertToStringDate(start) + " al " + this.ConvertToStringDate(end)
    );
  }

  static FormatDate(date: Date, format: string = "DD-MM-YYYY"): string {
    return moment(date).format(format);
  }

  static FormatDateToApi(date: Date, format: string = "YYYY-MM-DD"): string {
    return moment(date).format(format);
  }

  static FormatDateAddDayToApi(date: Date, format: string = "YYYY-MM-DD"): string {
    return moment(date).add(1,'days').format(format);
  }

  // static ComplexDispay(value: any) {
  //   if (value) {
  //     return this.DisplayRange(value.start._d, value.end._d);
  //   }
  //   return;
  // }
}
