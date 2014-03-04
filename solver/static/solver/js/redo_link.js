(function($){
  $.fn.redo_link_control = function(board){
    this.control_link({board: board, title : 'Redo'});

    this.click($.proxy(function(event){
      this.board.redo();
    }, this));

    this.addClass('ui-icon-arrowreturnthick-1-e');

    return this;
  }

})(jQuery);
