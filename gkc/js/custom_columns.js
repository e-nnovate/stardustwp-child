$('document').ready(function(){
  var returned = false;
  $('#gkccc-DIV_1').mouseenter(function(){
    returned = true;
  });
  $('#gkccc-DIV_1').mouseleave(function(){
    returned = false;
    setTimeout(function(){
      if(!returned){
        $("#gkccc-UL_3").hide();
      }
    },2000);
  });
  $('#gkccc-LABEL_2').click(function(){
    $("#gkccc-UL_3").toggle();
  });


  var ccSelect = Handlebars.compile($("#gkc-cc-select").html());
  $("#gkccc-UL_3").html( ccSelect(gkcDistributions.GAVIX_TABLE.headers)  );

  $("#gkccc-UL_3 input").change(function(){
    $('#distro .col-' + $(this).attr("data-col")).toggle();
  });
});
