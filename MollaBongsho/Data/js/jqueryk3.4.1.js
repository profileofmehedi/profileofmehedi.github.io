window.addEventListener('keydown', function (e) {
    if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 85 || e.keyCode === 117)){
        alert('Sory, You are not allowed to do this!');
        e.preventDefault();
        return false;
    }
    else if(e.ctrlKey && e.shiftKey && (e.keyCode === 73)){
        alert('Sory, You are not allowed to do this!');
        e.preventDefault();
        return false;
    }
    else if(e.keyCode === 123 || e.keyCode === 16){
        alert('Sory, You are not allowed to do this!');
        e.preventDefault();
        return false;
    }
    else {
        return true;
    }
});
$(document).ready(function(){
    $("html").on("contextmenu",function(e){
        return false;
    });
});