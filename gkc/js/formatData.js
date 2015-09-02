var colors = {
    grey:"#a0a4a7", //medium gray
    lightGrey:"#d1d2d0",//light gray
    green: "#759646",//green
    navy:"#272763", //very dark blue
    lightBlue:"#bbd7ec"//light blue
};

var gkChartData = {};

//find first normal date:
var i=0, firstRow = false, regDate = /\d*\/\d*\/\d*/;
while(!firstRow){
  if(regDate.exec(data.date_time[i])){
    firstRow = i;
  }
  i++;
}

function unixDate(dateString) {
  return Math.round(new Date(dateString).getTime());
  //checkUnixDate = new Date(dateString);
}

function growthSlice(set){
  return set.slice(firstRow, set.length);
}

function zipper(date, set, growth){
  /* 0:GROWTHSLICE IFF NEEDED, 1:ZIP, 2:SORT, 3:CONVERT TO NUMBER, 4:REMOVE NaNs */
  set = growth ? growthSlice(set) : set;
  return _.remove(_.map(_.sortBy(_.zip(date, set),function(n){return n[0];}),function(n){return [n[0],parseFloat(n[1])];}), function(n){return !isNaN(n[0]) && !isNaN(n[1]);});
}

var navDates = _.map(data.NAV_Date, unixDate);  // convert to unixdate!
var navDatesETF = _.map(etfData.NAV_Date, unixDate);  // convert to unixdate!
var growthDates = _.map(growthSlice(data.date_time), unixDate); // convert to unixdate!
//log('nav dates', navDatesETF,etfData.NAV_Date,etfData['NAV_Date'], data.NAV_Date);

//ETFs:
gkChartData.KLDW_GROWTH = [ 
                          {   name: 'KLDW', 
                              color: colors.lightBlue, 
                              data: zipper(navDatesETF, etfData['PRICE_KLDW'], false) //for ETFs always set third zipper param to false as the data starts on first row no matter if growth or nav.
                          },
                          {   name: 'MSCI World Index (PR)', 
                              color: colors.grey, 
                              data: zipper(navDatesETF, etfData['TOTAL_RETURN_MSCI_WORLD'], false)
                          }
                        ];

gkChartData.KLDW_NAV = [
                          {   name: 'Historical NAVs', 
                              color: colors.lightBlue, 
                              data: zipper(navDatesETF, etfData['NAV_KLDW'], false)
                          },
                          {   name: 'Historical Prices', 
                              color: colors.grey, 
                              data: zipper(navDatesETF, etfData['PRICE_KLDW'], false)
                          }
                        ];

gkChartData.KLEM_GROWTH = [ 
                          {   name: 'KLEM', 
                              color: colors.lightBlue, 
                              data: zipper(navDatesETF, etfData['PRICE_KLEM'], false) //for ETFs always set third zipper param to false as the data starts on first row no matter if growth or nav.
                          },
                          {   name: 'MSCI World Index (PR)', 
                              color: colors.grey, 
                              data: zipper(navDatesETF, etfData['TOTAL_RETURN_MSCI_WORLD'], false)
                          }
                        ];

gkChartData.KLEM_NAV = [
                          {   name: 'Historical NAVs', 
                              color: colors.lightBlue, 
                              data: zipper(navDatesETF, etfData['NAV_KLEM'], false)
                          },
                          {   name: 'Historical Prices', 
                              color: colors.grey, 
                              data: zipper(navDatesETF, etfData['PRICE_KLEM'], false)
                          }
                        ];

// Standard charts:

gkChartData.WORLD_INDEX = [
                          {   name: 'KNLGX', 
                              color: colors.lightBlue, 
                              data: zipper(growthDates, data["KNLGX"], true)
                          },
                          {   name: 'KNLG', 
                              color: colors.navy, 
                              data: zipper(growthDates, data["KNLG"], true)
                          },
                          {   name: 'MSCI World Index (TR)', 
                              color: colors.lightGrey, 
                              data: zipper(growthDates, data['MSCI World Index (TR)'], true)
                          },
                          {   name: 'MSCI World Index (PR)', 
                              color: colors.grey, 
                              data: zipper(growthDates, data["MSCI World Index (PR)"], true)
                          }
                        ];
gkChartData.EMERGE_INDEX = [
                          {   name: 'KNLGEX', 
                              color: colors.lightBlue, 
                              data: zipper(growthDates, data["KNLGEX"], true)
                          },
                          {   name: 'KNLGE', 
                              color: colors.navy, 
                              data: zipper(growthDates, data["KNLGE"], true)
                          },
                          {   name: 'MSCI Emerging Markets Index (TR)', 
                              color: colors.lightGrey, 
                              data: zipper(growthDates, data['MSCI Emerging Markets Index (TR)'], true)
                          },
                          {   name: 'MSCI Emerging Markets Index (PR)', 
                              color: colors.grey, 
                              data: zipper(growthDates, data["MSCI Emerging Markets Index (PR)"], true)
                          }
                        ];

gkChartData.GAVAX_NAV = [{   name: 'GAVAX', 
                            color: colors.lightBlue, 
                            data: zipper(navDates, data["NAV_GAVAX"], false)
                        }];

gkChartData.GAVAX_GROWTH = [
                          {   name: 'GAVAX', 
                              color: colors.lightBlue, 
                              data: zipper(growthDates, data["GAVAX"], true)
                          },
                          {   name: 'MSCI All Country World Index', 
                              color: colors.grey, 
                              data: zipper(growthDates, data["MSCI All Country World Index_MF"], true)
                          },
                          {   name: 'MSCI World Index', 
                              color: colors.lightGrey, 
                              data: zipper(growthDates, data["MSCI World Index_MF"], true)
                          },
                          {   name: 'Blended Benchmark (60/40)', 
                              color: colors.green, 
                              data: zipper(growthDates, data["Blended Benchmark_MF"], true)
                          }
                        ];
gkChartData.GAVIX_NAV = [{   name: 'GAVIX', 
                            color: colors.lightBlue, 
                            data: zipper(navDates, data["NAV_GAVIX"], false)
                        }];
gkChartData.GAVIX_GROWTH = [
                          {   name: 'GAVIX', 
                              color: colors.lightBlue, 
                              data: zipper(growthDates, data["GAVIX"], true)
                          },
                          {   name: 'MSCI All Country World Index', 
                              color: colors.grey, 
                              data: zipper(growthDates, data["MSCI All Country World Index_MF"], true)
                          },
                          {   name: 'MSCI World Index', 
                              color: colors.lightGrey, 
                              data: zipper(growthDates, data["MSCI World Index_MF"], true)
                          },
                          {   name: 'Blended Benchmark (60/40)', 
                              color: colors.green, 
                              data: zipper(growthDates, data["Blended Benchmark_MF"], true)
                          }
                        ];
gkChartData.UCITS_NAV = [{   name: 'UCITS', 
                            color: "#272763", 
                            data: zipper(navDates, data["NAV_UCITS"], false)
                        }];

gkChartData.UCITS_GROWTH = [
                          {   name: 'UCITS', 
                              color: "#272763", 
                              data: zipper(growthDates, data["UCITS_Net_USD"], true)
                          },
                          {   name: 'MSCI All Country World Index', 
                              color: colors.grey, 
                              data: zipper(growthDates, data["MSCI All Country World Index_UCITS_USD"], true)
                          },
                          {   name: 'MSCI World Index', 
                              color: colors.lightGrey, 
                              data: zipper(growthDates, data["MSCI World Index_UCITS_USD"], true)
                          },
                          {   name: 'Blended Benchmark (60/40)', 
                              color: colors.green, 
                              data: zipper(growthDates, data["Blended Benchmark_UCITS_USD"], true)
                          },
                        ];

console.log('charts', gkChartData);
