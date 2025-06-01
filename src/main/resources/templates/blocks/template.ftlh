
<#macro template fullname>
    <!doctype html>
    <html lang="ru">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.9.3/min/dropzone.min.css" />


        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css"
            integrity="sha384-zCbKRCUGaJDkqS1kPbPd7TveP5iyJE0EjAuZQTgFLD2ylzuqKfdKlfG/eSrtxUkn"
            crossorigin="anonymous">

        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/suggestions-jquery@latest/dist/js/jquery.suggestions.min.js"></script>
        
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.5.0/font/bootstrap-icons.min.css">

        <link rel="icon" href="../../static/img/favicon.ico" type="image/x-icon">
        <link rel="stylesheet" href="/static/css/style.css">

        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css" integrity="sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz"
              crossorigin="anonymous">


        <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
        />

        <title>TOURISM</title>

        <script>
            document.addEventListener("DOMContentLoaded", function () {
                var currentPage = window.location.pathname.replace(/\/+$/, ''); // Удалить / в конце
                var navItems = document.querySelectorAll('.nav-link');

                navItems.forEach(function (item) {
                    var linkPath = item.getAttribute('href').replace(/\/+$/, ''); // Тоже убрать /
                    if (linkPath === currentPage) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            });
        </script>
    </head>

    <body>

    <nav class="custom-bg shadow rounded nav-container">
        <div class="h5 fw-bold text-header mb-0">TOURISM</div>

        <ul class="nav nav-pills nav-center">
            <li class="nav-item">
                <a class="nav-link h5 fw-bold text-main" href="/map" id="schedule">КАРТА</a>
            </li>
            <li class="nav-item">
                <a class="nav-link h5 fw-bold text-main" href="/excursionsCommon" id="excursions">ЭКСКУРСИИ</a>
            </li>
        </ul>

        <div>
            <div class="dropdown">
                <a class="btn bt h5 fw-bold text-main dropdown-toggle" style="padding: 0; margin: 0" id="login" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="../../static/img/icon-user.png"  class="icon-custom" alt="Описание изображения" style="height: 45px">
                </a>

                <ul class="dropdown-menu p-3" style="min-width: 200px;">
                    <li><p class="mb-2">${fullname}</p></li>
                    <li><a href="/login" class="btn btn-secondary shadow-sm rounded text-main custom-bg" style="font-size: 17px; width: 100%">Выход</a></li>
                </ul>
            </div>
        </div>


    </nav>

    <div class="container mt-4">
        <#nested />
    </div>

    </body>



    </html>
</#macro>