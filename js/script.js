$(document).ready(function () {
    const api = "http://localhost/Back-End-NiagaShop/public/api/";

    $("#nav-landing-page").on("click", function () {
        $('html, body').animate({
            scrollTop: $("#landing-page").offset().top
        }, 500);
        navActive();
    });

    $("#nav-keunggulan").on("click", function () {
        $('html, body').animate({
            scrollTop: $("#keunggulan").offset().top - 80
        }, 500);
        navActive();
    });

    $("#nav-produk").on("click", function () {
        $('html, body').animate({
            scrollTop: $("#produk").offset().top - 80
        }, 500);
        navActive();
    });

    function navActive(params) {
        $("nav").removeClass("active");
        $(".btn-menu .menu").toggleClass("off");
        $(".btn-menu .close").toggleClass("on");
    }

    function handleScroll() {
        if ($(window).scrollTop() > 0) {
            $("nav").css({
                "background-color": "rgba(35, 49, 66, 1)",
                "transition": "background-color 0.3s ease"
            });
        } else {
            $("nav").css({
                "background-color": "transparent",
                "transition": "background-color 0.3s ease"
            });
        }
    }
    
    $(window).on('scroll', handleScroll);

    $(".btn-menu").click(function () {
        $(".btn-menu .menu").toggleClass("off");
        $(".btn-menu .close").toggleClass("on");
        $("nav").toggleClass("active");
    });

    fetch(`${api}30092002`, {
        // mode: 'no-cors',
        method: "get",
        headers: {
             "Content-Type": "application/json"
        },
    })
    .then(response => response.json())
        .then(data => {
            listProduk(data);
            pagination();
            getDataId();
        })
        .catch(error => {
            console.log(error);
        alert('Terjadi kesalahan saat mengambil data dari server.');
    });

    $("#btn-search").on("click", function () {
       let search = $("#search-input").val();
       search = search.split(" ");
       search = search.join("*-*");
       fetch(`${api}search/30092002/${search}`, {
        // mode: 'no-cors',
        method: "get",
        headers: {
             "Content-Type": "application/json"
        },
        })
        .then(response => response.json())
            .then(data => {
                listProduk(data);
                pagination();
                getDataId();
            })
            .catch(error => {
                console.log(error);
            alert('Terjadi kesalahan saat mengambil data dari server.');
        });
    });

    function listProduk(data) {
        let element = "";
        data.forEach(value => {
            element += 
            `<div class="item-produk">
                <div class="img-produk">
                    <img src="${value["foto"]}" alt="">
                </div>
                <div class="text-produk">
                    <div class="title">
                        <h2 class="nama-produk">${value["nama_produk"]}</h2>
                    </div>
                    <p class="qty">Qty: ${value["qty"]}</p>
                    <div class="price">
                        <h2>${formatRupiah(value["harga"])}</h2>
                        <button data-id="${value['id']}" class="btn-buy">Beli</button>
                    </div>
                </div>
            </div>`
        });

        $("#list-produk").html(element);
    }

    // pagination 
    function pagination() {
        var first_page = 1;
        var itemsPerPage = 9;
        var $itemList = $('#list-produk');
        var $pagination = $('#pagination ul');
    
        var totalItems = $itemList.children(".item-produk").length;
        var totalPages = Math.ceil(totalItems / itemsPerPage);
        
        $("#pagination").find("p span.last-page").text(totalPages);
        $("#pagination").find("p span.first-page").text(first_page);
        $("#pagination").find("ul li p").text(first_page);
    
        $itemList.children(".item-produk").hide();
    
        $itemList.children(".item-produk").slice(0, itemsPerPage).show();
    
        for (var i = 1; i <= totalPages; i++) {
            $pagination.append('<li style="display: none;"><a href="#" class="page">' + i + '</a></li>');
        }
    
        $pagination.find('.page').on('click', function() {
            var page = $(this).text();
            var start = (page - 1) * itemsPerPage;
            console.log(start);
            var end = start + itemsPerPage;
            first_page = page;
    
            $("#pagination").find("ul li p").text(first_page);
            $("#pagination").find("p span.first-page").text(first_page);
            $itemList.children(".item-produk").hide();
            $itemList.children(".item-produk").slice(start, end).show();
        });
    
        $pagination.find('.prev').on('click', function() {
            var currentPage = parseInt($pagination.find('.page.active').text());
            if (currentPage > 1) {
                $pagination.find('.page.active').removeClass('active');
                $pagination.find('.page').eq(currentPage - 2).addClass('active');
                $pagination.find('.page').eq(currentPage - 2).trigger('click');
            }
        });
    
        $pagination.find('.next').on('click', function() {
            var currentPage = parseInt($pagination.find('.page.active').text());
            if (currentPage < totalPages) {
                $pagination.find('.page.active').removeClass('active');
                $pagination.find('.page').eq(currentPage).addClass('active');
                $pagination.find('.page').eq(currentPage).trigger('click');
            }
        });
    
        $pagination.find('.page').eq(0).addClass('active');
    
        $(".delete").on('click', function (event) {
            var konfirmasi = window.confirm("Apakah Anda yakin ingin melanjutkan?");
            if (!konfirmasi) {
              event.preventDefault();
              return;
            }
        });
    }

    function getDataId() {
        $(".item-produk .price .btn-buy").on("click", function () {
            let id = $(this).data("id");
            fetch(`${api}getId/30092002/${id}`, {
                // mode: 'no-cors',
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then(response => response.json())
                .then(data => {
                    detailProduk(data);
                    targetCardDetail();
                    jumlahBarang();
                    removeCardDetailProduct();
                    checkedSize();
                    pesanan();
                })
                .catch(error => {
                    console.log(error);
                    alert('Terjadi kesalahan saat mengambil data dari server.');
            });
        })
    }

    function detailProduk(data) {
        let listUkuran = "";
        data["ukuran"].forEach((value, index) => {
            let checked = false;
            let active = "";
            if (index == 0) {
                checked = true;
                active = "active";
            }

            listUkuran += 
            `<label for="size${index}" class="item-size ${active}"  data-id="size${index}">
                ${value}
                <input type="radio" name="size" style="display: none;" id="size${index}" value="${value}" checked="${checked}">
            </label>`;
        });

        let element = 
        `<div id="card-detail-produk">
            <div id="close-card-detail-product"><ion-icon name="close"></ion-icon></ion-icon></div>
            <div class="input" style="display: none;">
                <input type="hidden" name="" id="fotoItem" value="${data["foto"]}">
                <input type="hidden" name="" id="nameItem" value="${data["nama_produk"]}">
                <input type="hidden" name="" id="qtyItem" value="1">
                <input type="hidden" name="" id="hargaItem" value="${data["harga"]}">
                <input type="hidden" name="" id="totalBayar" value="${data["harga"]}">
            </div>
            <div class="image-product">
                <img src="${data["foto"]}" alt="">
            </div>
            <div class="info-product">
                <h1 class="name-product">${data["nama_produk"]}</h1>
                <div class="hargaJmlBarang">
                    <div class="harga">
                        <p>Harga</p>
                        <p>${formatRupiah(data["harga"])}</p>
                    </div>
                    <div class="jmlBarang">
                        <input type="hidden" name="" id="hargaItem" value="${data["harga"]}">
                        <p>Qty</p>
                        <ul>
                            <li id="minItem"><ion-icon name="remove-outline"></ion-icon></li>
                            <li><p id="jumlahBarang">1</p></li>
                            <li id="maxItem"><ion-icon name="add-outline"></ion-icon></li>
                        </ul>
                    </div>
                </div>
                <div class="deskripsi">
                    <p>Deskripsi</p>
                    <p>${data["deskripsi"]}</p>
                </div>
                <div class="size">
                    <p>Size</p>
                    <div id="list-size">
                        ${listUkuran}
                    </div>
                </div>
                
                <div class="PriceQuantityBundle">
                    <div class="totalByr">
                        <p>Total</p>
                        <p id="jumlahBayar"></p>
                    </div>
                    <div class="bayar">
                        <div id="btn-bayar"><p>Bayar</p></div> 
                    </div>
                </div>
            </div>
        </div>`;

        $("#card-produk").html(element);
    }

    function formatRupiah(value) {
        value = Number(value);
        var formatRupiah = value.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        });

        return formatRupiah;
    }

    function jumlahBarang() {
        let jmlBrg = 1;
        
        function viewJmlItem(value) {
            $("#jumlahBarang").text(value);
            $("#qtyItem").val(value);
        }

        $("#minItem").on("click", function () {
            if (jmlBrg == 1) {
                return false;
            }

            jmlBrg--;
            run(jmlBrg);
        });

       $("#maxItem").on("click", function () {
            jmlBrg++;
            run(jmlBrg);
       });

       function viewJmlByr(value) {
            let hrgItem = $("#hargaItem").val();
            let subtotal = value * hrgItem;
            $("#jumlahBayar").text(formatRupiah(subtotal));
            $("#totalBayar").val(subtotal);
       }

       function run(value) {
            viewJmlByr(value);
            viewJmlItem(value);
       }

       run(jmlBrg);
    }

    function removeCardDetailProduct() {
        $("#close-card-detail-product").on("click", function () {
            this.parentNode.remove();
        })
    }

    function checkedSize() {
        $("#list-size .item-size").on("click", function () {
            let size_id = $(this).attr("data-id");
            $("#" + size_id).prop("checked", true).trigger("change");
            checked(); // Panggil fungsi untuk memeriksa dan menambahkan/bersihkan kelas "active"
        });
        
        function checked() {
            $("#list-size .item-size").each(function () {
                let size_id = $(this).attr("data-id");
                if ($("#" + size_id).is(":checked")) {
                    $(this).addClass("active");
                } else {
                    $(this).removeClass("active");
                }
            });
        }
    }

    function targetCardDetail() {
        $('html, body').animate({
            scrollTop: $("#card-produk").offset().top - 80
        }, 500);
    }

    function pesanan() {
    
        function getPesananCookie() {
            if (document.cookie) {
                const cookies = document.cookie.split(';');
                for (let cookie of cookies) {
                    const [name, value] = cookie.trim().split('=');
                    if (name === 'pesanan') {
                        return JSON.parse(value);
                    }
                }
                return [];
            }
            return [];
        }

    
        function tambahDataPesanan(data) {
            let dataPesanan = [];

            if (document.cookie) {
                const dataPesananSaatIni = getPesananCookie();
                dataPesananSaatIni.push(data);
                setPesananCookie(dataPesananSaatIni);
                notifCookie();
                notif();
            } else {
                setPesananCookie(dataPesanan = [data]);
            }
        }

        function setPesananCookie(data) {
            const jsonPesanan = JSON.stringify(data);
            document.cookie = `pesanan=${jsonPesanan}`;
        }

        $("#btn-bayar").on("click", function () {
            let dataPesanan = {
                "foto" : $("#fotoItem").val(),
                "nama" : $("#nameItem").val(),
                "size" : $("input[name='size']:checked").val(),
                "qty" : $("#qtyItem").val(),
                "harga" : formatRupiah($("#hargaItem").val()),
                "total" : formatRupiah($("#totalBayar").val())
            };

            tambahDataPesanan(dataPesanan);
            alert("Pesan Berhasil Dibuat!");
            $("#card-detail-produk").remove();
        });
    }

    function notif() {
        value =  Number($.cookie("cookieNotif"));
        if (value == 0) {
            return false;
        } else {
            if (value == 1) {
                $(".btn-keranjang").append(`<div class="notif"><span>${value}</span></div>`);
                $(".btn-menu").append(`<div class="notif"><span>${value}</span></div>`);
            } else {
                $(".notif").html(`<span>${value}</span>`);
                console.log($(".notif"));
            }
        }
    }

    notif();

    function notifCookie() {
        if ($.cookie("cookieNotif")) {
            let notifInt = Number($.cookie("cookieNotif"));
            $.cookie("cookieNotif", notifInt + 1);
        } else {
            $.cookie("cookieNotif", 1);
        }
    }

    function removNotif() {
        let notifInt = 0;
        $.cookie("cookieNotif", notifInt);
        $(".notif").remove();
    }

    // modal pesanan
    $(".btn-keranjang").on("click", function () {
        modalPesanan(getPesananCookie());
        $("#modal-pesanan").css("display", "flex");
        removNotif();
        navActive();
    });

    $("#modal-pesanan .card-pesanan .body .list-pesanan").on("click", ".hapus", function () {
        const konfirmasi = confirm("Apakah yakin ingin menghapus pesanan ini?");

        if (konfirmasi) {
            let id = $(this).data("id");
            let data = getPesananCookie();
            data.splice(id, 1);
            setPesananCookie(data);
            modalPesanan(data);
        } else {
            return false;
        }
    });

    $("#modal-pesanan").on("click", ".close", function () {
        $("#modal-pesanan").css("display", "none");
    });

    function modalPesanan(data) {
        let element = "";
        data.forEach((value, index) => {
            element += `
                <div class="item-pesanan">
                    <div class="hapus-pesanan">
                        <ion-icon name="trash-bin-outline" class="hapus" data-id="${index}"></ion-icon>
                    </div>
                    <div class="imgProduk">
                        <img src="${value["foto"]}" alt="">
                    </div>
                    <div class="nota-pembelian">
                        <h2 class="namaProduk">${value["nama"]}</h2>
                        <div class="size">
                            <p>Size:</p>
                            <p>${value["size"]}</p>
                        </div>
                        <div class="qty">
                            <p>Qty</p>
                            <p>${value["qty"]}</p>
                        </div>
                        <div class="harga">
                            <p>Harga</p>
                            <p>${value["harga"]}</p>
                        </div>
                        <div class="total">
                            <p>Total</p>
                            <p>${value["total"]}</p>
                        </div>
                    </div>
                </div>`;
        });

        $("#modal-pesanan .card-pesanan .body .list-pesanan").html(element);
    }

    function getPesananCookie() {
        if (document.cookie) {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'pesanan') {
                    return JSON.parse(value);
                }
            }
            return [];
        }
        return [];
    }

    function setPesananCookie(data) {
        const jsonPesanan = JSON.stringify(data);
        document.cookie = `pesanan=${jsonPesanan}`;
    }

})

