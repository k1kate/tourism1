<#import "blocks/template.ftlh" as t>
<@t.template fullname=fullname>
    <head>
        <meta name="_csrf" content="${_csrf.token}">
        <meta name="_csrf_header" content="${_csrf.headerName}">
        </head>
    <body>
    <div class="container">

        <div class="row mb-4" style=" margin-bottom: 3rem;">
            <!-- Заголовок -->
            <h3 class="text-header flex-grow-1 text-center"
                style="color: #424242; font-size: 1.5rem; padding-bottom: 14px !important;">
                ${excursioncomm.title}
            </h3>
            <div class="col-12 d-flex align-items-center justify-content-between flex-wrap">

                <!-- Левая кнопка -->
                <button class="btn text-main custom-bg custom-btn me-2"
                        onclick="gomap()"
                        style="background-color: #55836b; min-width: 230px; font-size: 1.1rem;">
                    Проложить маршрут
                </button>



                <button class="btn text-main custom-bg custom-btn ms-2"
                        onclick="openCreateModal()"
                        style="background-color: #c0392b; min-width: 230px; font-size: 1.1rem;">
                    Добавить
                </button>
                <!-- Правая кнопка -->
                <button class="btn text-main custom-bg custom-btn ms-2"
                        onclick="deleteexccomm()"
                        style="background-color: #c0392b; min-width: 230px; font-size: 1.1rem;">
                    Удалить
                </button>

            </div>
        </div>

<#--        <div class="container-r" style="margin: auto">-->
<#--            <ul class="ks-cboxtags">-->
<#--                <li><input type="checkbox" name="tags2"  class="tags2" value="музей" id="checkboxOne"><label for="checkboxOne">музей</label></li>-->
<#--                <li><input type="checkbox" name="tags2"  class="tags2" value="архитектура" id="checkboxTwo"><label for="checkboxTwo">архитектура</label></li>-->
<#--                <li><input type="checkbox" name="tags2"  class="tags2" value="природа" id="checkboxThree"><label for="checkboxThree">природа</label></li>-->
<#--                <li><input type="checkbox" name="tags2"  class="tags2" value="церковь" id="checkboxFive"><label for="checkboxFive">церковь</label></li>-->
<#--                <li><input type="checkbox" name="tags2"  class="tags2" value="памятник" id="checkboxSix"><label for="checkboxSix">памятник</label></li>-->
<#--                <li><input type="checkbox" name="tags2"  class="tags2" value="история" id="checkboxSeven"><label for="checkboxSeven">история</label></li>-->
<#--            </ul>-->
<#--        </div>-->

        <div class="row" id="cardGrid">
        </div>
    </div>

    <div class="create-modal" id="createmodalcard">
        <div class="create-modal-content">
                <div class="mb-3">
                    <label for="title" class="text-main" style="font-size: 17px; color: black">Название места</label>
                    <input type="text" class="form-control" id="title" name="title" required>
                </div>

                <div class="mb-3">
                    <label for="description" class="text-main" style="font-size: 17px; color: black">Описание</label>
                    <textarea class="form-control" id="description" name="description" rows="4"></textarea>
                </div>

            <div class="mb-3">
                <label for="address">Адрес</label>
                <input type="text" id="address" name="address" class="form-control" placeholder="Введите адрес...">
            </div>

                <form action="/dpPlaceHolder" class="dropzone" id="myDropzone" enctype="multipart/form-data">
                    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
                </form>


                <div class="alert alert-danger" style="display: none" id="errorcheck">
                    Заполните все поля!
                </div>

                <div class="d-flex justify-content-center align-items-center">
                    <button onclick="checkvalue()" class="btn btn-secondary shadow-sm rounded text-main custom-bg" style="margin: 20px 10px 0px 10px; width: 100px; font-size: 17px">Создать</button>
                    <a onclick="closeModal()" class="btn btn-secondary shadow-sm rounded text-main custom-bg" style="margin: 20px 10px 0px 10px; width: 100px; font-size: 17px">Назад</a>
                </div>



        </div>
    </div>

    <div class="create-modal-view" id="createmodalcardview">
        <div class="create-modal-content">
            <div>
                <div class="exc-info">
                    <p style="display: none"><strong>id:</strong> <span id="id2"></span></p>
                    <p><strong>Название:</strong> <span id="title2"></span></p>
                    <p><strong>Описание:</strong> <span id="desc"></span></p>
                    <p><strong>Адрес:</strong> <span id="address2"></span></p>

                </div>




<#--                <div id="tags2" style="margin: 10px"></div>-->
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
<#--                <button onclick="" class="btn btn-secondary shadow-sm rounded text-main custom-bg" id= "gomap" style="margin: 20px 10px 0px 10px;font-size: 17px">Проложить маршрут</button>-->
                <button onclick="deleteexc()" class="btn btn-secondary shadow-sm rounded text-main custom-bg" style="margin: 20px 10px 0px 10px; width: 100px;font-size: 17px; background-color: darkred !important;">Удалить</button>
                <a onclick="closeModalview()" class="btn btn-secondary shadow-sm rounded text-main custom-bg" style="margin: 20px 10px 0px 10px; width: 100px;font-size: 17px">Назад</a>
            </div>
    </div>
    </div>



    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.9.3/min/dropzone.min.js"></script>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- DaData Suggestions -->
    <script src="https://cdn.jsdelivr.net/npm/suggestions-jquery@latest/dist/js/jquery.suggestions.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/suggestions-jquery@latest/dist/css/suggestions.min.css" />


    <div id="excursion-data" data-id="${excursioncomm.id}"></div>
    <script src="/js/excursions.js" type="text/javascript"></script>
    </body>
    </html>
</@t.template>