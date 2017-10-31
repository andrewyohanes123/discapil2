var app = angular.module('capil', ['ngRoute', 'ngCookies', 'ngFileUpload']);
// var baseUrl = window.location.origin + "/capil2/pendaftaran.html";
var backendUrl = window.location.origin + "/capil_dev/akte_mati/api"
var link = window.location.origin + "/capil_dev/akte_mati/assets/berkas";

var dash = angular.module('dashboard', ['ngRoute', 'ngCookies']);

app.config(function($routeProvider){
  $routeProvider
  .when('/home', {
    templateUrl : "view/home.html",
    controller : "home"
  })
  .when('/login', {
    templateUrl : "view/login.html",
    controller : "login"
  })
  .when('/bantuan', {
    templateUrl : "view/bantuan.html",
    controller : "bantuan"
  })
  .when('/daftar/no_kk',{
    templateUrl : "form1.html",
    controller : "no_kk"
  })
  .when('/daftar/jenazah', {
    templateUrl : "form2.html",
    controller : "jenazah"
  })
  .when('/daftar/ayah', {
    templateUrl : "form3.html",
    controller : "ayah"
  })
  .when('/daftar/ibu', {
    templateUrl : "form4.html",
    controller : "ibu"
  })
  .when('/daftar/pelapor', {
    templateUrl : "form5.html",
    controller : "pelapor"
  })
  .when('/daftar/saksi1', {
    templateUrl : "form6.html",
    controller : "saksi1"
  })
  .when('/daftar/saksi2', {
    templateUrl : "form7.html",
    controller : "saksi2"
  })
  .when('/daftar/data_keluarga', {
    templateUrl : "persetujuan.html",
    controller : "data_keluarga"
  })
  .when('/upload', {
    templateUrl : "view/upload.html",
    controller : "upload"
  })
  .when('/upload/berkas', {
    templateUrl : "view/berkas.html",
    controller : "berkas"
  })
  .otherwise({
    redirectTo : 'home'
  });
});

dash.config(function($routeProvider){
  $routeProvider
  .when('/semua_laporan', {
    templateUrl : "dashboard/semua_laporan.html",
    controller : "list"
  })
  .when('/diverifikasi', {
    templateUrl : "dashboard/verifikasi.html",
    controller : "verifikasi"
  })
  .when('/belum_diverifikasi', {
    templateUrl : "dashboard/blm_verifikasi.html",
    controller : "blm_verifikasi"
  })
  .when('/user', {
    templateUrl : "dashboard/user.html",
    controller : "pengguna"
  })
  .otherwise({
    redirectTo : '/semua_laporan'
  });
});

dash.controller('pengguna', function($scope, $http, $cookies){
  $scope.limit = "5";
  $scope.currentpage = 1;
  $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.limit));
  $scope.blokir = "1";

  $scope.openModal = function(mode, id_user = '',username = '', nama = '', aktif = '')
  {
    if (mode == "Tambah user")
    {
      $scope.mode = mode;
      $('#modal').modalPopup('show', {
        titleBackground : "#6bc89b",
        titleFontColor : "#05472c"
      })
    }
    else if (mode == "Edit user")
    {
      $scope.mode = mode
      $scope.username = username;
      $scope.nama_lengkap = nama
      $scope.blokir = aktif + "";
      $scope.id = id_user;
      $('#modal').modalPopup('show', {
        titleBackground : "#dba03c",
        titleFontColor : "#4d3604"
      });
    }
    else if (mode == "Hapus user")
    {
      $scope.mode = mode;
      $scope.id = id_user;
      $scope.user = username;
      $('#modal').modalPopup('show', {
        titleBackground : "#c74343",
        titleFontColor : "#4d0404"
      });
    }
  }

  $scope.tambah_user = function()
  {
    var data = {
      username : $scope.username,
      nama : $scope.nama_lengkap,
      password : $scope.password,
      aktif : parseInt($scope.blokir)
    }
    $http.post(backendUrl + "/tambah_pengguna", data).then(function(resp){
      var status = resp.data.status;
      var pesan = resp.data.data;
      if (status)
      {
        $('#modal').modalPopup('hide');
        setTimeout(function(){
          $('.notifikasi').notifikasi(pesan, 3000);
        }, 500)
        $scope.username = '';
        $scope.nama_lengkap = '';
        $scope.password = '';
        $scope.blokir = "1";
        $scope.get();
      }
      else
      {
        $('.notifikasi').css('z-index', 4000)
        $('.notifikasi').notifikasi("Lengkapi formulir");
      }
    })
  }

  $scope.edit_user = function()
  {
    if ($scope.password == '' || $scope.password == null)
    {
      var data = {
        id_pengguna : $scope.id,
        nama : $scope.nama_lengkap,
        username : $scope.username,
        password : '',
        aktif : parseInt($scope.blokir)
      }
    }
    else
    {
      var data = {
        id_pengguna : $scope.id,
        nama : $scope.nama_lengkap,
        username : $scope.username,
        password : $scope.password,
        aktif : parseInt($scope.blokir)
      }
    }

    $http.post(backendUrl + "/edit_pengguna", data).then(function(resp){
      var status = resp.data.status;
      var pesan = resp.data.data;
      if (status)
      {
        $('#modal').modalPopup('hide');
        setTimeout(function(){
          $('.notifikasi').notifikasi(pesan, 3000);
        }, 500)
        $scope.get();
      }
      else
      {
        $('.notifikasi').css('z-index', 4000)
        $('.notifikasi').notifikasi("Lengkapi formulir");
      }
    })
  }

  $scope.hapus_user = function()
  {
    $http.get(backendUrl + "/hapus_pengguna/" + $scope.id).then(function(resp){
      var status = resp.data.status;
      var pesan = resp.data.data;
      if (status)
      {
        $('#modal').modalPopup('hide');
        setTimeout(function(){
          $('.notifikasi').notifikasi(pesan, 3000);
        }, 500)
        $scope.get();
      }
      else
      {
        $('.notifikasi').css('z-index', 4000)
        $('.notifikasi').notifikasi("Lengkapi formulir");
      }
    })
  }

  $scope.prev = function()
  {
    if ($scope.currentpage <= 0)
    {
      $scope.currentpage = 1;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.limit));
    }
    else
    {
      $scope.currentpage--;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.limit));
      $scope.get();
    }
  }

  $scope.next = function()
  {
    if ($scope.currentpage == $scope.jlhHalaman)
    {
      $scope.currentpage = $scope.jlhHalaman;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.limit));
    }
    else
    {
      $scope.currentpage++;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.limit));
      $scope.get();
    }
  }

  $('#nama').keyup(function(){
    $scope.nama = $(this).val();
    $scope.get();
  });

  $('#limit').change(function(){
    $scope.nama = $('#nama').val();
    $scope.limit = $(this).val();
    $scope.get();
  })
  $scope.get = function()
  {
    var data = {
      nama : $scope.nama
    }
    $http({
      url : backendUrl + "/ambil_pengguna/" + $scope.limit + "/" + $scope.offset,
      method : "GET",
      params : data
    }).then(function(resp){
      var status = resp.data.status;
      if (status == "PHPDBERROR")
      {
        var arr = resp.data.errors;
        $('.errors').pesanError(status, arr);
      }
      else if (status == "PHPERROR")
      {
        var error = resp.data.errors;
        $('.errors').presanError(status, error);
      }
      else
      {
        $scope.list = resp.data.data.list;
        angular.forEach($scope.list, function(val, key){
          if (val.aktif == 1)
          {
            val.mode = "Aktif";
          }
          else
          {
            val.mode = "Blokir";
          }
        })
        $scope.list = $scope.list;
        $scope.totalData = resp.data.data.total;
        $scope.jlhHalaman = Math.ceil($scope.totalData/parseInt($scope.limit));
      }
    })
  }
  $scope.get();
})

dash.controller('blm_verifikasi', function($scope, $http, $cookies){
  $scope.sort = "asc";
  $scope.order = "nik"
  $scope.batas = "5"
  $scope.currentpage = 1;

  $('#tgl').flatpickr({
    locale : "id"
  });

  $('#batas').change(function(){
    $scope.batas = $(this).val();
    $scope.get();
  });

  $('#sort').change(function(){
    $scope.sort = $(this).val();
    $scope.get();
  });

  $('#order').change(function(){
    $scope.order = $(this).val();
    $scope.get();
  })

  $scope.tgl = moment().startOf('month').format('YYYY-MM-DD');
  $scope.tgl2 = moment().endOf('month').format('YYYY-MM-DD');
  $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.batas));

  $scope.prev = function()
  {
    if ($scope.currentpage <= 0)
    {
      $scope.currentpage = 1;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.batas));
      $scope.get();
    }
    else
    {
      $scope.currentpage--;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.batas));
      $scope.get();
    }
  }

  $('#cari').keyup(function(){
    $scope.currentpage = 1;
    $scope.get();
  })

  $scope.next = function()
  {
    if ($scope.currentpage > $scope.jlhHalaman)
    {
      $scope.currentpage = $scope.jlhHalaman;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.batas));
      $scope.get();
    }
    else
    {
      $scope.currentpage++;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.batas));
      $scope.get();
    }
  }

  $('#tgl').change(function(){
    $('#tgl2').flatpickr({
      locale : "id",
      minDate : $('#tgl').val()
    })
    $scope.tgl2 = moment().endOf('month').format('YYYY-MM-DD');
  })

  $('#tgl2').change(function(){
    $scope.tgl = $('#tgl').val();
    $scope.tgl2 = $('#tgl2').val();
    $scope.get();
  })
  $('a.ng-binding').click(function(){
    var url = $(this).attr('href');
    if (url == "")
    {
      return false;
    }
    else
    {
      window.open(url, "_blank");
      return false;
    }
  })
  $scope.get = function()
  {
    moment.locale('id');
    $http({
      url : backendUrl + "/ambil_pendaftaran/" + $scope.batas + "/" + $scope.offset,
      method : "GET",
      params : {
        order_by : $scope.order,
        sort_type : $scope.sort,
        date_start : $scope.tgl,
        date_end : $scope.tgl2,
        nik : $scope.cari,
        approved : 0
      }
    }).then(function(resp){
      var status = resp.data.status;
      if (status == "PHPERROR")
      {
        var data = resp.data.errors;
        $('body').pesanError(status, data);
      }
      else if (status == "PHPDBERROR")
      {
        var array = resp.data.errors;
        $('body').pesanError(status, array);
      }
      else
      {
        var hasil = resp.data.data.list;
      }
      $scope.jlhHalaman = Math.ceil(resp.data.data.total/parseInt($scope.batas));
      angular.forEach(hasil, function(val, key){
        val.tanggal_pendaftaran = moment(val.tanggal_pendaftaran).format('DD MMMM YYYY');
        val.tanggal_kematian = moment(val.tanggal_kematian).format('DD MMMM YYYY');
      })
      $scope.list = hasil;
    })
  }

  $scope.detail = function(no)
  {
    $http.get(backendUrl + "/ambil_detail_pendaftaran/" + no).then(function(resp){
      var hasil = resp.data.data;
      $scope.nomor_kk = hasil.no_kk;
      $scope.nama_kepala_keluarga = hasil.nama_kepala_keluarga;
      $scope.nama_ibu = hasil.nama_ibu;
      $scope.nik_ibu = hasil.nik_ibu;
      $scope.nik_ayah = hasil.nik_ayah;
      $scope.nama_ayah = hasil.nama_ayah;
      $scope.pelapor = hasil.pelapor;
      $scope.saksi = hasil.saksi;
      $scope.nama = hasil.nama;
      $scope.nik = hasil.nik;
      $scope.tanggal_kematian = hasil.tanggal_kematian;
      $scope.waktu_meninggal = hasil.waktu_meninggal;
      $scope.sebab_kematian = hasil.sebab_kematian;
      $scope.yang_menerangkan = hasil.yang_menerangkan;

      var berkas = resp.data.data;

      if(berkas.berkas_surat_kematian == null)
      {
        $scope.surat_kematian = "Belum upload";
      }
      else
      {
        $scope.surat_kematian = berkas.berkas_surat_kematian;
        $scope.surat_kematian_link = link + "/" + berkas.berkas_surat_kematian;
      }

      //

      if(berkas.berkas_akta_kelahiran_jenazah == null)
      {
        $scope.akta_kelahiran = "Belum upload"
      }
      else
      {
        $scope.akta_kelahiran = berkas.berkas_akta_kelahiran_jenazah;
        $scope.akta_kelahiran_link = link + "/" + berkas.berkas_akta_kelahiran_jenazah;
      }

      //

      if(berkas.berkas_akta_perkawinan_jenazah == null || berkas.berkas_akta_perkawinan_jenazah == '')
      {
        $scope.akta_perkawinan = "Belum upload"
        $scope.akta_perkawinan_link = "#!/berkas";
      }
      else
      {
        $scope.akta_perkawinan = berkas.berkas_akta_perkawinan_jenazah;
        $scope.akta_perkawinan_link = link + "/" + berkas.berkas_akta_perkawinan_jenazah;
      }

      //

      if(berkas.berkas_akta_kematian_pasangan == null)
      {
        $scope.akte_kematian_pasangan = "Belum upload"
      }
      else
      {
        $scope.akte_kematian_pasangan = berkas.berkas_akta_kematian_pasangan;
        $scope.akte_kematian_pasangan_link = link + "/" + berkas.berkas_akta_kematian_pasangan;
      }

      //

      if(berkas.berkas_ktp_pelapor == null)
      {
        $scope.ktp_pelapor = "Belum upload"
      }
      else
      {
        $scope.ktp_pelapor = berkas.berkas_ktp_pelapor;
        $scope.ktp_pelapor_link = link + "/" + berkas.berkas_ktp_pelapor;
      }

      //

      if(berkas.berkas_ktp_saksi1 == null)
      {
        $scope.ktp_saksi1 = "Belum upload"
      }
      else
      {
        $scope.ktp_saksi1 = berkas.berkas_ktp_saksi1;
        $scope.ktp_saksi1_link = link + "/" + berkas.berkas_ktp_saksi1;
      }

      //

      if(berkas.berkas_ktp_saksi2 == null)
      {
        $scope.ktp_saksi2 = "Belum upload"
      }
      else
      {
        $scope.ktp_saksi2 = berkas.berkas_ktp_saksi2;
        $scope.ktp_saksi2_link = link + "/" + berkas.berkas_ktp_saksi2;
      }
    })
    $('.modal').modalPopup('show', {
      titleBackground : "#444",
      titleFontColor : "white"
    })
  }

  $(document).on('keyup', function(e){
    if (e.keyCode == 27)
    {
      var modal = $('.modal').css('display');
      if (modal == 'block')
      {
        $('.modal-window').css('animation', 'modal-out 750ms forwards');
        $('body').css('overflow', 'auto');
        $('#modal').fadeOut();
        setTimeout(function(){
          $('.modal-window').css('animation', 'modal-in 750ms forwards');
        }, 500);
      }
    }
  })

  $('.collapse .head').click(function(){
    $(this).children('span.collapse-icon').children('i.fa').toggleClass('icon-up');
    $(this).siblings('div.collapse-body').slideToggle();
    $(this).siblings('div.containers').slideToggle();
  });

  $(document).on('click','.collapse #saksi',function(){
    $(this).children('span.collapse-icon').children('i.fa').toggleClass('icon-up');
    $(this).siblings('div.collapse-body').slideToggle();
    $(this).siblings('div.containers').slideToggle();
  });

  $scope.get();
});

dash.controller('verifikasi', function($scope, $http, $cookies){
  $scope.sort = "asc";
  $scope.order = "nik"
  $scope.batas = "5"
  $scope.currentpage = 1;

  $('#tgl').flatpickr({
    locale : "id"
  });

  $('#batas').change(function(){
    $scope.batas = $(this).val();
    $scope.get();
  });

  $('#sort').change(function(){
    $scope.sort = $(this).val();
    $scope.get();
  });

  $('#order').change(function(){
    $scope.order = $(this).val();
    $scope.get();
  })

  $scope.tgl = moment().startOf('month').format('YYYY-MM-DD');
  $scope.tgl2 = moment().endOf('month').format('YYYY-MM-DD');
  $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.batas));

  $scope.prev = function()
  {
    if ($scope.currentpage <= 0)
    {
      $scope.currentpage = 1;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.batas));
      $scope.get();
    }
    else
    {
      $scope.currentpage--;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.batas));
      $scope.get();
    }
    console.log($scope.currentpage);
  }

  $('#cari').keyup(function(){
    $scope.currentpage = 1;
    $scope.get();
  })

  $scope.next = function()
  {
    if ($scope.currentpage > $scope.jlhHalaman)
    {
      $scope.currentpage = $scope.jlhHalaman;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.batas));
      $scope.get();
    }
    else
    {
      $scope.currentpage++;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.batas));
      $scope.get();
    }
  }

  $('#tgl').change(function(){
    $('#tgl2').flatpickr({
      locale : "id",
      minDate : $('#tgl').val()
    })
    $scope.tgl2 = moment().endOf('month').format('YYYY-MM-DD');
  })

  $('#tgl2').change(function(){
    $scope.tgl = $('#tgl').val();
    $scope.tgl2 = $('#tgl2').val();
    $scope.get();
  })
  $('a.ng-binding').click(function(){
    var url = $(this).attr('href');
    if (url == "")
    {
      return false;
    }
    else
    {
      window.open(url, "_blank");
      return false;
    }
  })
  $scope.get = function()
  {
    moment.locale('id');
    $http({
      url : backendUrl + "/ambil_pendaftaran/" + $scope.batas + "/" + $scope.offset,
      method : "GET",
      params : {
        order_by : $scope.order,
        sort_type : $scope.sort,
        date_start : $scope.tgl,
        date_end : $scope.tgl2,
        nik : $scope.cari,
        approved : 1
      }
    }).then(function(resp){
      var status = resp.data.status;
      if (status == "PHPERROR")
      {
        var data = resp.data.errors;
        $('body').pesanError(status, data);
      }
      else if (status == "PHPDBERROR")
      {
        var array = resp.data.errors;
        $('body').pesanError(status, array);
        console.log('error');
      }
      else
      {
        var hasil = resp.data.data.list;
      }
      $scope.jlhHalaman = Math.ceil(resp.data.data.total/parseInt($scope.batas));
      angular.forEach(hasil, function(val, key){
        val.tanggal_pendaftaran = moment(val.tanggal_pendaftaran).format('DD MMMM YYYY');
        val.tanggal_kematian = moment(val.tanggal_kematian).format('DD MMMM YYYY');
      })
      $scope.list = hasil;
    })
  }

  $scope.detail = function(no)
  {
    $http.get(backendUrl + "/ambil_detail_pendaftaran/" + no).then(function(resp){
      var hasil = resp.data.data;
      $scope.nomor_kk = hasil.no_kk;
      $scope.nama_kepala_keluarga = hasil.nama_kepala_keluarga;
      $scope.nama_ibu = hasil.nama_ibu;
      $scope.nik_ibu = hasil.nik_ibu;
      $scope.nik_ayah = hasil.nik_ayah;
      $scope.nama_ayah = hasil.nama_ayah;
      $scope.pelapor = hasil.pelapor;
      $scope.saksi = hasil.saksi;
      $scope.nama = hasil.nama;
      $scope.nik = hasil.nik;
      $scope.tanggal_kematian = hasil.tanggal_kematian;
      $scope.waktu_meninggal = hasil.waktu_meninggal;
      $scope.sebab_kematian = hasil.sebab_kematian;
      $scope.yang_menerangkan = hasil.yang_menerangkan;

      var berkas = resp.data.data;

      if(berkas.berkas_surat_kematian == null)
      {
        $scope.surat_kematian = "Belum upload";
      }
      else
      {
        $scope.surat_kematian = berkas.berkas_surat_kematian;
        $scope.surat_kematian_link = link + "/" + berkas.berkas_surat_kematian;
      }

      //

      if(berkas.berkas_akta_kelahiran_jenazah == null)
      {
        $scope.akta_kelahiran = "Belum upload"
      }
      else
      {
        $scope.akta_kelahiran = berkas.berkas_akta_kelahiran_jenazah;
        $scope.akta_kelahiran_link = link + "/" + berkas.berkas_akta_kelahiran_jenazah;
      }

      //

      if(berkas.berkas_akta_perkawinan_jenazah == null || berkas.berkas_akta_perkawinan_jenazah == '')
      {
        $scope.akta_perkawinan = "Belum upload"
        $scope.akta_perkawinan_link = "#!/berkas";
      }
      else
      {
        $scope.akta_perkawinan = berkas.berkas_akta_perkawinan_jenazah;
        $scope.akta_perkawinan_link = link + "/" + berkas.berkas_akta_perkawinan_jenazah;
      }

      //

      if(berkas.berkas_akta_kematian_pasangan == null)
      {
        $scope.akte_kematian_pasangan = "Belum upload"
      }
      else
      {
        $scope.akte_kematian_pasangan = berkas.berkas_akta_kematian_pasangan;
        $scope.akte_kematian_pasangan_link = link + "/" + berkas.berkas_akta_kematian_pasangan;
      }

      //

      if(berkas.berkas_ktp_pelapor == null)
      {
        $scope.ktp_pelapor = "Belum upload"
      }
      else
      {
        $scope.ktp_pelapor = berkas.berkas_ktp_pelapor;
        $scope.ktp_pelapor_link = link + "/" + berkas.berkas_ktp_pelapor;
      }

      //

      if(berkas.berkas_ktp_saksi1 == null)
      {
        $scope.ktp_saksi1 = "Belum upload"
      }
      else
      {
        $scope.ktp_saksi1 = berkas.berkas_ktp_saksi1;
        $scope.ktp_saksi1_link = link + "/" + berkas.berkas_ktp_saksi1;
      }

      //

      if(berkas.berkas_ktp_saksi2 == null)
      {
        $scope.ktp_saksi2 = "Belum upload"
      }
      else
      {
        $scope.ktp_saksi2 = berkas.berkas_ktp_saksi2;
        $scope.ktp_saksi2_link = link + "/" + berkas.berkas_ktp_saksi2;
      }
    })
    $('.modal').modalPopup('show', {
      titleBackground : "#444",
      titleFontColor : "white"
    })
  }

  $(document).on('keyup', function(e){
    if (e.keyCode == 27)
    {
      var modal = $('.modal').css('display');
      if (modal == 'block')
      {
        $('.modal-window').css('animation', 'modal-out 750ms forwards');
        $('body').css('overflow', 'auto');
        $('#modal').fadeOut();
        setTimeout(function(){
          $('.modal-window').css('animation', 'modal-in 750ms forwards');
        }, 500);
      }
    }
  })

  $('.collapse .head').click(function(){
    $(this).children('span.collapse-icon').children('i.fa').toggleClass('icon-up');
    $(this).siblings('div.collapse-body').slideToggle();
    $(this).siblings('div.containers').slideToggle();
  });

  $(document).on('click','.collapse #saksi',function(){
    $(this).children('span.collapse-icon').children('i.fa').toggleClass('icon-up');
    $(this).siblings('div.collapse-body').slideToggle();
    $(this).siblings('div.containers').slideToggle();
  });

  $scope.get();
});

dash.controller('list', function($scope, $http, $cookies){
  $scope.sort = "asc";
  $scope.order = "nik"
  $scope.batas = "5"
  $scope.currentpage = 1;

  $('#tgl').flatpickr({
    locale : "id"
  });

  $('#batas').change(function(){
    $scope.batas = $(this).val();
    $scope.get();
  });

  $('#sort').change(function(){
    $scope.sort = $(this).val();
    $scope.get();
  });

  $('#order').change(function(){
    $scope.order = $(this).val();
    $scope.get();
  })

  $scope.tgl = moment().startOf('month').format('YYYY-MM-DD');
  $scope.tgl2 = moment().endOf('month').format('YYYY-MM-DD');
  $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.batas));

  $scope.verifikasi = function(id_laporan)
  {
    $http.post(backendUrl + "/approve_pendaftaran/", { id_jenazah : id_laporan}).then(function(resp){
      $scope.get();
    })
  }

  $scope.prev = function()
  {
    if ($scope.currentpage <= 0)
    {
      $scope.currentpage = 1;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.batas));
      $scope.get();
    }
    else
    {
      $scope.currentpage--;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.batas));
      $scope.get();
    }
    console.log($scope.currentpage);
  }

  $('#cari').keyup(function(){
    $scope.currentpage = 1;
    $scope.get();
  })

  $scope.next = function()
  {
    if ($scope.currentpage > $scope.jlhHalaman)
    {
      $scope.currentpage = $scope.jlhHalaman;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.batas));
      $scope.get();
    }
    else
    {
      $scope.currentpage++;
      $scope.offset = ($scope.currentpage - 1) * (parseInt($scope.batas));
      $scope.get();
    }
  }

  $('#tgl').change(function(){
    $('#tgl2').flatpickr({
      locale : "id",
      minDate : $('#tgl').val()
    })
    $scope.tgl2 = moment().endOf('month').format('YYYY-MM-DD');
  })

  $('#tgl2').change(function(){
    $scope.tgl = $('#tgl').val();
    $scope.tgl2 = $('#tgl2').val();
    $scope.get();
  })
  $('a.ng-binding').click(function(){
    var url = $(this).attr('href');
    if (url == "")
    {
      return false;
    }
    else
    {
      window.open(url, "_blank");
      return false;
    }
  })
  $scope.get = function()
  {
    moment.locale('id');
    $http({
      url : backendUrl + "/ambil_pendaftaran/" + $scope.batas + "/" + $scope.offset,
      method : "GET",
      params : {
        order_by : $scope.order,
        sort_type : $scope.sort,
        date_start : $scope.tgl,
        date_end : $scope.tgl2,
        nik : $scope.cari
      }
    }).then(function(resp){
      var status = resp.data.status;
      if (status == "PHPERROR")
      {
        var data = resp.data.errors;
        $('body').pesanError(status, data);
      }
      else if (status == "PHPDBERROR")
      {
        var array = resp.data.errors;
        $('body').pesanError(status, array);
        console.log('error');
      }
      else
      {
        var hasil = resp.data.data.list;
      }
      $scope.jlhHalaman = Math.ceil(resp.data.data.total/parseInt($scope.batas));
      angular.forEach(hasil, function(val, key){
        val.tanggal_pendaftaran = moment(val.tanggal_pendaftaran).format('DD MMMM YYYY');
        val.tanggal_kematian = moment(val.tanggal_kematian).format('DD MMMM YYYY');
      })
      $scope.list = hasil;
    })
  }

  $scope.detail = function(no)
  {
    $http.get(backendUrl + "/ambil_detail_pendaftaran/" + no).then(function(resp){
      var hasil = resp.data.data;
      $scope.nomor_kk = hasil.no_kk;
      $scope.nama_kepala_keluarga = hasil.nama_kepala_keluarga;
      $scope.nama_ibu = hasil.nama_ibu;
      $scope.nik_ibu = hasil.nik_ibu;
      $scope.nik_ayah = hasil.nik_ayah;
      $scope.nama_ayah = hasil.nama_ayah;
      $scope.pelapor = hasil.pelapor;
      $scope.saksi = hasil.saksi;
      $scope.nama = hasil.nama;
      $scope.nik = hasil.nik;
      $scope.tanggal_kematian = hasil.tanggal_kematian;
      $scope.waktu_meninggal = hasil.waktu_meninggal;
      $scope.sebab_kematian = hasil.sebab_kematian;
      $scope.yang_menerangkan = hasil.yang_menerangkan;

      var berkas = resp.data.data;

      if(berkas.berkas_surat_kematian == null)
      {
        $scope.surat_kematian = "Belum upload";
      }
      else
      {
        $scope.surat_kematian = berkas.berkas_surat_kematian;
        $scope.surat_kematian_link = link + "/" + berkas.berkas_surat_kematian;
      }

      //

      if(berkas.berkas_akta_kelahiran_jenazah == null)
      {
        $scope.akta_kelahiran = "Belum upload"
      }
      else
      {
        $scope.akta_kelahiran = berkas.berkas_akta_kelahiran_jenazah;
        $scope.akta_kelahiran_link = link + "/" + berkas.berkas_akta_kelahiran_jenazah;
      }

      //

      if(berkas.berkas_akta_perkawinan_jenazah == null || berkas.berkas_akta_perkawinan_jenazah == '')
      {
        $scope.akta_perkawinan = "Belum upload"
        $scope.akta_perkawinan_link = "#!/berkas";
      }
      else
      {
        $scope.akta_perkawinan = berkas.berkas_akta_perkawinan_jenazah;
        $scope.akta_perkawinan_link = link + "/" + berkas.berkas_akta_perkawinan_jenazah;
      }

      //

      if(berkas.berkas_akta_kematian_pasangan == null)
      {
        $scope.akte_kematian_pasangan = "Belum upload"
      }
      else
      {
        $scope.akte_kematian_pasangan = berkas.berkas_akta_kematian_pasangan;
        $scope.akte_kematian_pasangan_link = link + "/" + berkas.berkas_akta_kematian_pasangan;
      }

      //

      if(berkas.berkas_ktp_pelapor == null)
      {
        $scope.ktp_pelapor = "Belum upload"
      }
      else
      {
        $scope.ktp_pelapor = berkas.berkas_ktp_pelapor;
        $scope.ktp_pelapor_link = link + "/" + berkas.berkas_ktp_pelapor;
      }

      //

      if(berkas.berkas_ktp_saksi1 == null)
      {
        $scope.ktp_saksi1 = "Belum upload"
      }
      else
      {
        $scope.ktp_saksi1 = berkas.berkas_ktp_saksi1;
        $scope.ktp_saksi1_link = link + "/" + berkas.berkas_ktp_saksi1;
      }

      //

      if(berkas.berkas_ktp_saksi2 == null)
      {
        $scope.ktp_saksi2 = "Belum upload"
      }
      else
      {
        $scope.ktp_saksi2 = berkas.berkas_ktp_saksi2;
        $scope.ktp_saksi2_link = link + "/" + berkas.berkas_ktp_saksi2;
      }
    })
    $('.modal').modalPopup('show', {
      titleBackground : "#444",
      titleFontColor : "white"
    })
  }

  $(document).on('keyup', function(e){
    if (e.keyCode == 27)
    {
      var modal = $('.modal').css('display');
      if (modal == 'block')
      {
        $('.modal-window').css('animation', 'modal-out 750ms forwards');
        $('body').css('overflow', 'auto');
        $('#modal').fadeOut();
        setTimeout(function(){
          $('.modal-window').css('animation', 'modal-in 750ms forwards');
        }, 500);
      }
    }
  })

  $('.collapse .head').click(function(){
    $(this).children('span.collapse-icon').children('i.fa').toggleClass('icon-up');
    $(this).siblings('div.collapse-body').slideToggle();
    $(this).siblings('div.containers').slideToggle();
  });

  $(document).on('click','.collapse #saksi',function(){
    $(this).children('span.collapse-icon').children('i.fa').toggleClass('icon-up');
    $(this).siblings('div.collapse-body').slideToggle();
    $(this).siblings('div.containers').slideToggle();
  });

  $scope.get();
});

dash.controller('user', function($scope, $http){
  // var user = $cookies.get('username');
  $http.get(backendUrl + "/cek/").then(function(resp){
    var status = resp.data.status;
    if (status)
    {
      $scope.username = resp.data.data.username;
    }
    else
    {
      window.location.replace('index.html#!/login');
    }
  });

  $scope.logout = function()
  {
    $http.get(backendUrl + "/logout").then(function(resp){
      window.location.replace('index.html#!/login');
    })
  }
});

dash.controller('sidebar', function($scope){
    $('.submenu li a').click(function(){
      $('.submenu li a').removeClass('submenu-active');
      $('.sidebar-menu li:first-child a').removeClass('active');
      $(this).addClass('submenu-active');
    });

    $('.sidebar-menu li:first-child a').not('.submenu li:first-child a').click(function(){
      $('.submenu li a').removeClass('submenu-active');
      $('.sidebar-menu li:first-child a').not('.submenu li:first-child a').addClass('active');
    });

    $('.sidebar-menu').children('li').children('a').click(function(){
      $(this).parent().children('.submenu').slideToggle();
      $(this).children('span').children('i').toggleClass('fa-angle-right');
      $(this).children('span').children('i').toggleClass('fa-angle-down');
    });
})

app.controller('upload', function($scope, $http, $cookies){
  $scope.cek = function(nomor)
  {
    $http.get(backendUrl + "/ambil_berkas/" + nomor).then(function(resp){
      var status = resp.data.status;
      if (status)
      {
        $cookies.put('nomor_pendaftaran', nomor);
        window.location.replace('#!/upload/berkas');
      }
      else
      {
        $('.notifikasi').css('animation', '750ms notif-in forwards');
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty()
        $('.notifikasi-body').text('Nomor pendaftaran tidak valid');
        setTimeout(function(){
          $('.notifikasi').css('animation', '750ms notif-out forwards');
        }, 3000)
      }
    })
  }


})

app.controller('berkas', function($scope, $http, $cookies, Upload){
  var nomor = $cookies.get('nomor_pendaftaran');
  if (!nomor)
  {
    window.location.replace('#!/upload');
  }

  $scope.upload = function(file, nama_field)
  {
    Upload.upload({
      url : backendUrl + "/upload_berkas",
      data : { no_antrian : nomor, file : file, nama_field_berkas : nama_field}
    }).then(function(resp){
      console.log(resp);
      $scope.cek(nomor);
    })
  }

  $('a.ng-binding').click(function(){
    var url = $(this).attr('href');
    if (url == "")
    {
      return false;
    }
    else
    {
      window.open(url, "_blank");
      return false;
    }
  })

  $scope.cek = function(nomor)
  {
    $http.get(backendUrl + "/ambil_berkas/" + nomor).then(function(resp){
      var status = resp.data.status;
      if (!status)
      {
        window.location.replace('#!/upload');
      }

      var berkas = resp.data.data;

      if(berkas.berkas_surat_kematian == null)
      {
        $scope.surat_kematian = "Belum upload";
      }
      else
      {
        $scope.surat_kematian = berkas.berkas_surat_kematian;
        $scope.surat_kematian_link = link + "/" + berkas.berkas_surat_kematian;
      }

      //

      if(berkas.berkas_akta_kelahiran_jenazah == null)
      {
        $scope.akta_kelahiran = "Belum upload"
      }
      else
      {
        $scope.akta_kelahiran = berkas.berkas_akta_kelahiran_jenazah;
        $scope.akta_kelahiran_link = link + "/" + berkas.berkas_akta_kelahiran_jenazah;
      }

      //

      if(berkas.berkas_akta_perkawinan_jenazah == null || berkas.berkas_akta_perkawinan_jenazah == '')
      {
        $scope.akta_perkawinan = "Belum upload"
        $scope.akta_perkawinan_link = "#!/berkas";
      }
      else
      {
        $scope.akta_perkawinan = berkas.berkas_akta_perkawinan_jenazah;
        $scope.akta_perkawinan_link = link + "/" + berkas.berkas_akta_perkawinan_jenazah;
      }

      //

      if(berkas.berkas_akta_kematian_pasangan == null)
      {
        $scope.akte_kematian_pasangan = "Belum upload"
      }
      else
      {
        $scope.akte_kematian_pasangan = berkas.berkas_akta_kematian_pasangan;
        $scope.akte_kematian_pasangan_link = link + "/" + berkas.berkas_akta_kematian_pasangan;
      }

      //

      if(berkas.berkas_ktp_pelapor == null)
      {
        $scope.ktp_pelapor = "Belum upload"
      }
      else
      {
        $scope.ktp_pelapor = berkas.berkas_ktp_pelapor;
        $scope.ktp_pelapor_link = link + "/" + berkas.berkas_ktp_pelapor;
      }

      //

      if(berkas.berkas_ktp_saksi1 == null)
      {
        $scope.ktp_saksi1 = "Belum upload"
      }
      else
      {
        $scope.ktp_saksi1 = berkas.berkas_ktp_saksi1;
        $scope.ktp_saksi1_link = link + "/" + berkas.berkas_ktp_saksi1;
      }

      //

      if(berkas.berkas_ktp_saksi2 == null)
      {
        $scope.ktp_saksi2 = "Belum upload"
      }
      else
      {
        $scope.ktp_saksi2 = berkas.berkas_ktp_saksi2;
        $scope.ktp_saksi2_link = link + "/" + berkas.berkas_ktp_saksi2;
      }
    });
  }

  $scope.cek(nomor);
})

app.controller('login', function($scope, $http, $cookies){
  $scope.login = function()
  {
    var data = {
      username : $scope.username,
      password : $scope.password
    }
    $http.post(backendUrl + "/login", data).then(function(resp){
      // console.log(resp.data);
      var status = resp.data.status;
      if (!status)
      {
        var msg = resp.data.message;
        $('.notifikasi').css('animation', 'notif-in 750ms forwards');
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text(msg);
        setTimeout(function(){
          $('.notifikasi').css('animation', 'notif-out 750ms forwards');
        },3000);
      }
      else
      {
        $cookies.put('username', $scope.username);
        window.location.replace('dashboard.html');
      }
    })
  }

  $http.get(backendUrl + "/cek").then(function(resp){
    if (resp.data.status)
    {
      window.location.replace('dashboard.html');
    }
  });

  $('form').submit(function(e){
    e.preventDefault();
  });
})

app.controller('no_kk', function($scope, $http, data, $cookies){
  $scope.cek = function(no_kk)
  {
    $http.get(backendUrl + "/ambil_keluarga/" + no_kk).then(function(resp){
      var hasil = resp.data.data;
      var status = resp.data.status;
      // console.log(hasil);
      if (!hasil.kepala_keluarga)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Nomor KK Tidak Valid');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 3000)
      }
      else
      {
        hasil = hasil.kepala_keluarga;
        $scope.nama_kepala_keluarga = hasil.NAMA_LGKP;
      }
    });
  }

  $('#nik').on('change', function(){
    $scope.cek($(this).val());
  })

  $scope.submit = function()
  {
    if ($scope.nama_kepala_keluarga == '' || $scope.nama_kepala_keluarga == null)
    {
      $('.notifikasi').css('display', 'flex');
      $('.notifikasi-body').empty();
      $('.notifikasi-body').text('Nomor KK Tidak Valid');
      setTimeout(function(){
        $('.notifikasi').hide();
      }, 3000);
    }
    else
    {
      var data = {
        no_kk : $scope.no_kk,
        nama_kepala_keluarga : $scope.nama_kepala_keluarga
      }
      $cookies.putObject('no_kk', data);
      window.location.replace('#!/daftar/jenazah')
    }
  }
});

app.controller('jenazah', function($scope, $http, data, $cookies){
  $scope.cek = function(nik)
  {
    no_kk = $cookies.getObject('no_kk');
    $http.get(backendUrl + "/ambil_penduduk/" + nik).then(function(resp){
      var hasil = resp.data.data;
      // console.log(hasil);
      if (!hasil)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('NIK Tidak Valid');
        setTimeout(function(){
          $('.notifikasi').hide();
       }, 3000);
      }
      else if (hasil.NO_KK != no_kk.no_kk)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Pemilik NIK tidak ada dalam Nomor KK yang disertakan');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else
      {
        $scope.nama_lengkap = hasil.NAMA_LGKP;
      }
    });
  }


  $scope.sebab_kematian = "Sakit Biasa/Tua";
  $scope.yang_menerangkan = 'Dokter';

  $scope.submit = function()
  {
    if ($scope.nama_lengkap == '' || $scope.nama_lengkap == null)
    {
      $('.notifikasi').css('display', 'flex');
      $('.notifikasi-body').empty();
      $('.notifikasi-body').text('NIK Tidak Valid');
      setTimeout(function(){
        $('.notifikasi').hide();
      }, 3000);
    }
    else if ($scope.tanggal == '' || $scope.tanggal == null)
    {
      $('.notifikasi').css('display', 'flex');
      $('.notifikasi-body').empty();
      $('.notifikasi-body').text('Masukkan tanggal kematian');
      setTimeout(function(){
        $('.notifikasi').hide();
      }, 3000);
    }
    else if ($scope.waktu == '' || $scope.waktu == null)
    {
      $('.notifikasi').css('display', 'flex');
      $('.notifikasi-body').empty();
      $('.notifikasi-body').text('Masukkan waktu kematian');
      setTimeout(function(){
        $('.notifikasi').hide();
      }, 3000);
    }
    else
    {
      var data = {
        nik : $scope.nik,
        nama : $scope.nama_lengkap,
        tanggal_kematian : $scope.tanggal,
        waktu_meninggal : $scope.waktu,
        sebab_kematian : $scope.sebab_kematian,
        yang_menerangkan : $scope.yang_menerangkan
      }
      $cookies.putObject('jenazah', data);
      window.location.replace('#!/daftar/ayah')
    }
  }

  $('#tanggal').DateTimePicker(data.datepickerSetting());
});

app.controller('ayah', function($scope, $http, data, $cookies){
  $scope.cek = function(nik)
  {
    $http.get(backendUrl + "/ambil_penduduk/" + nik).then(function(resp){
      var hasil = resp.data.data;
      var no_kk = $cookies.getObject('no_kk');
      if (!hasil)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('NIK Tidak Valid');
        setTimeout(function(){
          $('.notifikasi').hide();
       }, 3000);
      }
      else if (hasil.NO_KK != no_kk.no_kk)
      {
        console.log(hasil.NO_KK + " " + no_kk.no_kk);
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Pemilik NIK tidak ada dalam Nomor KK yang disertakan');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else if (hasil.JENIS_KLMIN != "1")
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Pemilik NIK harus berjenis kelamin laki-laki');
        setTimeout(function(){
          $('.notifikasi').hide();
       }, 3000);
      }
      else
      {
        $scope.nama_lengkap = hasil.NAMA_LGKP;
      }
    });
  }

  $scope.submit = function()
  {
    var data = {
      nik_ayah : $scope.nik,
      nama_ayah : $scope.nama_lengkap
    }

    if ($scope.nama_lengkap == '' || $scope.nama_lengkap == null)
    {
      $('.notifikasi').css('display', 'flex');
      $('.notifikasi-body').empty();
      $('.notifikasi-body').text('NIK tidak valid');
      setTimeout(function(){
        $('.notifikasi').hide();
      }, 5000);
    }
    else if ($scope.nik != '' && $scope.nama_lengkap == '' || $scope.nama_lengkap == null)
    {
      $('.notifikasi').css('display', 'flex');
      $('.notifikasi-body').empty();
      $('.notifikasi-body').text('NIK tidak valid');
      setTimeout(function(){
        $('.notifikasi').hide();
      }, 5000);
    }
    else
    {
      $cookies.putObject('ayah', data);
      window.location.replace('#!/daftar/ibu');
    }
  }

  $('#tanggal').DateTimePicker(data.datepickerSetting());
});

app.controller('ibu', function($scope, $http, data, $cookies){
  $scope.cek = function(nik)
  {
    $http.get(backendUrl + "/ambil_penduduk/" + nik).then(function(resp){
      var hasil = resp.data.data;
      var no_kk = $cookies.getObject('no_kk');
      if (!hasil)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('NIK Tidak Valid');
        setTimeout(function(){
          $('.notifikasi').hide();
       }, 3000);
      }
      else if (hasil.NO_KK != no_kk.no_kk)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Pemilik NIK tidak ada dalam Nomor KK yang disertakan');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else if (hasil.JENIS_KLMIN != "2")
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Pemilik NIK harus berjenis kelamin perempuan');
        setTimeout(function(){
          $('.notifikasi').hide();
       }, 3000);
      }
      else
      {
        $scope.nama_lengkap = hasil.NAMA_LGKP;
      }
    });
  }

  $scope.submit = function()
  {
    var data = {
      nik_ibu : $scope.nik,
      nama_ibu : $scope.nama_lengkap
    }

    if ($scope.nama_lengkap == '' || $scope.nama_lengkap == null)
    {
      $('.notifikasi').css('display', 'flex');
      $('.notifikasi-body').empty();
      $('.notifikasi-body').text('NIK tidak valid');
      setTimeout(function(){
        $('.notifikasi').hide();
      }, 5000);
    }
    else if ($scope.nik != '' && $scope.nama_lengkap == '' || $scope.nama_lengkap == null)
    {
      $('.notifikasi').css('display', 'flex');
      $('.notifikasi-body').empty();
      $('.notifikasi-body').text('NIK tidak valid');
      setTimeout(function(){
        $('.notifikasi').hide();
      }, 5000);
    }
    else
    {
      $cookies.putObject('ibu', data);
      window.location.replace('#!/daftar/pelapor');
    }
  }

  $('#tanggal').DateTimePicker(data.datepickerSetting());
});

// Pelapor
$(document).on('submit', 'form',function(e){
  e.preventDefault();
})

app.controller('pelapor', function($scope, $http, data,$cookies){
  $scope.cek = function(nik)
  {
    $http.get(backendUrl + "/ambil_penduduk/" + nik).then(function(resp){
      var hasil = resp.data.data;
      if (!hasil)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('NIK Tidak Valid');
        setTimeout(function(){
          $('.notifikasi').hide();
       }, 3000);
      }
      else
      {
        $scope.nama_lengkap = hasil.NAMA_LGKP;
      }
    });
  }

  $scope.nik_luar = null;
  $scope.nama = '';
  $scope.tanggal = '';
  $scope.pekerjaan = '';
  $scope.alamat = '';
  $scope.jenis_kelamin = 'Laki-laki'


  $scope.submit = function()
  {
    var tab = $('#manado').css('display');
    var data = {
      plr_nik : $scope.nik,
      plr_nama : $scope.nama_lengkap,
      plr_org_manado : 1
    }

    if (tab == 'block')
    {
      if ($scope.nama_lengkap == '' || $scope.nama_lengkap == null)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('NIK tidak valid');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else
      {
        $cookies.putObject('plr', data);
        window.location.replace('#!/daftar/saksi1');
      }
    }
    else
    {
      if ($scope.nik_luar == null)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Masukkan NIK');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else if ($scope.nama == '')
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Masukkan nama lengkap');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else if ($scope.tanggal == '')
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Masukkan tanggal lahir');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else if ($scope.pekerjaan == '')
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Masukkan pekerjaan');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else if ($scope.alamat == '')
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Masukkan alamat');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else
      {
        var data = {
          plr_nik : $scope.nik_luar,
          plr_nama : $scope.nama,
          plr_tanggal_lahir : $scope.tanggal,
          plr_jenis_kelamin : $scope.jenis_kelamin,
          plr_pekerjaan : $scope.pekerjaan,
          plr_alamat : $scope.jenis_kelamin,
          plr_org_manado : 0
        }
        $cookies.putObject('plr', data);
        window.location.replace('#!/daftar/saksi1');
      }
      //
    }
    //
  }

  $scope.jenis_kelamin = "Laki-laki"


  $('#tanggal').DateTimePicker(data.datepickerSetting());

  $('#dlmManado').on('click',function(){
    $('#manado').show();
    $('#luar_manado').hide();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });

  $('#luarManado').on('click',function(){
    $('#manado').hide();
    $('#luar_manado').show();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });
});

// Saksi 1

app.controller('saksi1', function($scope, $http, data, $cookies){
  $('#dlmManado').on('click',function(){
    $('#manado').show();
    $('#luar_manado').hide();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });

  $('#luarManado').on('click',function(){
    $('#manado').hide();
    $('#luar_manado').show();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });
  $scope.jenis_kelamin = "Laki-laki"
  $scope.cek = function(nik)
  {
    $http.get(backendUrl + "/ambil_penduduk/" + nik).then(function(resp){
      var hasil = resp.data.data;
      if (!hasil)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('NIK tidak valid');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else
      {
        $scope.nama_lengkap = hasil.NAMA_LGKP;
      }
    });
  }

  $scope.submit = function()
  {
    var tab = $('#manado').css('display');
    var data = {
      sk_nik1 : $scope.nik,
      sk_nama1 : $scope.nama_lengkap,
      sk_org_manado1 : 1
    }

    if (tab == 'block')
    {
      if ($scope.nama_lengkap == '' || $scope.nama_lengkap == null)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('NIK tidak valid');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else
      {
        $cookies.putObject('sk1', data);
        window.location.replace('#!/daftar/saksi2');
      }
    }
    else
    {
      if ($scope.nik_luar == null || $scope.nik_luar == '')
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Masukkan NIK');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else if ($scope.nama == '' || $scope.nama == null)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Masukkan nama lengkap');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else if ($scope.tanggal == '' || $scope.tanggal == null)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Masukkan tanggal lahir');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else if ($scope.pekerjaan == '' || $scope.pekerjaan == null)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Masukkan pekerjaan');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else if ($scope.alamat == '' || $scope.alamat == null)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Masukkan alamat');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else
      {
        var data = {
          sk_nik1 : $scope.nik_luar,
          sk_nama1 : $scope.nama,
          sk_tanggal_lahir1 : $scope.tanggal,
          sk_jenis_kelamin1 : $scope.jenis_kelamin,
          sk_pekerjaan1 : $scope.pekerjaan,
          sk_alamat1 : $scope.jenis_kelamin,
          sk_org_manado1 : 0
        }
        $cookies.putObject('sk1', data);
        window.location.replace('#!/daftar/saksi2');
      }
      //
    }
  }

  $('#tanggal').DateTimePicker(data.datepickerSetting());
  $('#dlmManado').on('click',function(){
    $('#manado').show();
    $('#luar_manado').hide();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });

  $('#luarManado').on('click',function(){
    $('#manado').hide();
    $('#luar_manado').show();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });
});

// Saksi 2

app.controller('saksi2', function($scope, $http, data, $cookies){
  $('#dlmManado').on('click',function(){
    $('#manado').show();
    $('#luar_manado').hide();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });

  $('#luarManado').on('click',function(){
    $('#manado').hide();
    $('#luar_manado').show();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });
  $scope.jenis_kelamin = "Laki-laki"
  $scope.cek = function(nik)
  {
    $http.get(backendUrl + "/ambil_penduduk/" + nik).then(function(resp){
      var hasil = resp.data.data;
      if (!hasil)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('NIK tidak valid');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else
      {
        $scope.nama_lengkap = hasil.NAMA_LGKP;
      }
    });
  }

  $scope.submit = function()
  {
    var tab = $('#manado').css('display');
    var data = {
      sk_nik2 : $scope.nik,
      sk_nama2 : $scope.nama_lengkap,
      sk_org_manado2 : 1
    }

    if (tab == 'block')
    {
      if ($scope.nama_lengkap == '' || $scope.nama_lengkap == null)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('NIK tidak valid');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else
      {
        $cookies.putObject('sk2', data);
        window.location.replace('#!/daftar/data_keluarga');
      }
    }
    else
    {
      if ($scope.nik_luar == null || $scope.nik_luar == '')
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Masukkan NIK');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else if ($scope.nama == '' || $scope.nama == null)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Masukkan nama lengkap');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else if ($scope.tanggal == '' || $scope.tanggal == null)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Masukkan tanggal lahir');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else if ($scope.pekerjaan == '' || $scope.pekerjaan == null)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Masukkan pekerjaan');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else if ($scope.alamat == '' || $scope.alamat == null)
      {
        $('.notifikasi').css('display', 'flex');
        $('.notifikasi-body').empty();
        $('.notifikasi-body').text('Masukkan alamat');
        setTimeout(function(){
          $('.notifikasi').hide();
        }, 5000);
      }
      else
      {
        var data = {
          sk_nik2 : $scope.nik_luar,
          sk_nama2 : $scope.nama,
          sk_tanggal_lahir2 : $scope.tanggal,
          sk_jenis_kelamin2 : $scope.jenis_kelamin,
          sk_pekerjaan2 : $scope.pekerjaan,
          sk_alamat2 : $scope.jenis_kelamin,
          sk_org_manado2 : 0
        }
        $cookies.putObject('sk2', data);
        window.location.replace('#!/daftar/data_keluarga');
      }
      //
    }
  }

  $('#tanggal').DateTimePicker(data.datepickerSetting());
  $('#dlmManado').on('click',function(){
    $('#manado').show();
    $('#luar_manado').hide();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });

  $('#luarManado').on('click',function(){
    $('#manado').hide();
    $('#luar_manado').show();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });
});

app.controller('data_keluarga', function($scope, $cookies, $http){

  var no_kk = $cookies.getObject('no_kk');
  var jenazah = $cookies.getObject('jenazah');
  var ayah = $cookies.getObject('ayah');
  var ibu = $cookies.getObject('ibu');
  var plr = $cookies.getObject('plr');
  var sk1 = $cookies.getObject('sk1')
  var sk2 = $cookies.getObject('sk2')
  $scope.submit = function()
  {
    var nomor = $scope.nomor;
    var alamat = $scope.alamat;
    var pernyataan = $scope.pernyataan;

    var persetujuan = {
      p_no_telfon : nomor,
      p_alamat : alamat,
      p_pernyataan : pernyataan
    }

    if (nomor == null)
    {
      $('notifikasi').notifikasi('Masukkan nomor telepon');
    }
    else if (alamat == null || alamat == '')
    {
      $('.notifikasi').notifikasi('Masukkan alamat', 5000);
    }
    else
    {
      var merge = Object.assign(no_kk, jenazah, ayah, ibu, plr, sk1, sk2, persetujuan);
      $http.post(backendUrl + '/simpan_data_awal', merge).then(function(resp){
        var no = resp.data.data;
        var status = resp.data.status;
        if (status)
        {
          $scope.no_pendaftaran = no;
          $('#modal').modalPopup('show', {
            backgroundClick : false,
            keyboardDetect : false
          });
          $scope.nomor = null;
          $scope.alamat = '';
          $scope.pernyataan = '';
        }
      });
    }
  }
});

/*
*
*
*
*/

app.controller('bantuan', function($scope){
  $('#btnBantuan').on('click',function(){
    $('#bantuan').show();
    $('#alur-pembuatan').hide();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });

  $('#btnAlur').on('click',function(){
    $('#bantuan').hide();
    $('#alur-pembuatan').show();
    $('.tab').removeClass('click');
    $(this).addClass('click');
  });

  $('.head').on('click',function(){
    $(this).children('span.collapse-icon').children('i.fa').toggleClass('icon-up');
    $(this).siblings('div.collapse-body').slideToggle();
  });
});

$(document).ready(function(){
  $(document).on('click','.btn-collapse',function(){
    $('.menu li').not('.menu li:first-child').slideToggle();
  });

  if ($(window).width() <= 514)
  {
    $(document).on('click', '.menu li:not(.menu li:first-child)', function(){
      $('.menu li').not('.menu li:first-child').slideToggle();
    })
  }
})

app.controller('home', function($scope, request){
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

  $('#upload_file').click(function(){
    window.location.replace('#!/upload');
  });

  $('#daftar').click(function(){
    window.location.replace('#!/daftar/no_kk');
  });

  $('#berkas').click(function(){
    window.location.replace('#!/kelengkapan');
  });

  $('span.info').click(function(){
    $('.modal').modalPopup('show', {
      titleBackground : "#565656",
      titleFontColor : "white"
    });
  });
});

app.service('request', function($http){
  this.get = function(url)
  {
    $http.get(url).then(function(resp){
      return resp.data;
    });
  }
});

app.service('data', function(){
  this.datepickerSetting = function()
  {
    var setting = {
      shortDayNames : ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
      fullDayNames : ["Minggu", "Senin", "Selasa", "Rabu", "Jumat", "Sabtu"],
      shortMonthNames : ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ag", "Sep", "Okt", "Nov", "Des"],
      fullMonthNames : ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
      titleContentDate : "Pilih tanggal",
      titleContentTime : "Pilih jam",
      setButtonContent : "Pilih",
      clearButtonContent : "Reset",
      dateFormat : "yyyy-MM-dd"
      // isPopup : true
    }
    return setting;
  }
})

app.controller('pelaporan', function($scope, $location){
  $scope.pindahHalaman = function(halaman)
  {
    window.location.replace(baseUrl + '#!/' + halaman);
  }
});
