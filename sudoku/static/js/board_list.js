(function($){
  $.fn.board_list_table = function(list_table_el){

    this.build_list = function (){
      for(var row_index=0; row_index < 9; row_index++){
        var row = $(document.body).board_row(this, row_index);
        this.rows.push(row);
        this.table_el.append(row.row_el);
      }

    }

    this.list_table_el = list_table_el;

    return this;

  }
})(jQuery);
