import { DateHelperCalendar } from "./date-helper-calendar";

export class RangeDate {
    constructor(startDate: Date, endDate: Date) {
      this.startDate = startDate;
      this.endDate = endDate;
    }
  
    startDate: Date;
    endDate: Date;
  
    public startDateApi = () => DateHelperCalendar.FormatDateToApi(this.startDate);
    public endDateApi = () => DateHelperCalendar.FormatDateToApi(this.endDate);
  }
  