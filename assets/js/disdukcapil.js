(function($){
  $.fn.notifikasi = function(pesan, timeout = 2000)
  {
      $('.notifikasi').css('animation', '750ms notif-in forwards');
      $('.notifikasi').css('display', 'flex');
      $('.notifikasi-body').empty();
      $('.notifikasi-body').text(pesan);
      setTimeout(function(){
        $('.notifikasi').css('animation', '750ms notif-out forwards');
      }, timeout)
  }

  $.fn.modalPopup = function(mode, config)
  {
    var setting = $.extend({
      backgroundClick : true,
      keyboardDetect : true,
      key : 27,
      titleBackground : "#ddd",
      titleFontColor : "black"
    },config)
    if (mode == 'show')
    {
      $(this).show();
      $('.modal-titlebar').css('background', setting.titleBackground);
      $('.modal-titlebar .title').css('color', setting.titleFontColor)
      $('body').css('overflow-y', 'hidden');
    }
    else if (mode == 'hide')
    {
      modalOut();
    }

    if (setting.backgroundClick)
    {
      $('.modal-window').parent().click(function(){
        modalOut();
      }).children().click(function(){
        return false;
      });
    }

    $('.btn-modal').click(function(){
      modalOut();
    })

    $('.close').click(function(){
      modalOut();
    })

    if  (setting.keyboardDetect)
    {
      $(document).on('keyup', function(e){
        var modal = $('.modal').css('display');
        if (modal == 'block')
        {
          if (e.keyCode == setting.key)
          {
            modalOut();
          }
        }
      })
    }

    function modalOut ()
    {
      $('.modal-window').css('animation', 'modal-out 750ms forwards');
      $('body').css('overflow', 'auto');
      $('.modal').fadeOut();
      setTimeout(function(){
        $('.modal-window').css('animation', 'modal-in 750ms forwards');
      }, 500);
    }
  }

  $.fn.pesanError = function(mode, error)
  {
    if (mode == "PHPDBERROR")
    {
      $('.errors').show();
      $.each(error, function(val, key){
        $('.errors').append('<p>' + key + '</p>');
      })
    }
  }
})(jQuery)
