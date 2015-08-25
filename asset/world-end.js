var str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum ligula mi, a consequat eros vestibulum nec. Phasellus vestibulum metus ac lorem volutpat rutrum. Aliquam ultrices augue nec tellus luctus rutrum. Nullam nisi odio, blandit sit amet rhoncus a, tempor at nisl. Sed a eros sit amet lacus euismod accumsan eu et orci. Etiam non rhoncus erat, id pharetra quam. Quisque ut placerat risus. Nulla rutrum purus at diam malesuada finibus. Aenean sit amet purus nulla. Nullam nulla lacus, hendrerit vel eros ac, maximus sollicitudin lorem. Vestibulum tempor tempus eros ac venenatis. Donec vel lectus non quam hendrerit dapibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

$(window).scroll(function() {
	if($(window).scrollLeft() + $(window).width() == $(document).width()) {
       //alert("right!");
       setInterval(function() {
       	$("body").append(str)
       }, 3000);
       
   }
});