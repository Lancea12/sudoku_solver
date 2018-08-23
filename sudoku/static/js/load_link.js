(function($){
  $.fn.load_link_control = function(controls){
    this.control_link({controls: controls, title: 'Reload Board'});

    this.click($.proxy(function(event){
      this.controls.board.load_data();
    }, this));

    this.addClass('ui-icon-refresh');

    return this;
  }

})(jQuery);
