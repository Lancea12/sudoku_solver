(function($){
  $.fn.save_dialog = function(board, options){
    if(options == null){
      options = {};
    }
    var di = $("<div id='save_dialog' title='Save Board'></div>").dialog({
      minWidth: 400});
    var opts = $.extend(this, di);
    var opts = $.extend(this, options);


    this.build_query_dialog = function (){
      //if(this.board.name == null){
      //  this.board.name = new Date().toString();
      //}
      var name = this.board.name != null ? this.board.name : "";
      this.title += 'As';
      this.append(intro);
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

    this.build_success_dialog = function(){
      this.text = $('<input type="text" value="'+name+'"></input>');
      this.append(this.text);
    }

    this.build_failure_dialog = function(){
      this.text = $('<p>Save Failed: ' + this.reason +'<p>');
      this.append(this.text);
    }

    this.list_success = function(data, textStatus, jqXHR){
      if(!this.hasAttribute('exists')){
        this.exists = false;
      }
      var list = data.boards;
      if(this.text.val() != this.board.name && ! this.exists){
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
    this.dialog_builder = this.build_query_dialog;
    if(this.dialog_type != null){
      this.dialog_builder = this['build_' + this.dialog_type];
    }
    this.dialog_builder();

    return this;
  }

})(jQuery);
