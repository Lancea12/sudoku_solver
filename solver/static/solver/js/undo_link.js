(function($){
  $.fn.undo_link_control = function(board){
    this.control_link({board: board, title : 'Undo'});

    this.click($.proxy(function(event){
      this.board.undo();
    }, this));

    this.addClass('ui-icon-arrowreturnthick-1-w');

    return this;
  }

})(jQuery);
