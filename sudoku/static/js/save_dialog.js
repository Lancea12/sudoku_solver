(function($){
  $.fn.save_dialog = function(board, options){
    if(options == null){
      options = {};
    }
    if(options.title == null){
      options.title = 'Save Board';
    }
    $.extend(options, {minWidth: 400});
    $.extend(this, options);
    var di = $("<div id='save_dialog'></div>").dialog(options);
    $.extend(this, di);


    this.sb_click = function(event){
      $.ajax('/board/', {
        success: $.proxy(this.list_success, this),
        dataType: 'json',
      });
    }

    this.yb_click = function(event, id){
      this.board.save_data(this, this.text.val(), id);
    }

    this.build_query_dialog = function (){
      //if(this.board.name == null){
      //  this.board.name = new Date().toString();
      //}
      var name = this.board.name != null ? this.board.name : "";
      this.title += 'As';
      this.text = $('<input type="text" value="'+name+'"></input>');
      this.append(this.text);
      this.sb = {
        text: 'Save',
        click: $.proxy(this.sb_click, this)
      }
      this.yb = {
        text: 'Yes',
        //click: $.proxy(this.yb_click, this)
      }
      this.dialog("option", "buttons", [this.sb]);

      this.on('dialogclose', $.proxy(function(){
        this.board.setup_keystroke_handler();
      }, this));

    }

    this.build_success_dialog = function(){
      this.text = $('<p>Save Success<');
      this.append(this.text);
    }

    this.build_failure_dialog = function(){
      this.text = $('<p>Save Failed: ' + this.reason +'</p>');
      this.append(this.text);
    }

    this.list_success = function(data, textStatus, jqXHR){
      var list = data.boards;
      list.forEach($.proxy(function(val){
        if(val['name'] == this.text.val() && val['id'] != board.id){
          this.exists = true;
          this.append($('<p>' + this.text.val() + 
            ' Already Exists: Overwrite?</p>'));
          this.yb.click = $.proxy(this.yb_click, this, val['id']);
          this.dialog("option", "buttons", [this.yb]);
          
        }
      }, this));
      if(!this.exists){
        this.board.save_data(this, this.text.val(), this.id);
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
