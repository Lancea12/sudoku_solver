(function($){
  $.fn.generate_dialog = function(board, options){
    if(options == null){
      options = {};
    }
    if(options.title == null){
      options.title = 'Generate Puzzle';
    }
    $.extend(options, {minWidth: 400});
    $.extend(this, options);
    var di = $("<div id='generate_dialog'></div>").dialog(options);
    $.extend(this, di);


    this.gb_click = function(event){
      var pre_num = parseInt($('#gen_select')[0].selectedOptions[0].value);
      this.empty();
      this.append($('<p>Generating puzzle</p>'));
      this.board.generate(pre_num);
      this.dialog('close');
    }

    this.build_query_dialog = function (){
      //if(this.board.name == null){
      //  this.board.name = new Date().toString();
      //}
      var name = this.board.name != null ? this.board.name : "";
      var gen_text = '<p>Puzzle difficulty: <select id="gen_select">' +
        '<option value=45>Very Easy</option>'+
        '<option value=40>Easy</option>'+
        '<option value=35>Medium</option>'+
        '<option value=30>Hard</option>'+
        '<option value=25>Very Hard</option>'+
        '<option value=20>Insane</option>' +
        '</select></p>';
      this.text = $(gen_text);
      this.append(this.text);
      this.gb = {
        text: 'Generate',
        click: $.proxy(this.gb_click, this)
      }
      this.dialog("option", "buttons", [this.gb]);

      this.on('dialogclose', $.proxy(function(){
        this.board.setup_keystroke_handler();
      }, this));

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
