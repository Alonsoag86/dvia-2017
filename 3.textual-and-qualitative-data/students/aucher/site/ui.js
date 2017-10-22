$(document).ready(function(){
  // enter your client-side code here (if any)

  
  $('.venue').click(function(){
	  console.log($('.' + this.id));
	  $('.active').removeClass('active');
	  $('.' + this.id).addClass('active');
	  $(this).addClass('active');
	})

  $('td').click(function(){
  	var txtClass = $(this).children().first().attr("class");
	  $('.active').removeClass('active');
	  console.log(txtClass);
	  $('.' + txtClass).addClass('active');
	  $(this).children().addClass('active');
	});

})