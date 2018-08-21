$('#btnSave').click(function () {
    var tno = $.trim($("#tno").val());
    var name = $.trim($("#name").val());
    var sex = $.trim($("#sex").val());
    var birthday = $.trim($("#birthday").val());
    var card = $.trim($("#card").val());
    var majorId = $.trim($("#majorId").val());
    var classId = $.trim($("#classId").val());
    var departId = $.trim($("#departId").val());
    var data = { tno, name, sex, birthday, card, majorId, classId, departId };
    $.post("/teachers/add", data, function (d) {
        console.log(d);
    })
})