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
      var inner_table = $('<table></table>');
      col.append(inner_table);
      row.append(col);
      this.table_el.append(row);
      
      row = $('<tr></tr>');
      inner_table.append(row);

      col = $('<td></td>');
      row.append(col);
      var solve_button = $(document.body).solve_link_control(board);
      col.append(solve_button);

      col = $('<td></td>');
      row.append(col);
      var anchor_button = $(document.body).anchor_link_control(board);
      col.append(anchor_button);

      col = $('<td></td>');
      row.append(col);
      var clear_button = $(document.body).clear_link_control(board);
      col.append(clear_button);

      col = $('<td></td>');
      row.append(col);
      var load_link = $(document.body).load_link_control(board);
      col.append(load_link);

      col = $('<td></td>');
      row.append(col);
      var save_link = $(document.body).save_link_control(board);
      col.append(save_link);
      
    }

    this.number_buttons = [];
    this.board = board;
    this.table_el = table_el;
    this.build_controls();

    return this;
  }

})(jQuery);
