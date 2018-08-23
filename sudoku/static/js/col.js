(function($){
  $.fn.board_col = function(board, group_index){
    var group = $(document.body).board_group(board, group_index);
    var opts = $.extend(this, group);

    this.build_col = function (){
      for (var row_index=0; row_index < 9; row_index++){
        var row = this.board.rows[row_index];
        var cell = row.cells[this.group_index];   
        this.cells.push(cell);
      }
    }

    this.build_col();
    this.group_name = 'col';

    return this;
  }

})(jQuery);
