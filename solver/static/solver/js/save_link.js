(function($){
  $.fn.save_link_control = function(controls){
    this.control_link({controls: controls, title: 'Save'});

    this.click($.proxy(function(event){
      this.controls.board.save_data();
    }, this));

    this.addClass('ui-icon-disk');

    return this;
  }

})(jQuery);
