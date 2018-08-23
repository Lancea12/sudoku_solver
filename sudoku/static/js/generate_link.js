(function($){
  $.fn.generate_link_control = function(controls){
    this.control_link({controls: controls, title : 'Generate New Puzzle'});

    this.click($.proxy(function(event){
      this.controls.board.remove_keystroke_handler();
      $(document.body).generate_dialog(this.controls.board, {});
    }, this));

    this.addClass('ui-icon-document');

    return this;
  }

})(jQuery);
