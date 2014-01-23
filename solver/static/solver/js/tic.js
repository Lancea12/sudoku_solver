(function($){
  $.fn.board_tic = function(board, group_index){
    var group = $(document.body).board_group(board, group_index);
    var opts = $.extend(this, group);

    this.build_tic = function (){
      var row_start = this.group_index - (this.group_index % 3);
      var col_start = (this.group_index % 3) * 3;
      for (var row_index=row_start; row_index < row_start+3; row_index++){
        for (var col_index=col_start; col_index < col_start+3; col_index++){
          var row = this.board.rows[row_index];
          var cell = row.cells[col_index];   
          this.cells.push(cell);
        }
      }
    }

    this.build_tic();
    this.group_name = 'tic';

    return this;
  }

})(jQuery);
