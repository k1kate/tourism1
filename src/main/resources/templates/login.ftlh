<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css"
          integrity="sha384-zCbKRCUGaJDkqS1kPbPd7TveP5iyJE0EjAuZQTgFLD2ylzuqKfdKlfG/eSrtxUkn"
          crossorigin="anonymous">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.5.0/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="/static/css/style.css">
    <link rel="icon" href="../../static/img/favicon.ico" type="image/x-icon">

    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@500&family=Pacifico&display=swap" rel="stylesheet">
    <title>Авторизация</title>
</head>
<body>

<div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow rounded">
        <div class="card-header custom-bg">
            <h4 class="d-flex justify-content-center text-main" style="margin-bottom: 0; font-size: 2rem;">Авторизация</h4>
        </div>
        <div class="card-body">
            <form action="/login" method="post">
                <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>

                <div class="mb-3">
                    <label class="visually-hidden" for="username">
                        <h6 class="text-main" style="font-size: 17px !important; color: black">Логин</h6>
                    </label>
                    <div class="input-group">
                        <div class="input-group-text">@</div>
                        <input type="text" class="form-control" id="username" name="username" required>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="inputPassword" class="form-label">
                        <h6 class="text-main" style="font-size: 17px !important; color: black">Пароль</h6>
                    </label>
                    <input type="password" id="inputPassword" class="form-control" name="password" required>
                </div>

                <#if error??>
                    <div class="alert alert-danger">
                        Неверный логин или пароль!
                    </div>
                </#if>


                <div class="d-flex justify-content-between">
                    <button type="submit" class="btn btn-secondary shadow-sm rounded text-main custom-bg">Войти</button>
                    <a href="/register" class="btn btn-secondary shadow-sm rounded text-main custom-bg">Регистрация</a>

                </div>
            </form>
        </div>
    </div>

</div>


<script>
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) {
            alert.remove();
            window.location.href = '/login';
        }
    }, 3000);
</script>

</body>
</html>
