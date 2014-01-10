(function($){
  $.fn.save_button_control = function(board){
    var button = $(document.body).button_control(board, {label: 'Save'});
    var opts = $.extend(this, button);


    this.click($.proxy(function(event){
      board.remove_keystroke_handler();
      $(document.body).save_dialog(board);
    }, this));


    return this;
  }

})(jQuery);
