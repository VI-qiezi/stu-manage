$('#btnSave').click(function (ev) {
    ev.preventDefault();
    var tno = $.trim($("#tno").val());
    var name = $.trim($("#name").val());
    var sex = $.trim($("#sex").val());
    var birthday = $.trim($("#birthday").val());
    var card = $.trim($("#card").val());
    // 把以下三个字段隐式转化为数字类型
    var majorId = $.trim($("#majorId").val()) - 0;
    var classId = $.trim($("#classId").val()) - 0;
    var departId = $.trim($("#departId").val()) - 0;

    if(!tno || !name || !sex || !birthday || !card || majorId == -1 || classId == -1 || departId  == -1){
        $("#myModal .modal-body").text("教师编号，姓名，性别，生日，身份证号，所学专业，所属班级，所属院系不能为空！");
        $("#myModal").modal();
        return;
    }

    var nativePlace = $.trim($("#nativePlace").val());
    var address = $.trim($("#address").val());
    var qq = $.trim($("#qq").val());
    var phone = $.trim($("#phone").val());
    var email = $.trim($("#email").val());

    var data = { tno, name, sex, birthday, card, majorId, classId, departId, nativePlace, address, qq, phone, email};
    $.post("/teachers/add", data, function (data) {
        if(data.code != 200){
            $("#myModal .modal-body").text(data.message);
            $("#myModal").modal();
            return;
        }
        location.href = "/teachers/list";
    })
})