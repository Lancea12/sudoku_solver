(function($){
  $.fn.anchor_link_control = function(controls){
    this.control_link({controls: controls, title : 'Toggle Anchored Cells'});


    this.click($.proxy(function(event){
      if(this.controls.board.toggle_anchor_base()){
        this.name = 'unanchor';
      }else{
        this.name = 'anchor';
      }
    }, this));

    this.addClass('ui-icon-pin-s');
   
    return this;
  }

})(jQuery);
