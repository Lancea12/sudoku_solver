(function($){
  $.fn.board_col = function(board, col_index){
    var group = $(document.body).board_group(board);
    var opts = $.extend(this, group);

    this.build_col = function (){
      for (var row_index=0; row_index < 9; row_index++){
        var row = this.board.rows[row_index];
        var cell = row.cells[this.col_index];   
        this.cells.push(cell);
      }
    }

    this.col_index = col_index;
    this.build_col();

    return this;
  }

})(jQuery);
