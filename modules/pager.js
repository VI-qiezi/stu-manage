// 用来获取视图显示的分页信息
// page是当前的页码，totalPage是总页码
function getPages(page, totalPage){
    var pages = [page];
    var left = page -1;
    var right = page + 1;
     
    while(pages.length < 10 && (left >= 1 || right <= totalPage)){
        if(left >= 1){
            pages.unshift(left--);
        }
        if(pages.length < 10 && right <= totalPage){
            pages.push(right++);
        }
    }
    return pages;
}

module.exports = getPages;