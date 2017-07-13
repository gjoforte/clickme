
$(document).ready(function () {
    var socket = io();
    
    socket.on('update', function(click) {
        $('.table-cell .counter').text(click.counter);
    });

    $('.table-cell').on('click', 'button.btnClick', function (e) {
        $.ajax({
            type: 'PUT',
            url: '/counter'
        });
    });

});
