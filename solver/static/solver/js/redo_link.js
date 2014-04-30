(function($){
  $.fn.redo_link_control = function(controls){
    this.control_link({controls: controls, title : 'Redo'});

    this.click($.proxy(function(event){
      if(!this.controls.board.can_redo()){
        return;
      }
      this.controls.board.redo();
      if(!this.controls.board.can_redo()){
        this.addClass('ui-state-disabled')
      }
      if(this.controls.board.can_undo()){
        this.controls.undo_link.removeClass('ui-state-disabled')
      }
    }, this));

    this.addClass('ui-icon-arrowreturnthick-1-e');

    return this;
  }

})(jQuery);
