(function($){
  $.fn.save_as_link_control = function(controls){
    this.control_link({controls: controls, title: 'Save As'});

    this.click($.proxy(function(event){
      this.controls.board.remove_keystroke_handler();
      $(document.body).save_dialog(this.controls.board);
    }, this));

    this.addClass('ui-icon-wrench');

    return this;
  }

})(jQuery);
