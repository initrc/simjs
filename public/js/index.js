$(document).ready(function() {
  init();
});

function init() {
  $('#compare').click(function() {
    $.ajax({
      url: '/compare/',
      type: 'post',
      data: {
        doc1: $('#doc1').val(),
        doc2: $('#doc2').val(),
      },
      success: function(data){
        $('#result').html(data);
      },
    });
  });
}
