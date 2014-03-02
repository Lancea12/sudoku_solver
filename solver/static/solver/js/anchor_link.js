(function($){
  $.fn.anchor_link_control = function(board){
    this.control_link({board: board, title : 'Toggle Anchored Cells'});


    this.click($.proxy(function(event){
      if(this.board.toggle_anchor_base()){
        this.name = 'unanchor';
      }else{
        this.name = 'anchor';
      }
    }, this));

    this.addClass('ui-icon-pin-s');
   
    return this;
  }

})(jQuery);
