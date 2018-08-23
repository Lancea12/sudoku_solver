(function($){
  $.fn.undo_link_control = function(controls){
    this.control_link({controls: controls, title : 'Undo'});

    this.click($.proxy(function(event){
      if(!this.controls.board.can_undo()){
        return;
      }
      this.controls.board.undo();
      if(!this.controls.board.can_undo()){
        this.addClass('ui-state-disabled');
      }
      if(this.controls.board.can_redo()){
        this.controls.redo_link.removeClass('ui-state-disabled');
      }
    }, this));

    this.addClass('ui-icon-arrowreturnthick-1-w');

    return this;
  }

})(jQuery);
