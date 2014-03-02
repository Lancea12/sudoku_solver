(function($){
  $.fn.solve_link_control = function(board){
    this.control_link({board : board, title : 'Solve'});

    this.click($.proxy(function(event){
      this.board.solve();
    }, this));

    this.addClass('ui-icon-arrowthickstop-1-e');

    return this;
  }

})(jQuery);
