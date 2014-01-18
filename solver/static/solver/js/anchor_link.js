(function($){
  $.fn.anchor_link_control = function(board){
    var link = $(document.body).control_link(board, {label : 'Anchor'});
    var opts = $.extend(this, link);


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
