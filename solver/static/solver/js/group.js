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
      var mod = false;
      for(var n=1; n <= this.max_test_choices; n++){
        if(this.remove_redundant_choices_n(n)){
          mod = true;
        }
      }
      return mod;
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

    this.remove_cross_redundant_cells = function(cross_index_name){
      var mod = false;
      for(var choice=1; choice<=9; choice++){
        if(this.remove_cross_redundant_choice(choice, cross_index_name)){
          mod = true;
        } 
      }
      return mod;
    }

    this.remove_cross_redundant_choice = function(choice, cross_group_name){
      var mod = false;
      var cross_index = null;
      var in_single_cross_group = true;
      var num_cells_with_choice = 0;
      this.cells.every(function(cell){
        if(!cell.has_choice(choice)){
          return true;
        }
        num_cells_with_choice++;
        if(cross_index == null){
          cross_index = cell[cross_group_name+'_index'];
        }else if(cell[cross_group_name+'_index'] != cross_index){
          in_single_cross_group = false;
          return false; 
        }
        return true;
      }, this);

      if(in_single_cross_group && num_cells_with_choice > 1){
        var cross_group = this.board[cross_group_name+'s'][cross_index];    
        if(cross_group.remove_choice_from_cells_not_in_cross_group(choice, this)){
          mod = true;
        }
      }

      return mod;
    }

    this.remove_choice_from_cells_not_in_cross_group = function(choice, cross_group){
      var mod = false;
      this.cells.forEach(function(cell){
        if(cell[cross_group.group_name+'_index'] != cross_group.group_index){
          if(cell.remove_choice(choice)){
            mod = true;
          }
        }
      }, this);
      return mod;
    }
  
    this.max_test_choices = 7;
    this.mod_cell = null;
    this.group_index = group_index;
    this.cells = [];
    this.board = board;

    return this;
  }

})(jQuery);
