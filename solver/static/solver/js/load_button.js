(function($){
  $.fn.load_button_control = function(board){
    var button = $(document.body).button_control(board, {label: 'Load'});
    var opts = $.extend(this, button);


    this.click($.proxy(function(event){
      board.remove_keystroke_handler();
      $(document.body).load_dialog(board);
    }, this));


    return this;
  }

})(jQuery);
