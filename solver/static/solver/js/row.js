(function($){
  $.fn.board_row = function(board, row_index){
    var group = $(document.body).board_group(board);
    var opts = $.extend(this, group);

    this.build_row = function (){
      for (var cell_index=0; cell_index < 9; cell_index++){
        if(this.row_el.children().length <= cell_index){
          var $cell = $(document.body).board_cell(this, this.row_index, cell_index);
          this.cells.push($cell);
          this.row_el.append($cell.cell_el);
        }
      }
    }

    this.row_el = $('<tr></tr>');
    this.row_index = row_index;
    this.build_row()

    return this;
  }

})(jQuery);
