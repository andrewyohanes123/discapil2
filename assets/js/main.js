var app = angular.module('capil', ['ngRoute']);
var baseUrl = window.location.origin + "/capil2/pendaftaran.html";

var dash = angular.module('dashboard', ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl : "form1.html"
  })
  .when('/halaman2', {
    templateUrl : "form2.html"
  })
  .when('/halaman3', {
    templateUrl : "form3.html"
  })
  .when('/halaman4', {
    templateUrl : "form4.html"
  })
  .when('/halaman5', {
    templateUrl : "form5.html"
  })
  .when('/halaman6', {
    templateUrl : "form6.html"
  })
  // .when()
  .when('/halaman7', {
    templateUrl : "form7.html"
  });
});

dash.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl : "dashboard/main.html"
  })
  .when('/semua_laporan', {
    templateUrl : "dashboard/semua_laporan.html"
  })
})

app.controller('home', function($scope){
  var data = [{
    title : "Pendaftaran",
    deskripsi : "Pendaftaran akte kelahiran"
  },
  {
    title : "Upload berkas",
    deskripsi : "Upload berkas yang diperlukan untuk melengkapi pendaftaran."
  },
  {
    title : "Cek Berkas",
    deskripsi : "Cek kelengkapan berkas yang di masukkan"
  },
  {
    title : "Cek status",
    deskripsi : "Cek status pendaftaran"
  }
  ];

  $scope.modal = function(title)
  {
    if (title == 'pendaftaran')
    {
      $scope.title = data[0].title;
      $scope.deskripsi = data[0].deskripsi;
    }
    else if (title == 'upload')
    {
      $scope.title = data[1].title;
      $scope.deskripsi = data[1].deskripsi;
    }
    else if (title == 'cek')
    {
      $scope.title = data[2].title;
      $scope.deskripsi = data[2].deskripsi;
    }
    else
    {
      $scope.title = data[3].title;
      $scope.deskripsi = data[3].deskripsi;
    }
  }
});

app.controller('pelaporan', function($scope, $location){
  $scope.pindahHalaman = function(halaman)
  {
    window.location.replace(baseUrl + '#!/' + halaman);
  }
});


$(document).ready(function(){
  $('span.info').click(function(){
    $('#modal').css('display', 'block');
    $('body').css('overflow', 'hidden');
  });

  $('.submenu li a').click(function(){
    $('.submenu li a').removeClass('submenu-active');
    $('.sidebar-menu li:first-child a').removeClass('active');
    $(this).addClass('submenu-active');
  })

  $('.sidebar-menu li:first-child a').not('.submenu li:first-child a').click(function(){
    $('.submenu li a').removeClass('submenu-active');
    $('.sidebar-menu li:first-child a').not('.submenu li:first-child a').addClass('active');
  })

  $('.sidebar-menu').children('li').children('a').click(function(){
    $(this).parent().children('.submenu').slideToggle();
    $(this).children('span').children('i').toggleClass('fa-angle-right');
    $(this).children('span').children('i').toggleClass('fa-angle-down');
  });

  $(document).on('click', '#dlmManado',function(){
    $('#manado').show();
    $('#luar_manado').hide();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });

  $(document).on('click', '#luarManado',function(){
    $('#manado').hide();
    $('#luar_manado').show();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });

  $(document).on('click', '#btnBantuan',function(){
    $('#bantuan').show();
    $('#alur-pembuatan').hide();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });

  $(document).on('click', '#btnAlur',function(){
    $('#bantuan').hide();
    $('#alur-pembuatan').show();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });

  $('#upload_file').click(function(){
    window.location.replace('upload_file.html');
  });

  $('#daftar').click(function(){
    window.location.replace('pendaftaran.html');
  });

  $('#berkas').click(function(){
    window.location.replace('berkas.html');
  });

  $('.head').click(function(){
    $(this).children('span.collapse-icon').children('i.fa').toggleClass('icon-up');
    $(this).siblings('div.collapse-body').slideToggle();
  });

  $('.btn-modal').click(function(){
    $('.modal-window').css('animation', 'modal-out 750ms forwards');
    $('body').css('overflow', 'auto');
    $('#modal').fadeOut();
    setTimeout(function(){
      $('.modal-window').css('animation', 'modal-in 750ms forwards');
    }, 500);
  });
  $(document).on('keydown', function(e){
    if ($('#modal').css('display') == 'block')
    {
      if (e.keyCode == 27)
      {
        $('.modal-window').css('animation', 'modal-out 750ms forwards');
        $('#modal').fadeOut();
        $('body').css('overflow', 'auto');
        setTimeout(function(){
          $('.modal-window').css('animation', 'modal-in 750ms forwards');
        }, 500);
      }
    }
  });

  $('.btn-collapse').click(function(){
    $('.menu li').not('.menu li:first-child').slideToggle();
  })
});
