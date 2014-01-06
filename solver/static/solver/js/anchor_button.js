(function($){
  $.fn.anchor_button_control = function(board){
    var button = $(document.body).button_control(board, {label : 'Anchor'});
    var opts = $.extend(this, button);


    this.click($.proxy(function(event){
      if(this.board.toggle_anchor_base()){
        this.name = 'unanchor';
      }else{
        this.name = 'anchor';
      }
    }, this));

    return this;
  }

})(jQuery);
