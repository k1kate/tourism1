
const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute("content");
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute("content");
let dropzoneInstance;
Dropzone.autoDiscover = false;


async function deleteexc() {
    const id = document.getElementById("id2").innerHTML;
    try {
        const response = await fetch(`http://localhost:8080/delexc/${id}`, {
            method: "DELETE",
            headers: {
                [csrfHeader]: csrfToken
            }
        });

        if (response.ok) {
            closeModalview();
            displayCards();
        } else {
            alert("Ошибка при удалении");
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
}


async function deleteexccomm() {
    const id = document.getElementById("excursion-data").dataset.id;
    try {
        const response = await fetch(`http://localhost:8080/deleteexccomm/${id}`, {
            method: "DELETE",
            headers: {
                [csrfHeader]: csrfToken
            }
        });

        if (response.ok) {
            window.location.href = "/excursionsCommon"
        } else {
            alert("Ошибка при удалении");
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

async function loadexcursions() {
    const id = document.getElementById("excursion-data").dataset.id;
    try {

        const response = await fetch("http://localhost:8080/allexcursionsbyid/" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken

            }
        });

        if (!response.ok) throw new Error('Ошибка disc');

        const data = await response.json();

        console.log(data)

        return data


    } catch (error) {
        console.error('Ошибка:', error);
    }

}




async function displayCards() {
    const grid = document.getElementById("cardGrid");
    grid.innerHTML = "";
    let excursions;

    excursions = await loadexcursions();


    excursions.forEach(excursion => {

        grid.innerHTML += `
          <div class="col-md-4 mb-4">
            <div class="card card-click h-100 shadow-sm" onclick="openviewexc(${excursion.id})" style="width: 100%; margin-top: 15px">
             <img src="/uploads/${excursion.photoPaths}" class="card-img-top" alt="Excursion Image" >
              <div class="card-body">
                <h5 class="card-title">${excursion.title}</h5>
                
                <h5 class="card-title minitext" >${excursion.location}</h5>
              </div>
            </div>
          </div>
        `;
    });
}

async function getexc(id_card) {
    try {

        const response = await fetch("http://localhost:8080/getexcursion/" + id_card, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken

            }
        });

        if (!response.ok) throw new Error('Ошибка disc');

        const data = await response.json();


        return data


    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function openviewexc(id_card){
    document.getElementById('createmodalcardview').style.display = 'flex';
    const data = await getexc(id_card);
    console.log(data)

    document.getElementById("title2").textContent = data.title;
    document.getElementById("id2").textContent = data.id;
    document.getElementById("desc").textContent = data.description;
    document.getElementById("address2").textContent = data.location;

    const carouselInner = document.getElementById("carouselInner");
    carouselInner.innerHTML = "";

    data.photoPaths.forEach((filename, index) => {
        const isActive = index === 0 ? "active" : "";

        const carouselItem = document.createElement("div");
        carouselItem.className = `carousel-item ${isActive}`;
        carouselItem.innerHTML = `
        <div class="d-flex justify-content-center align-items-center h-100">
            <img src="/uploads/${filename}" class="carousel-img" alt="Фото экскурсии" style="padding: 15px">
        </div>
    `;
        carouselInner.appendChild(carouselItem);
    });

}


function gomap() {
    const id = document.getElementById("excursion-data").dataset.id;

    window.location.href = "/map?id_comm=" + id;
}



function openCreateModal() {
    document.getElementById('createmodalcard').style.display = 'flex';
    document.getElementById('title').value = ""
    document.getElementById('description').value = ""
    document.getElementById('address').value = ""


    const dropzoneElement = document.getElementById("myDropzone");

    if (Dropzone.instances.length > 0) {
        Dropzone.instances.forEach(instance => instance.destroy());
    }

    dropzoneElement.innerHTML = "";

    const dzPreview = document.createElement("div");
    dzPreview.classList.add("dz-message");
    dzPreview.innerText = "Перетащите файлы сюда или нажмите для выбора";
    dropzoneElement.appendChild(dzPreview);


    dropzoneInstance = new Dropzone(dropzoneElement, {
        maxFilesize: 10,
        dictDefaultMessage: "Перетащите файлы сюда или нажмите для выбора",
        acceptedFiles: 'image/*',
        addRemoveLinks: true,
        dictRemoveFile: 'Удалить',
        init: function () {
            this.on("sending", function(file, xhr, formData) {
                xhr.setRequestHeader(csrfHeader, csrfToken);
            });

            this.on("removedfile", function(file) {

                fetch("/delete?filename=" + encodeURIComponent(file.name), {
                    method: "DELETE",
                    headers: {
                        [csrfHeader]: csrfToken
                    }
                });

            });
        }
    });

}



function closeModal() {
    const modal = document.getElementById('createmodalcard');
    modal.style.display = 'none';


    const inputs = modal.querySelectorAll('input, textarea, select');

    const dropzoneInstance = Dropzone.forElement("#myDropzone");
    if (dropzoneInstance) {
        dropzoneInstance.removeAllFiles(true); // очистить все загруженные файлы
    }

}

function closeModalview() {
    const modal = document.getElementById('createmodalcardview');
    modal.style.display = 'none';

    if (dropzoneInstance) {
        dropzoneInstance.removeAllFiles(true);
    }

}


window.onload = () => {
    displayCards();

};

let addressValid = false;
$("#address").suggestions({
    token: "ef75e957d16d8807eaa8f1ab28720168e00d8593",
    type: "ADDRESS",
    onSelect: function (suggestion) {
        console.log("Выбран адрес:", suggestion.value);
        addressValid = true;
    }
});


$("#address").on("input", function () {
    addressValid = false;
});



function checkvalue() {

    const dropzoneInstance = Dropzone.forElement("#myDropzone");
    const files = dropzoneInstance.files;

    const fileNames = files.map(file => file.name);

    const title = document.getElementById("title").value
    const desc = document.getElementById("description").value
    const address = document.getElementById("address").value


    if (fileNames.length === 0 || title.trim() === "" || desc.trim() === "" || address.trim() === "" || !addressValid) {
        document.getElementById("errorcheck").style.display = "";
        if (!addressValid && (title.trim() !== "" || desc.trim() !== "" || address.trim() !== "")) {
            document.getElementById("errorcheck").innerText = "Невалидный адрес!"
        }else {
            document.getElementById("errorcheck").innerText = "Заполните все поля!"
        }
    } else {
        document.getElementById("errorcheck").style.display = "none";
        console.log("Загруженные файлы:", fileNames);
        createexc(title, desc, address)
    }


}
async function waitUntilImageExists(imageUrl, maxAttempts = 10, interval = 300) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const response = await fetch(imageUrl, { method: 'HEAD' }); // проверяем заголовок, не тянем весь файл
        if (response.ok) return true;
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    return false;
}


async function createexc(title, desc, address) {
    let updatedItem;
    try {
        let fmData = new FormData;
        const dropzoneInstance = Dropzone.forElement("#myDropzone");

        for (let i = 0; i < dropzoneInstance.files.length; i++) {
            fmData.append("file", dropzoneInstance.files[i]);
        }

        let resp = await fetch('http://localhost:8080/upload', {
            method: "POST",
            headers: {
                [csrfHeader]: csrfToken
            },
            body: fmData
        });
        let data = await resp.json();

        if (resp.ok) {
            updatedItem = {
                title: title,
                description: desc,
                location: address,
                photoPaths: data
            };


            const id = document.getElementById("excursion-data").dataset.id;
            const response = await fetch("http://localhost:8080/excursionsCommon/createexc/" + id, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    [csrfHeader]: csrfToken
                },
                body: JSON.stringify(updatedItem)
            });

            if (!response.ok) throw new Error('Ошибка');

            // Ждем появления хотя бы одного изображения
            const firstImage = updatedItem.photoPaths[0];
            const imageUrl = `/uploads/${firstImage}`;

            const imageReady = await waitUntilImageExists(imageUrl);
            if (imageReady) {
                closeModal();
                displayCards();
            } else {
                console.warn("Файл так и не стал доступен.");
                displayCards(); // всё равно пробуем
            }

        } else {
            console.warn("Ошибка загрузки файла");
            displayCards();
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}


