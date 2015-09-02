//find first normal date:
var i=0, firstRow = false, regDate = /\d*\/\d*\/\d*/;
while(!firstRow){
  if(regDate.exec(data.date_time[i])){
    firstRow = i;
  }
  i++;
}

var annualRows = [], cumRows = [], calRows = [];
var annualHeaders =[], cumHeaders=[], calHeaders=[];
var annualRowsETF = [], cumRowsETF = [], calRowsETF = [];
var annualHeadersETF =[], cumHeadersETF=[], calHeadersETF=[];
var current = '';
var calRE = /^\d{4}$/,
    annualRE = /^A-/,
    //cumRE is only used for ETF.  
    cumRE = /^YTD$|^Since Inception$/, //TEMP only use the following when ready:  /^.{2,3}$|^Since Inception$/,
    skipRE = /6M|2Y/; //If this is changed will also have to change the which columns are hidden in returns in main.js

for(var i=0; i< firstRow; i++) {
  current = data.date_time[i];
  if(skipRE.exec(current) || !current ){
    //skip 
    //If this is changed will also have to change the which columns are hidden in returns in main.js
  }
  else if(annualRE.exec(current)){
    annualRows.push(i);
    annualHeaders.push(current.slice(2,current.length)); //Slice remove preceding A- in annual titles
  }
  else if(calRE.exec(current)){
    if(Number(current) >= 2010){
      calRows.push(i);
      calHeaders.push(current);
    }
  }
  else{
    if(current === "1Y"){
      annualRows.push(i);
      annualHeaders.push(current); //don't slice 1Y is shared with annualized
    }
    cumRows.push(i);
    cumHeaders.push(current);
  }
}

//ETF's Rows pickers:
for(var i=0; i< firstRow; i++) {
  current = etfData.date_time[i];
  if(!current){
    //Skip if zero or null
  }else if(annualRE.exec(current)){
    annualRowsETF.push(i);
    annualHeadersETF.push(current.slice(2,current.length)); //Slice remove preceding A- in annual titles
  }
  else if( current > 1990 || current < 3000 ){
    calRowsETF.push(i);
    calHeadersETF.push(current);
  }
  else if(cumRE.exec(current)){
    cumRowsETF.push(i);
    cumHeadersETF.push(current);
  }
  if(current === "1Y"){
    annualRowsETF.push(i);
    annualHeadersETF.push(current); //don't slice 1Y is shared with annualized
  }
}

//The "ROW" in "prepRow" refers the the ultimate row in the Returns table which is transposed from the spreadsheet (its a column in the spreadsheet)
function prepRow(lookup, viewRows, name){
  var row =_.at(data[lookup], viewRows)
  row.unshift(name); //Returns table row header
  //console.log( lookup, viewRows, name, _.map(row, function(n){if(n === "null"){return '';}else{return isNaN(n)? n : (n*100).toFixed(2);}}));
  return _.map(row, function(n){if(n === "null"){return '';}else{return isNaN(n)? n : (n*100).toFixed(2);}});
}

function prepRowETF(lookup, viewRows, name){
  var row =_.at(etfData[lookup], viewRows)//This is the only difference compared to prepRow(): "etfData" instead of "data"
  row.unshift(name);
  //console.log( lookup, viewRows, name, _.map(row, function(n){if(n === "null"){return '';}else{return isNaN(n)? n : (n*100).toFixed(2);}}));
  //log('prepRowETF',  _.map(row, function(n){if(n === "null" || n === 0){log('etf false'); return '';}else{log('etf true', n, isNaN(n)); return isNaN(n)? n : (n*100).toFixed(2);}}));
  return _.map(row, function(n){if(n === "null" || n === 0){return '';}else{return isNaN(n)? n : (n*100).toFixed(2);}});
}

//console.log( _.pullAt(data['MSCI World Index_UCITS'], annualRows));
gkReturnsData = {
                  //UCITS NET
                  UCITS_Net_USD:{
                    annual:{
                      headers:  annualHeaders,
                      rows:[
                        prepRow('UCITS_Net_USD', annualRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_USD', annualRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_USD', annualRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_USD', annualRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    cumulative:{
                      headers:  cumHeaders,
                      rows:[
                        prepRow('UCITS_Net_USD', cumRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_USD', cumRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_USD', cumRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_USD', cumRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    calendar:{
                      headers:  calHeaders,
                      rows:[
                        prepRow('UCITS_Net_USD', calRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_USD', calRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_USD', calRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_USD', calRows, 'Blended Benchmark (60/40)')
                      ]
                    }
                  },
                  UCITS_Net_EUR:{
                    annual:{
                      headers:  annualHeaders,
                      rows:[
                        prepRow('UCITS_Net_EUR', annualRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_EUR', annualRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_EUR', annualRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_EUR', annualRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    cumulative:{
                      headers:  cumHeaders,
                      rows:[
                        prepRow('UCITS_Net_EUR', cumRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_EUR', cumRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_EUR', cumRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_EUR', cumRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    calendar:{
                      headers:  calHeaders,
                      rows:[
                        prepRow('UCITS_Net_EUR', calRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_EUR', calRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_EUR', calRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_EUR', calRows, 'Blended Benchmark (60/40)')
                      ]
                    }
                  },
                  UCITS_Net_GBP:{
                    annual:{
                      headers:  annualHeaders,
                      rows:[
                        prepRow('UCITS_Net_GBP', annualRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_GBP', annualRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_GBP', annualRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_GBP', annualRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    cumulative:{
                      headers:  cumHeaders,
                      rows:[
                        prepRow('UCITS_Net_GBP', cumRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_GBP', cumRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_GBP', cumRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_GBP', cumRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    calendar:{
                      headers:  calHeaders,
                      rows:[
                        prepRow('UCITS_Net_GBP', calRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_GBP', calRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_GBP', calRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_GBP', calRows, 'Blended Benchmark (60/40)')
                      ]
                    }
                  },
                  UCITS_Net_CHF:{
                    annual:{
                      headers:  annualHeaders,
                      rows:[
                        prepRow('UCITS_Net_CHF', annualRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_CHF', annualRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_CHF', annualRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_CHF', annualRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    cumulative:{
                      headers:  cumHeaders,
                      rows:[
                        prepRow('UCITS_Net_CHF', cumRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_CHF', cumRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_CHF', cumRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_CHF', cumRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    calendar:{
                      headers:  calHeaders,
                      rows:[
                        prepRow('UCITS_Net_CHF', calRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_CHF', calRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_CHF', calRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_CHF', calRows, 'Blended Benchmark (60/40)')
                      ]
                    }
                  },

                  //UCITS Gross:
                  UCITS_Gross_USD:{
                    annual:{
                      headers:  annualHeaders,
                      rows:[
                        prepRow('UCITS_Gross_USD', annualRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_USD', annualRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_USD', annualRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_USD', annualRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    cumulative:{
                      headers:  cumHeaders,
                      rows:[
                        prepRow('UCITS_Gross_USD', cumRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_USD', cumRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_USD', cumRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_USD', cumRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    calendar:{
                      headers:  calHeaders,
                      rows:[
                        prepRow('UCITS_Gross_USD', calRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_USD', calRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_USD', calRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_USD', calRows, 'Blended Benchmark (60/40)')
                      ]
                    }
                  },
                  UCITS_Gross_EUR:{
                    annual:{
                      headers:  annualHeaders,
                      rows:[
                        prepRow('UCITS_Gross_EUR', annualRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_EUR', annualRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_EUR', annualRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_EUR', annualRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    cumulative:{
                      headers:  cumHeaders,
                      rows:[
                        prepRow('UCITS_Gross_EUR', cumRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_EUR', cumRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_EUR', cumRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_EUR', cumRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    calendar:{
                      headers:  calHeaders,
                      rows:[
                        prepRow('UCITS_Gross_EUR', calRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_EUR', calRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_EUR', calRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_EUR', calRows, 'Blended Benchmark (60/40)')
                      ]
                    }
                  },
                  UCITS_Gross_GBP:{
                    annual:{
                      headers:  annualHeaders,
                      rows:[
                        prepRow('UCITS_Gross_GBP', annualRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_GBP', annualRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_GBP', annualRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_GBP', annualRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    cumulative:{
                      headers:  cumHeaders,
                      rows:[
                        prepRow('UCITS_Gross_GBP', cumRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_GBP', cumRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_GBP', cumRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_GBP', cumRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    calendar:{
                      headers:  calHeaders,
                      rows:[
                        prepRow('UCITS_Gross_GBP', calRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_GBP', calRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_GBP', calRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_GBP', calRows, 'Blended Benchmark (60/40)')
                      ]
                    }
                  },
                  UCITS_Gross_CHF:{
                    annual:{
                      headers:  annualHeaders,
                      rows:[
                        prepRow('UCITS_Gross_CHF', annualRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_CHF', annualRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_CHF', annualRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_CHF', annualRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    cumulative:{
                      headers:  cumHeaders,
                      rows:[
                        prepRow('UCITS_Gross_CHF', cumRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_CHF', cumRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_CHF', cumRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_CHF', cumRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    calendar:{
                      headers:  calHeaders,
                      rows:[
                        prepRow('UCITS_Gross_CHF', calRows, 'UCITS'),
                        prepRow('MSCI All Country World Index_UCITS_CHF', calRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_UCITS_CHF', calRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_UCITS_CHF', calRows, 'Blended Benchmark (60/40)')
                      ]
                    }
                  },

                  //FUNDS GAVIX GAVAX
                  GAVIX:{
                    annual:{
                      headers:  annualHeaders,
                      rows:[
                        prepRow('GAVIX', annualRows, 'GAVIX'),
                        prepRow('MSCI All Country World Index_MF', annualRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_MF', annualRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_MF', annualRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    cumulative:{
                      headers:  cumHeaders,
                      rows:[
                        prepRow('GAVIX', cumRows, 'GAVIX'),
                        prepRow('MSCI All Country World Index_MF', cumRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_MF', cumRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_MF', cumRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    calendar:{
                      headers:  calHeaders,
                      rows:[
                        prepRow('GAVIX', calRows, 'GAVIX'),
                        prepRow('MSCI All Country World Index_MF', calRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_MF', calRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_MF', calRows, 'Blended Benchmark (60/40)')
                      ]
                    }
                  },
                  GAVAX:{
                    annual:{
                      headers:  annualHeaders,
                      rows:[
                        prepRow('GAVAX', annualRows, 'GAVAX'),
                        prepRow('MSCI All Country World Index_MF', annualRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_MF', annualRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_MF', annualRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    cumulative:{
                      headers:  cumHeaders,
                      rows:[
                        prepRow('GAVAX', cumRows, 'GAVAX'),
                        prepRow('MSCI All Country World Index_MF', cumRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_MF', cumRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_MF', cumRows, 'Blended Benchmark (60/40)')
                      ]
                    }, 
                    calendar:{
                      headers:  calHeaders,
                      rows:[
                        prepRow('GAVAX', calRows, 'GAVAX'),
                        prepRow('MSCI All Country World Index_MF', calRows, 'MSCI All Country World Index'),
                        prepRow('MSCI World Index_MF', calRows, 'MSCI World Index'),
                        prepRow('Blended Benchmark_MF', calRows, 'Blended Benchmark (60/40)')
                      ]
                    }
                  },

                  //INDEXES:
                  EMERGE_INDEX:{
                    annual:{
                      headers:  annualHeaders,
                      rows:[
                        prepRow('KNLGEX', annualRows, 'KNLGEX (TR)'),
                        prepRow('MSCI Emerging Markets Index (TR)', annualRows, 'MSCI Emerging Markets Index (TR)'),
                        prepRow('KNLGE', annualRows, 'KNLGE (PR)'),
                        prepRow('MSCI Emerging Markets Index (PR)', annualRows, 'MSCI Emerging Markets Index (PR)')
                      ]
                    }, 
                    cumulative:{
                      headers:  cumHeaders,
                      rows:[
                        prepRow('KNLGEX', cumRows, 'KNLGEX (TR)'),
                        prepRow('MSCI Emerging Markets Index (TR)', cumRows, 'MSCI Emerging Markets Index (TR)'),
                        prepRow('KNLGE', cumRows, 'KNLGE (PR)'),
                        prepRow('MSCI Emerging Markets Index (PR)', cumRows, 'MSCI Emerging Markets Index (PR)')
                      ]
                    }, 
                    calendar:{
                      headers:  calHeaders,
                      rows:[
                        prepRow('KNLGEX', calRows, 'KNLGEX (TR)'),
                        prepRow('MSCI Emerging Markets Index (TR)', calRows, 'MSCI Emerging Markets Index (TR)'),
                        prepRow('KNLGE', calRows, 'KNLGE (PR)'),
                        prepRow('MSCI Emerging Markets Index (PR)', calRows, 'MSCI Emerging Markets Index (PR)')
                      ]
                    }
                  },
                  WORLD_INDEX:{
                    annual:{
                      headers:  annualHeaders,
                      rows:[
                        prepRow('KNLGX', annualRows, 'KNLGX (TR)'),
                        prepRow('MSCI World Index (TR)', annualRows, 'MSCI World Index (TR)'),
                        prepRow('KNLG', annualRows, 'KNLG (PR)'),
                        prepRow('MSCI World Index (PR)', annualRows, 'MSCI World Index (PR)')
                      ]
                    }, 
                    cumulative:{
                      headers:  cumHeaders,
                      rows:[
                        prepRow('KNLGX', cumRows, 'KNLGX (TR)'),
                        prepRow('MSCI World Index (TR)', cumRows, 'MSCI World Index (TR)'),
                        prepRow('KNLG', cumRows, 'KNLG (PR)'),
                        prepRow('MSCI World Index (PR)', cumRows, 'MSCI World Index (PR)')
                      ]
                    }, 
                    calendar:{
                      headers:  calHeaders,
                      rows:[
                        prepRow('KNLGX', calRows, 'KNLGX (TR)'),
                        prepRow('MSCI World Index (TR)', calRows, 'MSCI World Index (TR)'),
                        prepRow('KNLG', calRows, 'KNLG (PR)'),
                        prepRow('MSCI World Index (PR)', calRows, 'MSCI World Index (PR)')
                      ]
                    }
                  },

                //ETF's:
                  KLDW:{
                    annual:{
                      headers:  annualHeadersETF,
                      rows:[
                        prepRowETF('NAV_KLDW_PERF', annualRowsETF, 'KLDW (NAV)'),
                        prepRowETF('NAV_KLDW_PERF', annualRowsETF, 'KLDW (Market Price)'),
                        prepRowETF('TOTAL_RETURN_MSCI_WORLD_PERF', annualRowsETF, 'Gavekal Knowledge Leaders Developed World Index')
                      ]
                    }, 
                    cumulative:{
                      headers:  cumHeadersETF,
                      rows:[
                        prepRowETF('NAV_KLDW_PERF', cumRowsETF, 'KLDW (NAV)'),
                        prepRowETF('NAV_KLDW_PERF', cumRowsETF, 'KLDW (Market Price)'),
                        prepRowETF('TOTAL_RETURN_MSCI_WORLD_PERF', cumRowsETF, 'Gavekal Knowledge Leaders Developed World Index')
                      ]
                    }, 
                    calendar:{
                      headers:  calHeadersETF,
                      rows:[
                        prepRowETF('NAV_KLDW_PERF', calRowsETF, 'KLDW (NAV)'),
                        prepRowETF('NAV_KLDW_PERF', calRowsETF, 'KLDW (Market Price)'),
                        prepRowETF('TOTAL_RETURN_MSCI_WORLD_PERF', calRowsETF, 'Gavekal Knowledge Leaders Developed World Index')
                      ]
                    }
                  },
                  KLEM:{
                    annual:{
                      headers:  annualHeadersETF,
                      rows:[
                        prepRowETF('NAV_KLEM_PERF', annualRowsETF, 'KLEM (NAV)'),
                        prepRowETF('NAV_KLEM_PERF', annualRowsETF, 'KLEM (Market Price)'),
                        prepRowETF('TOTAL_RETURN_MSCI_WORLD_PERF', annualRowsETF, 'Gavekal Knowledge Leaders Emerging Markets Index')
                      ]
                    }, 
                    cumulative:{
                      headers:  cumHeadersETF,
                      rows:[
                        prepRowETF('NAV_KLEM_PERF', cumRowsETF, 'KLEM (NAV)'),
                        prepRowETF('NAV_KLEM_PERF', cumRowsETF, 'KLEM (Market Price)'),
                        prepRowETF('TOTAL_RETURN_MSCI_WORLD_PERF', cumRowsETF, 'Gavekal Knowledge Leaders Emerging Markets Index')
                      ]
                    }, 
                    calendar:{
                      headers:  calHeadersETF,
                      rows:[
                        prepRowETF('NAV_KLEM_PERF', calRowsETF, 'KLEM (NAV)'),
                        prepRowETF('NAV_KLEM_PERF', calRowsETF, 'KLEM (Market Price)'),
                        prepRowETF('TOTAL_RETURN_MSCI_WORLD_PERF', calRowsETF, 'Gavekal Knowledge Leaders Emerging Markets Index')
                      ]
                    }
                  }
              };
                                    
console.log('returns', gkReturnsData);
