(function($){
  $.fn.board_group = function(board, group_index){

    this.fill_choices = function(){
      for(var index in this.cells){
        var cell = this.cells[index];
        if(cell.num_choices == 0){
          cell.add_all_choices();
        }
      }
    }

    this.remove_redundant_choices = function(){
      for(var n=1; n <= this.max_test_choices; n++){
        this.remove_redundant_choices_n(n);
      }
    }

    this.remove_redundant_choices_n = function(n){
      var mod = false;
      for(var test_index=0; test_index < this.cells.length; test_index++){
        // get the choices of the original cell
        var test_cells = [this.cells[test_index]];
        var test_choices = test_cells[0].choices;
        this.build_test_cells(test_cells, test_choices, n);

        if(test_cells.element_count() < test_choices.element_count()){
          continue;
        }
        if(this.remove_choices(test_choices, test_cells)){
          mod = true;
        }
      }
      return mod;
    }

    this.build_test_cells = function(test_cells, test_choices, n){
      // test each additional cell for a subset of choices of the original
      for(var add_index=0; 
        add_index < this.cells.length &&
        test_cells.element_count() < test_choices.element_count() &&
        test_choices.element_count() <= n;
        add_index++){

        var add_cell = this.cells[add_index];
        if(
          test_cells.indexOf(add_cell) == -1 && 
          add_cell.choices_issubset(test_choices)){

          test_cells.push(add_cell);
        }
      }
    }

    this.remove_choices = function(test_choices, test_cells){
      var mod = false;
      for(var mod_index=0; mod_index<this.cells.length; mod_index++){
        this.mod_cell = this.cells[mod_index];
        if(test_cells.indexOf(this.mod_cell) != -1){
          continue;
        }
        if(this.mod_cell.remove_choices(test_choices)){
          mod = true;
        }
      }
      return mod;
    }

    this.remove_dead_choices_1 = function(){
      var mod = false;
      for(var choice=1; choice<=9; choice++){
        if(this.remove_dead_choice_1(choice)){
          mod = true;
        } 
      }
      return mod;
    }

    this.remove_dead_choice_1 = function(choice){
      var lone_cell = null;
      this.cells.every(function(cell){
        if(cell.has_choice(choice)){
          if(lone_cell == null){
            lone_cell = cell;
          }else{
            lone_cell = null;
            return false;
          }
        }
        return true;
      }, this);
      if(lone_cell == null){
        return false;
      }
      return lone_cell.remove_all_but_one_choice(choice);
    }
  
    this.max_test_choices = 7;
    this.mod_cell = null;
    this.group_index = group_index;
    this.cells = [];
    this.board = board;

    return this;
  }

})(jQuery);
