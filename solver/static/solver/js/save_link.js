(function($){
  $.fn.save_link_control = function(board){
    var link = $(document.body).control_link(board, {label: 'Save'});
    var opts = $.extend(this, link);

    this.click($.proxy(function(event){
      board.remove_keystroke_handler();
      $(document.body).save_dialog(board);
    }, this));

    this.addClass('ui-icon-disk');

    return this;
  }

})(jQuery);
