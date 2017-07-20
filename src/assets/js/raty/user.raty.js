function raty(ids) {
   $("#"+ids).raty({
     score: function() {                   
     return $(this).attr('data-score');
    },
    readOnly: true,
    hints:['bad','poor','regular','good','gorgeous'],
    path:"../static/js/raty/Styles/img",                     
  })       
}
