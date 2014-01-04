(function($){
  $.fn.board_tic = function(board, tic_index){
    var group = $(document.body).board_group(board);
    var opts = $.extend(this, group);

    this.build_col = function (){
      var row_start = tic_index - (tic_index % 3);
      var col_start = (tic_index % 3) * 3;
      for (var row_index=row_start; row_index < row_start+3; row_index++){
        for (var col_index=col_start; col_index < col_start+3; col_index++){
          var row = this.board.rows[row_index];
          var cell = row.cells[col_index];   
          this.cells.push(cell);
        }
      }
    }

    this.tic_index = tic_index;
    this.build_col();

    return this;
  }

})(jQuery);
