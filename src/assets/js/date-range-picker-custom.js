$(function () {
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

  var start = moment().subtract(29, "days");
  var end = moment();

  function cb(start, end) {
    $("#reportrange span").html(
      start.format("DD-MM-YYYY") + " - " + end.format("DD-MM-YYYY")
    );
  }

  $("#reportrange").daterangepicker(
    {
      locale: spanish_daterangepicker,
      startDate: start,
      endDate: end,
      ranges: {
        Hoy: [moment(), moment()],
        Ayer: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Ultimos 7 días": [moment().subtract(6, "days"), moment()],
        "Ultimos 30 días": [moment().subtract(29, "days"), moment()],
        "Este Mes": [moment().startOf("month"), moment().endOf("month")],
        "Ultimo MES": [
          moment().subtract(1, "month").startOf("month"),
          moment().subtract(1, "month").endOf("month"),
        ],
      },
    },
    cb
  );


  cb(start, end);
});
