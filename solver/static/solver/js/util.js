
Array.prototype.element_count = function(){
  var count = 0;
  for(var i=0; i<this.length; i++){
    if(this[i] != undefined){
      count++;
    }
  }
  return count;
}

delete_board = function(id){
  $.fn.board_table.delete_data(id);
}
  
