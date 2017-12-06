$(document).ready(
    function(){
        $('#button').click(
            function(){
                var toAdd = $('input[name=ListItem]').val();
                if(toAdd!=""){
                 $('ol').append('<li>' + toAdd + '</li>');
                 $('input[name=ListItem]').val("");
            }else{
                alert("Text Box is Empty");
            }
            });
       
       $("input[name=ListItem]").keyup(function(event){
          if(event.keyCode == 13){
            
            $("#button").click();
          }         
      });
      
      $(document).on('dblclick','li', function(){
        $(this).toggleClass('strike').fadeOut('slow');    
      });
      
      $('input').Onfocus(function() {
        $(this).val('');
      });
      
      $('ol').sortable({axis:"Y"});  
      
    }
);