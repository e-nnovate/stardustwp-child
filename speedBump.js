function bump1(){
  $j(document).ready(function(){
  //$j('.column1 a[href*=gavekalfunds.com]').attr('onClick',
  $j('.home #3 .column1 a').attr('onClick',
    "return alert(\'You are about to leave the Gavekal Capital site and are being redirected to the url GavekalFunds.com\')").attr('target',"_self"); 
  });
};
setTimeout(function(){bump1()},0);
setTimeout(function(){bump1()},500);
setTimeout(function(){bump1()},1000);
setTimeout(function(){bump1()},3000);
setTimeout(function(){bump1()},10000);
setTimeout(function(){bump1()},20000);
