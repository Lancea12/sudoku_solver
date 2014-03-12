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
      var solve_button = $('<a></a>').solve_link_control(this);
      col.append(solve_button);

      col = $('<td></td>');
      row.append(col);
      var anchor_button = $('<a></a>').anchor_link_control(this);
      col.append(anchor_button);

      col = $('<td></td>');
      row.append(col);
      var clear_button = $('<a></a>').clear_link_control(this);
      col.append(clear_button);

      col = $('<td></td>');
      row.append(col);
      this.undo_link = $('<a></a>').undo_link_control(this);
      col.append(this.undo_link);
      
      col = $('<td></td>');
      row.append(col);
      this.redo_link = $('<a></a>').redo_link_control(this);
      col.append(this.redo_link);

      col = $('<td></td>');
      row.append(col);
      var load_link = $('<a></a>').load_link_control(this);
      col.append(load_link);

      col = $('<td></td>');
      row.append(col);
      var save_link = $('<a></a>').save_link_control(this);
      col.append(save_link);
      
    }

    this.number_buttons = [];
    this.board = board;
    this.board.controls = this;
    this.table_el = table_el;
    this.build_controls();

    return this;
  }

})(jQuery);
