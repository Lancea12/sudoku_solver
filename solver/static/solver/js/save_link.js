(function($){
  $.fn.save_link_control = function(controls){
    this.control_link({controls: controls, title: 'Save'});

    this.click($.proxy(function(event){
      this.controls.board.remove_keystroke_handler();
      $(document.body).save_dialog(board);
    }, this));

    this.addClass('ui-icon-disk');

    return this;
  }

})(jQuery);
