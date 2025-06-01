<#import "blocks/template.ftlh" as t>
<@t.template fullname=fullname>
    <head>
        <meta name="_csrf" content="${_csrf.token}">
        <meta name="_csrf_header" content="${_csrf.headerName}">
    </head>
    <body>
    <div class="container">

        <div class="row mb-4" style="padding-top: 1.5rem !important; margin-bottom: 1rem!important ">

            <div class="col-md-2 mb-2 mb-md-0">
                <button class="btn  w-100 text-main custom-bg custom-btn" onclick="openCreateModal()" style="background-color: #55836b !important; ">Добавить</button>
            </div>

            <div class="col-md-8 mb-2 mb-md-0">
                <input type="text" id="searchInput" class="form-control text-main" placeholder="Поиск экскурсий..." style="color: #495057">
            </div>

            <div class="col-md-2">
                <button class="btn  w-100 text-main custom-bg custom-btn" onclick="displayCards(false, [], true)">Найти</button>
            </div>
        </div>

        <div class="container-r" style="margin: auto">
            <ul class="ks-cboxtags">
                <li><input type="checkbox" name="tags2"  class="tags2" value="музей" id="checkboxOne"><label for="checkboxOne">музей</label></li>
                <li><input type="checkbox" name="tags2"  class="tags2" value="архитектура" id="checkboxTwo"><label for="checkboxTwo">архитектура</label></li>
                <li><input type="checkbox" name="tags2"  class="tags2" value="природа" id="checkboxThree"><label for="checkboxThree">природа</label></li>
                <li><input type="checkbox" name="tags2"  class="tags2" value="церковь" id="checkboxFive"><label for="checkboxFive">церковь</label></li>
                <li><input type="checkbox" name="tags2"  class="tags2" value="памятник" id="checkboxSix"><label for="checkboxSix">памятник</label></li>
                <li><input type="checkbox" name="tags2"  class="tags2" value="история" id="checkboxSeven"><label for="checkboxSeven">история</label></li>
            </ul>
        </div>

        <div class="row" id="cardGrid">
        </div>
    </div>

    <div class="create-modal" id="createmodalcard">
        <div class="create-modal-content">
            <div class="mb-3">
                <label for="title" class="text-main" style="font-size: 17px; color: black">Название экскурсии</label>
                <input type="text" class="form-control" id="title" name="title" required>
            </div>

            <div class="mb-3">
                <label for="description" class="text-main" style="font-size: 17px; color: black">Описание</label>
                <textarea class="form-control" id="description" name="description" rows="4"></textarea>
            </div>


            <div class="container-r">
                <ul class="ks-cboxtags" style="margin-bottom: 0">
                    <li><input type="checkbox" name="tags" class="taggs" value="музей" id="checkbox1One"><label for="checkbox1One">музей</label></li>
                    <li><input type="checkbox" name="tags" class="taggs" value="архитектура" id="checkbox1Two"><label for="checkbox1Two">архитектура</label></li>
                    <li><input type="checkbox" name="tags" class="taggs" value="природа" id="checkbox1Three"><label for="checkbox1Three">природа</label></li>
                    <li><input type="checkbox" name="tags" class="taggs" value="церковь" id="checkbox1Five"><label for="checkbox1Five">церковь</label></li>
                    <li><input type="checkbox" name="tags" class="taggs" value="памятник" id="checkbox1Six"><label for="checkbox1Six">памятник</label></li>
                    <li><input type="checkbox" name="tags" class="taggs" value="история" id="checkbox1Seven"><label for="checkbox1Seven">история</label></li>
                </ul>
            </div>



            <div class="alert alert-danger" style="display: none" id="errorcheck">
                Заполните все поля!
            </div>

            <div class="d-flex justify-content-center align-items-center">
                <button onclick="checkvalue()" class="btn btn-secondary shadow-sm rounded text-main custom-bg" style="margin: 20px 10px 0px 10px; width: 100px; font-size: 17px">Создать</button>
                <a onclick="closeModal()" class="btn btn-secondary shadow-sm rounded text-main custom-bg" style="margin: 20px 10px 0px 10px; width: 100px; font-size: 17px">Назад</a>
            </div>



        </div>
    </div>

<#--    <div class="create-modal-view" id="createmodalcardview">-->
<#--        <div class="create-modal-content">-->
<#--            <div>-->
<#--                <div class="exc-info">-->
<#--                    <p style="display: none"><strong>id:</strong> <span id="id2"></span></p>-->
<#--                    <p><strong>Название:</strong> <span id="title2"></span></p>-->
<#--                    <p><strong>Описание:</strong> <span id="desc"></span></p>-->
<#--                </div>-->




<#--                <div id="tags2" style="margin: 10px"></div>-->

<#--                <div class="exc-info" style="margin-top: 20px">-->
<#--                    <p><strong>Автор:</strong> <span id="author"></span></p>-->
<#--                </div>-->
<#--            </div>-->
<#--            <div class="d-flex justify-content-center align-items-center">-->
<#--                <button onclick="" class="btn btn-secondary shadow-sm rounded text-main custom-bg" id= "gomap" style="margin: 20px 10px 0px 10px;font-size: 17px">Проложить маршрут</button>-->
<#--                <button onclick="deleteexc()" class="btn btn-secondary shadow-sm rounded text-main custom-bg" style="margin: 20px 10px 0px 10px; width: 100px;font-size: 17px; background-color: darkred !important;">Удалить</button>-->
<#--                <a onclick="closeModalview()" class="btn btn-secondary shadow-sm rounded text-main custom-bg" style="margin: 20px 10px 0px 10px; width: 100px;font-size: 17px">Назад</a>-->
<#--            </div>-->
<#--        </div>-->
<#--    </div>-->



    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.9.3/min/dropzone.min.js"></script>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- DaData Suggestions -->
    <script src="https://cdn.jsdelivr.net/npm/suggestions-jquery@latest/dist/js/jquery.suggestions.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/suggestions-jquery@latest/dist/css/suggestions.min.css" />



    <script src="js/excursionsCommon.js" type="text/javascript"></script>
    </body>
    </html>
</@t.template>