(function($){
  $.fn.load_dialog = function(board, options){
    if(options == null){
      options = {};
    }
    var di = $("<div id='load_dialog' title='Load Board'></div>").dialog();
    var opts = $.extend(this, di);

    this.build_dialog = function (){
      this.table = $('<table></table>');
      this.append(this.table);
      var lb = $('<button>Load</button>');
      lb.click($.proxy(function(event){
        this.board.load_data(this.selected_id, this);
        this.dialog('close');
      }, this));
      this.append(lb);
      this.load_list();
    }

    this.load_list = function(){
      $.ajax('/board/', {
        success: $.proxy(this.list_success, this),
        dataType: 'json',
      });
    }


    this.list_success = function(list, textStatus, jqXHR){
      list.forEach($.proxy(function(val){
        var list_row = $('<tr><td>'+val.name+'</td></tr>');
        list_row.list = this;
        list_row.id = val.id;
        this.rows[val.id] = list_row;
        list_row.click($.proxy(function(event){
          if(this.list.selected_id != null){
            $(this.list.rows[this.list.selected_id]).removeClass('selected_row');
          }
          this.list.selected_id = this.id;
          this.addClass('selected_row');
        }, list_row));
        this.table.append(list_row);
      }, this)); 
    }

    this.board = board;
    this.rows = {};
    this.selected_id = null;
    this.table = null;
    this.build_dialog();

    return this;
  }

})(jQuery);
