function createDistro(shareClass) {
    var data, categories;
    
    if(shareClass === "GAVAX"){
      data = [0,0,0.05526,0.71815,0.35004];
      categories = ["2010", "Dec 20, 2011", "Dec 14, 2012","Dec 10, 2013","Dec 9, 2014"];
    }else{//GAVIX:
      data = [0,0.00693,0.07654,0.71815,0.38571];
      categories = ["2010", "Dec 20, 2011","Dec 14, 2012","Dec 10, 2013","Dec 9, 2014"];
    }

    $('#distro .container').highcharts({
        credits: {
            enabled: false
        },
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: categories,
            type:'datetime',
            dateTimeLabelFormats:{
              second: '%Y-%m-%d<br/>%H:%M:%S',
              minute: '%Y-%m-%d<br/>%H:%M',
              hour: '%Y-%m-%d<br/>%H:%M',
              week: "%e-%b-%y",
              month: "%e-%b-%y",
              year: "%e-%b-%y",
              day: "%e-%b-%y"
            },
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'US Dollars'// 'Total Distribution'
            }
        },
        tooltip: {
            headerFormat: 
'<span><span style="float:left;">Ex-Date:</span><span style="float:right;">{point.key}</span></span><table>',
            pointFormat: '<tr><td style="padding:0">{series.name}:  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</td>' +
                '<td style="padding:0">{point.y}</td></tr>',
            footerFormat: '</table>',
            shared: true,
            borderColor: "#7cb5ec",
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                style:{"fontWeight":"normal"}
            },
            series: {
                        dataLabels: {
                            enabled: true,
                            borderWidth: 1,
                            borderColor: '#AAA',
                        }
                    }
        },
        legend:{enabled:false},
        series: [{
            name: 'Total Distribution',
            data: data //[0.00000,0.00000,0.05526,0.71815,0.35004]
        }]
    });
}
