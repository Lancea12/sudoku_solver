(function($){
  $.fn.save_link_control = function(board){
    this.control_link({board: board, title: 'Save'});

    this.click($.proxy(function(event){
      board.remove_keystroke_handler();
      $(document.body).save_dialog(board);
    }, this));

    this.addClass('ui-icon-disk');

    return this;
  }

})(jQuery);
