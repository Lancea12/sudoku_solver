$(function(fn){

  Array.prototype.element_count = function(){
    var count = 0;
    for(var i=0; i<this.length; i++){
      if(this[i] != undefined){
        count++;
      }
    }
    return count;
  }
  
  var board_el = $('#board_table')
  var $bt = $(document.body).board_table(board_el);
  var controls_el = $('#controls_table')
  var $con = $(document.body).board_controls(controls_el, $bt);
})

