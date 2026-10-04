$(function(){
    // $('.genealogy-tree ul').hide();
    $('.genealogy-tree>ul').show();
    // $('.genealogy-tree ul.active').show();
    $('.genealogy-tree li').on('click', function (e) {
        var children = $(this).find('> ul');
        if (children.is(":visible")) children.hide('slow').removeClass('active');
        else children.show('slow').addClass('active');
        e.stopPropagation();
    });
})



$(document).ready(function(){
    // $('.print').hide();

    var position = ($('.genealogy-tree ul li').width()/2 + $('.genealogy-tree ul').width())/2;
    $('html').scrollLeft((position / 2) + 870);
    console.log(position / 2);

    // $(".expand").click(function(){
    //     $('.genealogy-tree ul.active').toggle();
    //     // $('html').scrollLeft($('.genealogy-tree ul li').width()/2);
    //     var position = ($('.genealogy-tree ul li').width()/2 + $('.genealogy-tree ul').width())/2;
    //     $('html').scrollLeft(position / 2);
    //     console.log(position / 2);
    // })
    // $(".print").click(function(){
    //     window.print();
    //     return false;
    // })
})