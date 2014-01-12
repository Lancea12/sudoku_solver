(function($){
  $.fn.board_row = function(board, group_index){
    var group = $(document.body).board_group(board, group_index);
    var opts = $.extend(this, group);

    this.build_row = function (){
      for (var cell_index=0; cell_index < 9; cell_index++){
        if(this.row_el.children().length <= cell_index){
          var $cell = $(document.body).board_cell(this, this.group_index, cell_index);
          this.cells.push($cell);
          this.row_el.append($cell.cell_el);
        }
      }
    }

    this.load_data = function(row_data){
      for(var cell_index=0; cell_index<9; cell_index++){
        var cell_data = row_data['cells'][cell_index];
        var cell = this.cells[cell_index];
        if(cell != null && cell_data != null){
          cell.load_data(cell_data);
        }
      }
    }

    this.save_data = function(){
      var data = {};
      data.row_index = this.group_index;    
      data.cells = [];
      this.cells.forEach($.proxy(function(cell){
        this.push(cell.save_data());
      }, data.cells));
      return data;
    }

    this.row_el = $('<tr></tr>');
    this.build_row()

    return this;
  }

})(jQuery);
