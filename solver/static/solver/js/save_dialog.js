(function($){
  $.fn.save_dialog = function(board, options){
    if(options == null){
      options = {};
    }
    var di = $("<div id='load_dialog' title='Save Board'></div>").dialog();
    var opts = $.extend(this, di);

    this.build_dialog = function (){
      if(this.board.name == null){
        this.board.name = new Date().toString();
      }
      this.text = $('<input type="text" value="'+this.board.name+'"></input>');
      this.append(this.text);
      var lb = $('<button>Save</button>');
      lb.click($.proxy(function(event){
        this.board.name = this.text.val();
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

    this.list_success = function(list, textStatus, jqXHR){
      this.exists = false;
      list.forEach($.proxy(function(val){
        if(val['name'] == board.name && val['id'] != board.id){
          this.append($('<p>already exists</p>'));
          this.exists = true;
        }
      }, this));
      if(!this.exists){
        this.board.save_data(this);
      }
    }

    this.exists = false;
    this.text = null;
    this.board = board;
    this.build_dialog();

    return this;
  }

})(jQuery);
