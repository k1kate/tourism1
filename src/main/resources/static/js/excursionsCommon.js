
const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute("content");
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute("content");
let selectedTags;

const checkboxes = document.querySelectorAll('.tags2');

checkboxes.forEach(chk => {
    chk.addEventListener('change', () => {

        selectedTags = Array.from(checkboxes)
            .filter(i => i.checked)
            .map(i => i.value);
        document.getElementById("searchInput").value = "";
        displayCards(true, selectedTags)




    });
});


async function deleteexc() {
    const id = document.getElementById("id2").innerHTML;
    try {
        const response = await fetch(`/delexc/${id}`, {
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

async function loadexcursions() {

    try {

        const response = await fetch("/allexcursionscommon", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken

            }
        });

        if (!response.ok) throw new Error('Ошибка disc');

        const data = await response.json();

        console.log(data);

        return data


    } catch (error) {
        console.error('Ошибка:', error);
    }

}

async function loadexcursionssearch(selectedTags) {

    try {

        const response = await fetch("/searchtagscomm", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken

            },
            body: JSON.stringify(selectedTags)
        });

        if (!response.ok) throw new Error('Ошибка disc');

        const data = await response.json();



        return data


    } catch (error) {
        console.error('Ошибка:', error);
    }

}


async function search(word) {
    document.querySelectorAll('.tags2').forEach(checkbox => {
        checkbox.checked = false;
    });
    try {

        const response = await fetch("/searchcomm/" + encodeURIComponent(word), {
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




async function displayCards(filter=false, selectedTags = [], filterword=false) {
    const grid = document.getElementById("cardGrid");
    grid.innerHTML = "";
    let excursions;
    const word = document.getElementById("searchInput").value;
    if(!word){
        filterword = false
    }
    if (!filter & !filterword) {
        excursions = await loadexcursions();
    } else if (!!filter & !filterword) {
        excursions = await loadexcursionssearch(selectedTags);
    } else if (!!filterword) {
        excursions = await search(word);
    }



    excursions.forEach(excursion => {
        const tagsHtml = excursion.tags?.map(tag => `
            <span class="badge me-1">${tag}</span>
        `).join("") || "";
        let ph = excursion.photoPaths
        if (ph === "") {
            ph = '../img/default.jpg'
        } else {
            ph = "uploads/" + ph;
        }

        grid.innerHTML += `
          <div class="card mb-3 shadow-sm card-click" onclick="openexc(${excursion.id})" style="cursor: pointer;">
            <div class="row g-0">
              <div class="col-md-4 position-relative">
                <div class="excursion-bg" style="background-image: url('${ph}');"></div>
              </div>
              <div class="col-md-8">
                <div class="card-body" >
                  <h5 class="card-title text-header" style="color: #4c4c4c">${excursion.title}</h5>
                  <div class="mb-2">
                    ${tagsHtml}
                  </div>
                  <p class="card-text minitext">${truncateText(excursion.description, 100)}</p>
                  <p class="card-text minitext">${excursion.author}</p>
                </div>
              </div>
            </div>
          </div>
        `;
    });
}

function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
}



async function openexc(id_card){
    window.location.href = "/excursions/" + id_card
}


function openCreateModal() {
    document.getElementById('createmodalcard').style.display = 'flex';

}

function closeModal() {
    const modal = document.getElementById('createmodalcard');
    modal.style.display = 'none';

    const inputs = modal.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
        } else if (input.tagName.toLowerCase() === 'select') {
            input.selectedIndex = 0;
        } else {
            input.value = '';
        }
    });
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

    const checkedBoxes = document.querySelectorAll('.ks-cboxtags input[type="checkbox"]:checked');
    const valuesCBox = Array.from(checkedBoxes).map(checkbox => checkbox.value);

    const title = document.getElementById("title").value
    const desc = document.getElementById("description").value


    if (valuesCBox.length === 0 || title.trim() === "" || desc.trim() === "" ) {
        document.getElementById("errorcheck").style.display = "";
        document.getElementById("errorcheck").innerText = "Заполните все поля!"
    } else {
        document.getElementById("errorcheck").style.display = "none";
        createexc(title, desc, valuesCBox)
    }


}

async function createexc(title, desc, valuescb) {
    let updatedItem;
    try {
        updatedItem = {
            title: title,
            description: desc,
            tags: valuescb,
        };

        const response = await fetch("/createExcursionsCommon", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken
            },
            body: JSON.stringify(updatedItem)
        });

        if (!response.ok) throw new Error('Ошибка');



            closeModal();
            displayCards();



    } catch (error) {
        console.error('Ошибка:', error);
    }
}


