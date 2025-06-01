<#import "blocks/template.ftlh" as t>
<@t.template fullname=fullname>

    <!DOCTYPE html>
    <html>
    <head>
        <script src="https://api-maps.yandex.ru/v3/?apikey=${yandexApiKey}&lang=ru_RU&"></script>
        <script src="js/main.js" type="text/javascript"></script>

        <meta name="_csrf" content="${_csrf.token}">
        <meta name="_csrf_header" content="${_csrf.headerName}">

    </head>
    <body>

    <div class="d-flex justify-content-center   " style="margin-top: 70px; margin-bottom: 70px">
        <div id="map" ></div>
    </div>

    <div class="create-modal-view" id="createmodalcardview">
        <div class="create-modal-content">
            <div>
                <h3 class="text-header" style="text-align: center;color: #456956;">Вы достигли пункта назначения!</h3>
                <div class="exc-info">
                    <p style="display: none"><strong>id:</strong> <span id="id2"></span></p>
                    <p><strong>Название:</strong> <span id="title2"></span></p>
                    <p><strong>Описание:</strong> <span id="desc"></span></p>
                    <p><strong>Адрес:</strong> <span id="address2"></span></p>

                </div>




                <div id="tags2" style="margin: 10px"></div>
                <div id="photoCarouselWrapper">
                    <div id="photoCarousel" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner" id="carouselInner"></div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#photoCarousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon"></span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#photoCarousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon"></span>
                        </button>
                    </div>
                </div>

            </div>
            <div class="d-flex justify-content-center align-items-center">

                <a onclick="continueRoute()" class="btn btn-secondary shadow-sm rounded text-main custom-bg" style="margin: 20px 10px 0px 10px; width: 150px;font-size: 17px">Продолжить</a>
            </div>
        </div>
    </div>


    </body>

    <script src="https://unpkg.com/geolocation-js/dist/geolocation.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<#--    <script  src="js/main.js" type="text/javascript"></script>-->



</@t.template>