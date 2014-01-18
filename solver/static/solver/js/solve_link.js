(function($){
  $.fn.solve_link_control = function(board){
    var link = $(document.body).control_link(board, {label : 'Solve'});
    var opts = $.extend(this, link);


    this.click($.proxy(function(event){
      this.board.solve();
    }, this));

    this.addClass('ui-icon-arrowthickstop-1-e');

    return this;
  }

})(jQuery);
