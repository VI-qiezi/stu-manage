$('#btnLogout').on('click', function () {
    $.post('/logout', function (data) {
        if (data.code != 200) {
            $('#myModal .modal-body').text('注销出现异常！');
            $('#myModal').modal();
            return;
        }
        location.href = "/login";
    }
    )
})
