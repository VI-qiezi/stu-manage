$(".remove").click(function () {
    var id = $(this).data('id');
    $.post("/students/remove", { id }, function (data) {
        if (data.code != 200) {
            $("#myModal .modal-body").text(data.message);
            $("#myModal").modal();
            return;
        }
        location.href = "/students/list";
        // location.reload();
    })
})

$("#btnRemove").click(function () {
    var selected = $(".selectSingle:checked");
    if (selected.length <= 0) {
        $("#myModal .modal-body").text("请选择要删除的数据！");
        $("#myModal").modal();
        return;
    }
    var ids = '';
    selected.each(function(i, ele){
        // console.log(ele);
        // console.log($(ele).data('id'));
        ids += $(ele).data('id') + ',';
    })
    if(ids.length > 0){
        ids = ids.substring(0, ids.length-1);
    }
    // console.log(ids);

    $.post("/students/multiRemove", {ids}, function(data){
        if (data.code != 200) {
            $("#myModal .modal-body").text(data.message);
            $("#myModal").modal();
            return;
        }
        location.href = "/students/list";
    })
})

$(".selectAll").click(function(){
    $(".selectSingle").prop("checked", $(".selectAll").prop("checked"));
})

$(".selectSingle").click(function(){
    // var selected = $(".selectSingle:checked");
    // if(selected.length == $(".selectSingle:checked")){
    //     $(".selectAll").prop("checked", true);
    // } else {
    //     $(".selectAll").prop("checked", false);
    // }
    $(".selectAll").prop("checked", $(".selectSingle:checked").length == $(".selectSingle").length);
})

$("#btnAdd").click(function(){
    location.href = "/students/add";
})