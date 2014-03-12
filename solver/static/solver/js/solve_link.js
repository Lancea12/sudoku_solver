(function($){
  $.fn.solve_link_control = function(controls){
    this.control_link({controls: controls, title : 'Solve'});

    this.click($.proxy(function(event){
      this.controls.board.solve();
    }, this));

    this.addClass('ui-icon-arrowthickstop-1-e');

    return this;
  }

})(jQuery);
