Date.prototype.getDOY = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((this - onejan) / 86400000);
}

$(document).ready(function(){
  //START: Initiate Handlebars stuff
  Handlebars.registerHelper('if_eq', function(a, b, opts) {
      if(a == b) // Or === depending on your needs
          return opts.fn(this);
      else
          return opts.inverse(this);
  });

  Handlebars.registerPartial('distroRow', $("#gkc-distro-row").html());
  Handlebars.registerPartial('row', $("#gkc-row").html());
  var tableHBS = Handlebars.compile($("#gkc-table").html());
  //START: Initiate Handlebars stuff

  //START:: URL metaState and other Starting settings
  var series, url = window.location.href;

  if(url.indexOf('fund') > -1){   
    metaState = {fund:true, returnsKey: "GAVIX"};
    series = gkChartData["GAVIX_GROWTH"];
    $('#gkc').addClass('gkc-fund');
  }else if(url.indexOf('index') > -1){  
    metaState = {index:true, returnsKey: "WORLD_INDEX"};
    series = gkChartData.WORLD_INDEX;
    $('#gkc').addClass('gkc-index');
    $(document).ready(function(){$('#gkc li.histnav').first().remove();});
  }else if(url.indexOf('kldw') > -1){   
    metaState = {kldw:true, etf: true, returnsKey: "KLDW", /*returnsTimeFrame: "cumulative",*/ view: "NAV"};
    series = gkChartData.KLDW_NAV;
  }else if(url.indexOf('klem') > -1){   
    metaState = {klem:true, etf: true, returnsKey: "KLEM", /*returnsTimeFrame: "cumulative",*/ view: "NAV"};
    series = gkChartData.KLEM_NAV;
  }else{ //UCITS:
    metaState = {ucits:true, returnsKey: "UCITS_Net_USD",  performance: "Net", currency:"USD"};
    series = gkChartData.UCITS_GROWTH;
    $('#gkc').addClass('gkc-ucits');
  }

  //Set Default MetaStates:
  metaState.series = series;
  if(!metaState.view){ metaState.view = "GROWTH";}
  if(!metaState.returnsTimeFrame){ metaState.returnsTimeFrame = 'annual';}
  
  //Setup TopNav appropriately based on metaState:
  if(!metaState.fund && !metaState.etf){
    $('.distro.top').hide();
    $('.chart.top a').css('border','none');
  }
  if(!metaState.etf){
    $('.pd.top').hide();
    $('.distro.top a').css('border','none');
  }
  if(metaState.etf){
    //$('#chartTabs .growth, #chartTabs .annual').removeClass('active');
    //$('#chartTabs .histnav, #chartTabs .cumulative').addClass('active');
    $('.andprices').show();
  }

  //Insert Distribution HTML
  if(metaState.fund){
    $(".table-container .gavax").html( tableHBS(gkcDistributions.GAVAX_TABLE)  );
    $(".table-container .gavix").html( tableHBS(gkcDistributions.GAVIX_TABLE)  );
  }

  console.log('STARTING METASTATE:', metaState, ", STARTING SERIES: ", series );
  //END:: URL metaState and other Starting settings

  //START:: CHART SETUP
  function histnavFormatter() {
    return this.value;//this.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  function growthFormatter() {
    return (this.value * 100 + 10000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  function rangeFix(range){
    var series1 = series[0].data,
        lastDays =  new Date(series1[series1.length-1][0]).getDOY(),
        todays =  new Date().getDOY();
    if(range == 'ytd'){
      return new Date (series1[series1.length-1][0]).getDOY()+1;
    }
    if(range == '3y'){
      return (365*3 + 1)  - (todays - lastDays) + 32;
    }
  }

  var buttons = [{
           //  type: 'month',
           //  count: 1,
           //  text: '1m'
           //}, {
           //  type: 'month',
           //  count: 3,
           //  text: '3m'
           //}, {
           //  type: 'month',
           //  count: 6,
           //  text: '6M'
           //}, {
             //type: 'ytd',
             //type:'day',//NEED TO create function to handle the final data point not being the current day
             //count: 90,
             type: 'day',
             count: rangeFix('ytd'),
             text: 'YTD'
           },{
             type: 'year',
             count: 1,
             text: '1Y'
          },
          //{                // To add 2Y (two year) button to chart uncomment these lines!
          //  type: 'year',  // To add 2Y (two year) button to chart uncomment these lines!
          //  count: 2,      // To add 2Y (two year) button to chart uncomment these lines!
          //  text: '2Y'     // To add 2Y (two year) button to chart uncomment these lines!
          //},               // To add 2Y (two year) button to chart uncomment these lines!
          {
             //type: 'year',
             //count: 3,
             type: 'day',
             count: rangeFix('3y'),
             text: '3Y'
           }];
  if(metaState.ucits){
    buttons.push({
             type: 'year',
             count: 5,
             text: '5Y'
           });
  }
  if(metaState.etf){
    _.remove(buttons, function(i){if(i.text == 'YTD')return false;else return true});
  }
  buttons.push ({
             type: 'all',
             text: 'Since Inception'
           });
  //END:: CHART VARIABLE OPTIONS

  var compare = metaState.view == "GROWTH"? 'percent': false,
      formatter = growthFormatter;

  Highcharts.setOptions({
    lang: {
      rangeSelectorZoom :"" //hides the zoom text!
    }
  });

  var seriesOptions = [];
  // create the chart when all data is loaded
  var createChart = function () {
    $('#chart .container').highcharts('StockChart', {
      credits: {
          enabled: false
      },
      chart: {
          events: {
              load: function () {
                  $(".highcharts-legend-item path").attr('stroke-width', 10);
              },
              redraw: function () {
                  $(".highcharts-legend-item path").attr('stroke-width', 10);
              }
          }
      }, 
      legend : {
        enabled: true
      },
      navigator : {
          enabled: false
      },
      scrollbar : {
          enabled: false
      },
      rangeSelector: {
        inputEnabled:true,
        allButtonsEnabled:true,
        buttons: buttons,
        selected: 4,
        buttonTheme:{
          width:36,//50,
          height:18,
          fill: 'transparent',//changed
          style:{
            color: '#0099FF',
            fontWeight: 'normal',
            fontFamily:'Arial'
          },
        states: {
          select: {
            fill: '#EFEFEF',//changed
              style: {
                fontFamily:'Arial',
                color: '#039'
              }
            }
          }
        }
      },
      xAxis: {
        tickPositioner: function(){
          console.log('tickPositioner data this:', this);
          //check if ticks are within month of each other:
          //if( this.tickPositions[1] / (60*60*24*31*1000) - this.tickPositions[0] / (60*60*24*31*1000) < 1.5 ){
            //var ret = _.forEach(this.tickPositions, function(date){
            var min = this.min;
            var ret = _.map(this.tickPositions, function(date){
                //console.log('date',date, new Date(date), new Date(date - 60*60*24*1000*1));
                return (date - 60*60*24*1000*1);
            });
            //console.log(this.tickPositions,'is tick positions an array?:',this.tickPositions.constructor === Array );
            _.remove(ret, function(date){ return date < min;}); // Fixes aka removes issue w/ having date x axis ticks on left of y axis
            ret.info = this.tickPositions.info;
            //console.log(ret,'is ret an array?:',ret.constructor === Array );
            return ret;
          //}else{
          //  return this.tickPositions;
          //}
        },
        tickPixelInterval: 150,//ensures dates formatted as below don't overlap; no diagonal dates and full day-month-year
        labels: {
          autoRotation:0 // no diagonal dates
        },
        //units:[[
        //        'day',
        //        [28,29,30,31]
        //        ]],
        type:'datetime',
        dateTimeLabelFormats:{
          //second: '%Y-%m-%d<br/>%H:%M:%S',
          //minute: '%Y-%m-%d<br/>%H:%M',
          //hour: '%Y-%m-%d<br/>%H:%M',
          week: "%e-%b-%y",
          month: "%e-%b-%Y",
          year: "%e-%b-%Y",
          day: "%e-%b-%Y"
        },
        minRange: 3600000 //This is needed for YTD to work otherwise the default min seems to ~4months
      },
      yAxis: {
          opposite: false,
          title: {text: 'US Dollars'},
          startOnTick: false, //Autoscales the yAxis
          maxPadding: 0,      //Autoscales the yAxis
          labels: {
              formatter: formatter
          },
      },

      plotOptions: {
          series: {
              series: 10,
              compare: compare,
              dataGrouping:{enabled:false},
              marker: {
                symbol:'square'
              }
          }
      },

      tooltip: {
          shared: false,
          useHTML:true, //MAGIC TICKET! 
          headerFormat:'<span style="text-transform:uppercase;font-weight:bold;">{point.key}</span><br/>',
          xDateFormat:"%a, %b %e, %Y",
          //pointFormatter: function(){return "hi";},
          //pointFormat: '<span style="color:{series.color}">{series.name}</span>: <div style="background-color: green;">{point.y}</div> ({point.change}%)<br/>',
          pointFormatter: function(){
            //console.log(this);
            var dollars, 
                color = this.series.color;
            
            if(compare === 'percent'){
              dollars = this.change * 100 + 10000;
              dollars =  numeral(dollars).format('$0,0');
            }else {
              dollars = this.y;
              dollars =  numeral(dollars).format('$0,0.00');
            }
            
            var out = '<span style="color:'+ color +'">' + this.series.name + 
                  '</span>: <span style="background-color:'+ color +';color:white; font-weight:bold; font-size:1.2em; display:inline-block;padding: 2px 20px;margin: 0 20px;">' + dollars + '</span>';
            if(compare === 'percent'){
              var change = numeral(this.change/100).format('0.00%');
              if(this.change > 0){
                change = "+" + change;
              }
              out += '<span style="font-weight:bold;color:'+ color +'">' + change +'</span><br/>';
            };
            return out;
          },
          valueDecimals: 2
      },
      series: series
    }); 
    
    //Fix inputSelector styling after chart creation:
    var sinceInception = $(".highcharts-range-selector-buttons g").last();
    sinceInception.children('rect').attr('width',120);
    sinceInception.children('text').attr('x', 16);
    
    $("g.highcharts-input-group > g:nth-child(1) text").hide();
    
    $('.highcharts-button').each(function(){
      $(this).children('rect').attr('x',-50);
      var current = $(this).children('text').attr('x');
      $(this).children('text').attr('x', current  -50);
    })
    
    //get highCharts to go full width from the begnning by triggering the resize event.
    window.dispatchEvent(new Event('resize'));

  };
  //END:: CHART SETUP


  //START: returns are default view
  //START: lazily copying top tab code to start on returns as default 
  //createChart();//previously used when chart was default
      metaState.topTab = "returns";
      $("#gkc .component-tabs li.top").removeClass('active');
      $("#gkc .component-tabs .returns").addClass('active');
      $("#gkc .main").hide();
      $("#gkc .sub-tabs").hide();
      $("#gkc .returns.sub-tabs").show();
      $("#gkc").addClass('returns');
      createTable();
  //END: lazily copying top tab code to start on returns as default 
  //START: returns are default view

  //START:: TOP TAB
  metaState.topTab = "returns"; //Sets default
  $("#gkc .component-tabs .chart a").click(function(){
    if(metaState.topTab != "chart"){
      metaState.topTab = "chart";
      $("#gkc .component-tabs li.top").removeClass('active');
      $("#gkc .component-tabs .chart").addClass('active');
      $("#gkc .main").hide();
      $("#gkc .sub-tabs").hide();
      $("#gkc .chart.sub-tabs").show();
      createChart();
      $("#gkc #chart").show();
      window.dispatchEvent(new Event('resize'));
      $("#gkc").removeClass('returns');
    }
  });
  $("#gkc .component-tabs .returns a").click(function(){
    if(metaState.topTab != "returns"){
      metaState.topTab = "returns";
      $("#gkc .component-tabs li.top").removeClass('active');
      $("#gkc .component-tabs .returns").addClass('active');
      $("#gkc .main").hide();
      $("#gkc .sub-tabs").hide();
      $("#gkc .returns.sub-tabs").show();
      $("#gkc").addClass('returns');
      createTable();
    }
  });
  $("#gkc .component-tabs .distro a").click(function(){
    if(metaState.topTab != "distro"){
      metaState.topTab = "distro";
      metaState.distroTable = false;
      $("#gkc .component-tabs li.top").removeClass('active');
      $("#gkc .component-tabs .distro").addClass('active');
      $("#gkc .main").hide();
      $("#gkc .sub-tabs").hide();
      $("#gkc .distro.sub-tabs").show();
      createDistro(metaState.returnsKey);
      $("#distro").show();
      window.dispatchEvent(new Event('resize'));
    }
  });
  $("#gkc .component-tabs .pd a").click(function(){
    if(metaState.topTab != "pd"){
      metaState.topTab = "pd";
      metaState.distroTable = false;
      $("#gkc .component-tabs li.top").removeClass('active');
      $("#gkc .component-tabs .pd").addClass('active');
      $("#gkc .main").hide();
      $("#gkc .sub-tabs").hide();
      $("#pd").show();
      window.dispatchEvent(new Event('resize'));
    }
  });
  //END:: TOP TAB

  //START:: CREATE TABLE
  function createTable(){
    var tableData = gkReturnsData[metaState.returnsKey][metaState.returnsTimeFrame];
    $("#chart","#distro").hide();
    $("#returns .container").html(tableHBS(tableData));
    //check for data to remove from chart
    //temporary, remove columns that don't have data yet:
    if(metaState.returnsTimeFrame === "annual"){
      if(metaState.fund){
        $('#returns th.col-2 , #returns th.col-3').hide();  
        $('#returns td.col-4 , #returns td.col-3').hide();  
      }else{
        $('#returns th.col-3').hide();  
        $('#returns td.col-4').hide();  
      }
    }
    else if(metaState.returnsTimeFrame === "cumulative"){
      if(metaState.fund){
        $('#returns th.col-5 , #returns th.col-6').hide();  
        $('#returns td.col-7 , #returns td.col-6').hide();  
      }else{
        $('#returns th.col-6').hide();  
        $('#returns td.col-7').hide();  
      }
    }
    //END: temporary, remove columns that don't have data yet:

    if(metaState.topTab == "returns"){
      $("#returns").show();
    }  
  }
  //END:: CREATE TABLE

  //START:: RETURNS SUB OPTIONS
  function setRetSubState(e){
    $("#gkc .returns.sub-tabs li.active").removeClass('active');
    e.addClass('active');
    createTable();
  }
  $("#gkc .sub-tabs .annual a").click(function(){
    if(metaState.returnsTimeFrame !== 'annual'){
      metaState.returnsTimeFrame = 'annual';
      setRetSubState($("#gkc .sub-tabs .annual"));
    }
  });
  $("#gkc .sub-tabs .cumulative a").click(function(){
    if(metaState.returnsTimeFrame !== 'cumulative'){
      metaState.returnsTimeFrame = 'cumulative';
      setRetSubState($("#gkc .sub-tabs .cumulative"));
    }
  });
  $("#gkc .sub-tabs .calendar a").click(function(){
    if(metaState.returnsTimeFrame !== 'calendar'){
      metaState.returnsTimeFrame = 'calendar';
      setRetSubState($("#gkc .sub-tabs .calendar"));
    }
  });
  //distro sub option table togge:
  $("#gkc .sub-tabs .distro-chart a").click(function(){
    if(metaState.distroTable){
      metaState.distroTable = false;
      $('#distro .table-container').hide();
      $('#distro .container').show();
      $('#distro #gkccc-DIV_1').hide();
      $("#gkc .sub-tabs li.active").removeClass('active');
      $('li.distro-chart').addClass('active');
    }
  });
  $("#gkc .sub-tabs .distro-table a").click(function(){
    if(!metaState.distroTable){
      metaState.distroTable = true;
      $('#distro .container').hide();
      $('#distro .table-container').show();
      $('#distro #gkccc-DIV_1').show();
      $("#gkc .sub-tabs li.active").removeClass('active');
      $('li.distro-table').addClass('active');
    }
  });
  //END:: RETURNS SUB OPTIONS

  //START:: DROP DOWNS
  var chartFormHBS = Handlebars.compile($("#gkc-chart-form").html());
  $("form#state-form").html(chartFormHBS(metaState));

  //UCITS:
  $("#ucits-chart-options select").each(function(){
    $(this).change(function(){
      var performance = $("#ucits-chart-options #performance").val(),
          currency = $("#ucits-chart-options #currency").val();
      metaState.performance = performance;
      metaState.currency = currency;
      metaState.returnsKey = "UCITS_" + performance + '_' + currency;
      createTable();
    });
  });
  //Funds:
  $("#fund-chart-options select").each(function(){
    $(this).change(function(){
      var shareClass = $("#fund-chart-options #share-class").val(),
          dataKey = shareClass + "_Price";
      metaState.returnsKey = shareClass;
      series = gkChartData[metaState.returnsKey + "_" + metaState.view];
      createChart();
      createTable();
      createDistro(metaState.returnsKey);
      $(".table-container div").hide();
      $(".table-container ."+metaState.returnsKey.toLowerCase()).show();
    });
  });
  //Index:
  $("#index-chart-options select").each(function(){
    $(this).change(function(){
      var shareClass = $("#index-chart-options #share-class").val(),
          dataKey = shareClass + "_INDEX";
      series = gkChartData[dataKey];
      metaState.returnsKey = shareClass + "_INDEX";
      createChart();
      createTable();
    });
  });
  //END:: DROP DOWNS

  //START:: CHART SUB OPTIONS
  function setSubActive(e){
    $("#gkc .chart.sub-tabs li.active").removeClass('active');
    e.addClass('active');
    createChart();
    createTable();
    if($(e).hasClass('histnav')){
      $('#gkc .highcharts-input-group').show();
    }
  }
  $("#gkc .sub-tabs .growth a").click(function(){
    if(metaState.view !== 'GROWTH'){
      compare = 'percent';
      metaState.view = "GROWTH";
      formatter = growthFormatter;
      if(metaState.fund || metaState.etf){
        series = gkChartData[metaState.returnsKey + "_GROWTH"];
      }
      if(metaState.ucits){
        series = gkChartData.UCITS_GROWTH;
      }
      setSubActive($("#gkc .sub-tabs .growth"));
    }
  });
  $("#gkc .sub-tabs .histnav a").click(function(){
    if(metaState.view === 'GROWTH'){
      compare = false;
      metaState.view = "NAV";
      formatter = histnavFormatter;
      if(metaState.fund || metaState.etf){
        series = gkChartData[metaState.returnsKey + "_NAV"];
      }
      if(metaState.ucits){
        series = gkChartData["UCITS_NAV"];
      }
      setSubActive($("#gkc .sub-tabs .histnav"));
    }
  });
  //END:: CHART SUB OPTIONS
  
//TESTING legend squares:
//Highcharts.seriesTypes.line.prototype.drawLegendSymbol = 
   // function(){conosole.log('hi');};
   //  Highcharts.seriesTypes.area.prototype.drawLegendSymbol;

});
