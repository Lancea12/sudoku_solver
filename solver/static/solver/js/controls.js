(function($){
  $.fn.board_controls = function(table_el, board){

    this.build_controls = function (){
      for (var row_index=0; row_index < 3; row_index++){
        var row = $('<tr></tr>');
        for(var col_index=0; col_index < 3; col_index++){
          var col = $('<td></td>');
          var num = (row_index*3)+col_index+1;
          var num_button = $(document.body).num_button_control(num, this.board);
          col.append(num_button);
          row.append(col);
        }
        this.table_el.append(row);
      }
      var row = $('<tr></tr>');
      var col = $('<td colspan=3></td>');
      var solve_button = $(document.body).solve_button_control(board);
      col.append(solve_button);
      var anchor_button = $(document.body).anchor_button_control(board);
      col.append(anchor_button);
      row.append(col);
      this.table_el.append(row);

      row = $('<tr></tr>');
      col = $('<td colspan=3></td>');
      var clear_button = $(document.body).clear_button_control(board);
      col.append(clear_button);
      row.append(col);
      this.table_el.append(row);

      row = $('<tr></tr>');
      col = $('<td colspan=3></td>');
      var load_button = $(document.body).load_button_control(board);
      col.append(load_button);
      var save_button = $(document.body).save_button_control(board);
      col.append(save_button);
      row.append(col);
      this.table_el.append(row);
      
    }

    this.number_buttons = [];
    this.board = board;
    this.table_el = table_el;
    this.build_controls();

    return this;
  }

})(jQuery);
