import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import * as Feather from 'feather-icons';
import { RangeDate } from '../../core/helpers/rangeDate';
import { DateHelperCalendar } from '../../core/helpers/date-helper-calendar';
declare var $: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  @Input() showConfigChart: boolean = true;

  @Output() onDateChange = new EventEmitter<RangeDate>();
  @Output() onViewChartChange = new EventEmitter<number>();

  labelOptionChart: string;

  inliveMode: boolean;

  labelDate: string;

  currentDate: Date;

  today: any;

  constructor() {
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.today = moment(this.currentDate).add(0, "days");

    var start = this.today;
    var end = this.today;

    var spanish_daterangepicker = {
      direction: "ltr",
      format: "DD/MM/YYYY",
      separator: " - ",
      applyLabel: "Aplicar",
      cancelLabel: "Cancelar",
      fromLabel: "De",
      toLabel: "Al",

      customRangeLabel: "Personalizada",
      daysOfWeek: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
      monthNames: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      firstDay: 1,
    };
    var context = this;

    function cb(start, end) {
      context.onDateChange.emit(new RangeDate(start, end));

      context.labelDate =
        start.format("DD-MM-YYYY") + " - " + end.format("DD-MM-YYYY");
    }

    $("#reportrange").daterangepicker(
      {
        locale: spanish_daterangepicker,
        startDate: start,
        endDate: end,
        minDate: "01-01-2020",
        maxDate: DateHelperCalendar.FormatDate(context.today),
        ranges: {
          Hoy: [moment(), moment()],
          Ayer: [moment().subtract(1, "days"), moment().subtract(1, "days")],
          "Ultimos 7 días": [moment().subtract(6, "days"), moment()],
          "Ultimos 30 días": [moment().subtract(29, "days"), moment()],
          "Este Mes": [moment().startOf("month"), moment().endOf("month")],
          "Mes pasado": [
            moment().subtract(1, "month").startOf("month"),
            moment().subtract(1, "month").endOf("month"),
          ],
          "Este Año": [moment().startOf("year"), moment().endOf("year")],
          "Inicio de los tiempos": ["01-01-2020", moment()],
        },
      },
      cb
    );
    cb(start, end);

    Feather.replace();
  }


  ngOnDestroy(): void {
    this.onDateChange = null;
  }
}
