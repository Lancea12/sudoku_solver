(function($){
  $.fn.save_dialog = function(board, options){
    if(options == null){
      options = {};
    }
    var di = $("<div id='save_dialog' title='Save Board'></div>").dialog();
    var opts = $.extend(this, di);

    this.build_dialog = function (){
      //if(this.board.name == null){
      //  this.board.name = new Date().toString();
      //}
      var name = this.board.name != null ? this.board.name : "";
      this.text = $('<input type="text" value="'+name+'"></input>');
      this.append(this.text);
      var lb = $('<button>Save</button>');
      lb.click($.proxy(function(event){
        $.ajax('/board/', {
          success: $.proxy(this.list_success, this),
          dataType: 'json',
        });
      }, this));
      this.append(lb);

      this.on('dialogclose', $.proxy(function(){
        this.board.setup_keystroke_handler();
      }, this));

    }

    this.list_success = function(data, textStatus, jqXHR){
      this.exists = false;
      var list = data.boards;
      if(this.text.val() != this.board.name){
        list.forEach($.proxy(function(val){
          if(val['name'] == this.text.val() && val['id'] != board.id){
            this.append($('<p>already exists</p>'));
            this.exists = true;
          }
        }, this));
      }
      if(!this.exists){
        this.board.save_data(this, this.text.val());
      }
    
    }

    this.exists = false;
    this.text = null;
    this.board = board;
    this.build_dialog();

    return this;
  }

})(jQuery);
