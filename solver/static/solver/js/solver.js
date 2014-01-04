$(function(fn){
  //update_board_table();
  var board = decode_board();
  var board_el = $('#board_table')
  var $bt = $(document.body).board_table(board_el);
  var controls_el = $('#controls_table')
  var $con = $(document.body).board_controls(controls_el, $bt);
  //var $row = $bt.rows[0];
  //var $cell = $row.cells[0];
  //$cell.add_choice(1);
  //$cell.add_choice(2);
  
})

