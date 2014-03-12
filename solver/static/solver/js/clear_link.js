(function($){
  $.fn.clear_link_control = function(controls){
    this.control_link({controls: controls, title : 'Clear Unanchored Cells'});

    this.click($.proxy(function(event){
      this.controls.board.clear();
    }, this));

    this.addClass('ui-icon-scissors');

    return this;
  }

})(jQuery);
