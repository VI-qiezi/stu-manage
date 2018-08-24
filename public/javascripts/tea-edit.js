$("#btnSave").click(function(ev){
    ev.preventDefault();
    var id = $("#id").val();
    var tno = $.trim($("#tno").val());
    var name = $.trim($("#name").val());
    var sex = $.trim($("#sex").val());
    var birthday = $.trim($("#birthday").val());
    var card = $.trim($("#card").val());
    var departId = $.trim($("#departId").val()) - 0;
    var majorId = $.trim($("#majorId").val()) - 0;
    var classId = $.trim($("#classId").val()) - 0;
    var nativePlace = $.trim($("#nativePlace").val());
    var address = $.trim($("#address").val());
    var qq = $.trim($("#qq").val());
    var phone = $.trim($("#phone").val());
    var email = $.trim($("#email").val());
    console.log(tno);
    if(!tno || !name || !sex || !birthday || departId == -1 || majorId == -1 || classId == -1){
        $("#myModal .modal-body").text("教师编号，姓名，性别，出生日期，身份证号，所属院系，所属专业，所属班级不能为空！");
        $("#myModal").modal();
        return;
    }

    var data = {id, tno, name, sex, birthday, card, departId, majorId, classId, nativePlace, address, qq, phone, email};

    $.post("/teachers/edit", data, function(data){
        if(data.code != 200){
            $("#myModal .modal-body").text(data.code);
            $("#myModal").modal();
            return;
        }
        location.href = '/teachers/list';
    })
})