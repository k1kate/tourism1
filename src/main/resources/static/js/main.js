
document.addEventListener("DOMContentLoaded", async () => {
    const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute("content");
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.getAttribute("content");

    await ymaps3.ready;

    initMap(csrfToken, csrfHeader);
})


let currentTargetCoords = null;
let currentTargetExcursion = null;
let hasShownTargetInfo = false;
let distanceCheckInterval = null;
let currentCoords = null;
let map; // глобальная переменная карты
let routeLayer = null; // для хранения текущего маршрут

let userMarker = null;
let markerEl = null;

let currentPlaceIndex = null;
let places = null;


async function initMap(csrfToken, csrfHeader) {
    const response = await fetch('/static/customization.json');
    const custom = await response.json();

    await ymaps3.ready;

    const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapControls,
        YMapDefaultFeaturesLayer,
        YMapMarker,
        geolocation
    } = ymaps3;

    map = new YMap(document.getElementById('map'), {
        location: {
            center: [48.036681,46.350711],
            zoom: 16
        }
    });

    map.addChild(new YMapDefaultSchemeLayer({ customization: { poi: false } }));
    map.addChild(new YMapDefaultFeaturesLayer());

    const userLocation = await geolocation.getPosition();
    const [longitude, latitude] = userLocation.coords;
    const coords = [longitude, latitude];

    currentCoords = coords;
    checkDistanceAndShowInfo(csrfToken, csrfHeader);

    // map.setLocation({ center: coords});

    markerEl = document.createElement('div');
    markerEl.style.position = 'relative';
    markerEl.style.width = '32px';
    markerEl.style.height = '32px';
    markerEl.style.transform = 'translate(-50%, -100%)';

    const icon = document.createElement('img');
    icon.src = '../../static/img/icon-loc-i.png';
    icon.style.width = '32px';
    icon.style.height = '32px';
    icon.style.display = 'block';

    markerEl.appendChild(icon);

    userMarker = new ymaps3.YMapMarker({ coordinates: coords }, markerEl);
    map.addChild(userMarker);


    console.log('ss22')
    console.log("geolocation" in navigator)
    if ("geolocation" in navigator) {
        const updatePosition = () => {
            navigator.geolocation.getCurrentPosition(position => {
                currentCoords = [position.coords.longitude, position.coords.latitude];
                console.log('ss');
                console.log("geolocation" in navigator);
                console.log(currentCoords + " " + currentTargetCoords)
                if (currentCoords && currentTargetCoords) {
                    checkDistanceAndShowInfo(csrfToken, csrfHeader);
                }

                if (userMarker) {
                    map.removeChild(userMarker);
                }

                userMarker = new ymaps3.YMapMarker({ coordinates: currentCoords }, markerEl);
                map.addChild(userMarker);


                console.log('Обновленные координаты пользователя:', currentCoords);

                setTimeout(updatePosition, 3000);

            }, error => {
                console.warn('Ошибка геолокации:', error);
                // В случае ошибки тоже пробуем через 3 секунды
                setTimeout(updatePosition, 3000);
            }, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 1000
            });
        };

        updatePosition();

    } else {
        console.error('Геолокация не поддерживается в этом браузере');
    }


    map.addChild(new YMapDefaultSchemeLayer({ customization: custom }));


    distanceCheckInterval = setInterval(() => {
        if (currentCoords && currentTargetCoords) {
            checkDistanceAndShowInfo(csrfToken, csrfHeader);
        }
    }, 3000);


    const urlParams = new URLSearchParams(window.location.search);
    const id_comm = urlParams.get('id_comm');
    if (id_comm&& id_comm.trim() !== "") {
        var exccomm = await getexccom(id_comm, csrfToken, csrfHeader);

        if (exccomm && exccomm.places && exccomm.places.length > 0) {
            places = exccomm.places;
            places.forEach(place => addPlaceMarker(place));
            currentPlaceIndex = 0;
            startRouteToPlace(currentPlaceIndex);
        }

    }
}


async function startRouteToPlace(index) {
    const place = places[index];
    if (!place) return;

    currentTargetCoords = [place.longitude, place.latitude];
    hasShownTargetInfo = false;

    await getRouteORS(place.longitude, place.latitude, false);
}



function addPlaceMarker(place) {
    const markerEl = document.createElement('div');
    markerEl.style.position = 'relative';
    markerEl.style.width = '32px';
    markerEl.style.height = '32px';
    markerEl.style.transform = 'translate(-50%, -100%)';
    markerEl.style.cursor = 'pointer';

    const icon = document.createElement('img');
    icon.src = '../../static/img/icon-loc.png';
    icon.style.width = '32px';
    icon.style.height = '32px';
    icon.style.display = 'block';

    markerEl.appendChild(icon);

    const dropdown = document.createElement('div');
    dropdown.style.position = 'absolute';
    dropdown.style.top = '40px';
    dropdown.style.left = '50%';
    dropdown.style.transform = 'translateX(-50%)';
    dropdown.style.backgroundColor = 'white';
    dropdown.style.border = '1px solid #ccc';
    dropdown.style.padding = '8px';
    dropdown.style.borderRadius = '4px';
    dropdown.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    dropdown.style.display = 'none';
    dropdown.style.zIndex = 1000;
    dropdown.style.width = '250px'

    dropdown.innerHTML = `
          <div class="exc-info">
            <h5>${place.title || 'Название отсутствует'}</h5>
            <p>${place.tags?.map(tag => `<span class="badge me-1">${tag}</span>`).join("") || ""}</p>
            <p style="font-size: 0.8rem"><strong>Адрес:</strong> ${place.location || 'Адрес отсутствует'}</p>
            ${place.photoPaths ? `<img src="/uploads/${place.photoPaths[0].photoPath}" alt="Изображение экскурсии" class="card-img-top" style="height: 130px !important;">` : ''}</div>
    `;

    markerEl.appendChild(dropdown);

    markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.style.display = (dropdown.style.display === 'none' || dropdown.style.display === '') ? 'block' : 'none';
    });

    document.addEventListener('click', () => {
        dropdown.style.display = 'none';
    });

    const coords = [place.longitude, place.latitude];
    const marker = new ymaps3.YMapMarker({ coordinates: coords }, markerEl);
    map.addChild(marker);
}

async function getexccom(id, csrfToken, csrfHeader) {
    try {

        const response = await fetch("/getexccomm/" + id, {
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

function checkDistanceAndShowInfo(csrfToken, csrfHeader) {

    if (currentTargetCoords && currentCoords) {
        const distance = getDistanceMeters(currentCoords, currentTargetCoords);
        console.log(`Расстояние до точки: ${distance} м`);

        if (distance < 100 && !hasShownTargetInfo) {
            hasShownTargetInfo = true;
            showExcursionInfoForTarget(csrfToken, csrfHeader);
            clearInterval(distanceCheckInterval);
        }
    }
}
function continueRoute() {
    closeModalview();

    currentPlaceIndex++;
    if (currentPlaceIndex < places.length) {
        startRouteToPlace(currentPlaceIndex);
    } else {
        alert("Экскурсия завершена!");
    }
}

async function getRouteORS(lon, lat, car) {
    if (!currentCoords) {
        alert("Геопозиция ещё не получена.");
        return;
    }

    try {
        hasShownTargetInfo = false;
        currentTargetCoords = [lon, lat];
        currentTargetExcursion = places.find(exc =>
            Number(exc.longitude) === Number(lon) && Number(exc.latitude) === Number(lat)
        );

        const response = await fetch(`/route?startLon=${currentCoords[0]}&startLat=${currentCoords[1]}&endLon=${lon}&endLat=${lat}&car=${car}`);

        if (!response.ok) {
            throw new Error('Ошибка при запросе маршрута');
        }

        const data = await response.json();

        const encodedPolyline = data.routes[0].geometry;

        // Используем polyline декодер OpenRouteService (простой декодер)
        const decodedCoords = decodePolyline(encodedPolyline); // [[lon, lat], ...]

        console.log("Декодированные координаты:", decodedCoords);

        if (routeLayer) {
            map.removeChild(routeLayer);
        }

        routeLayer = new ymaps3.YMapFeature({
            geometry: {
                type: 'LineString',
                coordinates: decodedCoords,
            },
            style: {
                stroke: [{width: 8, color: 'rgb(85,131,107)'}]
            }
        });

        map.addChild(routeLayer);

        // Автоматическое приближение по границам маршрута
        const bounds = data.bbox;
        map.setLocation({ bounds: [[bounds[0], bounds[1]], [bounds[2], bounds[3]]] });

    } catch (error) {
        console.error('Ошибка при получении маршрута:', error);
        alert('Не удалось построить маршрут');
    }
}


function decodePolyline(encoded) {
    let coordinates = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
        let b, shift = 0, result = 0;

        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += deltaLat;

        shift = 0;
        result = 0;

        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const deltaLng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += deltaLng;

        coordinates.push([lng / 1e5, lat / 1e5]);
    }

    return coordinates;
}



function getDistanceMeters(coord1, coord2) {
    const toRad = angle => angle * Math.PI / 180;
    const R = 6371000;

    const lat1 = coord1[1];
    const lon1 = coord1[0];
    const lat2 = coord2[1];
    const lon2 = coord2[0];

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function showExcursionInfoForTarget(csrfToken, csrfHeader) {
    if (!currentTargetExcursion){
        return;

    }

    if (distanceCheckInterval) {
        clearInterval(distanceCheckInterval);
        distanceCheckInterval = null;
    }

    openviewexc(csrfToken, csrfHeader)
}

async function openviewexc(csrfToken, csrfHeader){
    const data = await getexc(currentTargetExcursion.id, csrfToken, csrfHeader);



    document.getElementById("title2").textContent = data.title;
    document.getElementById("id2").textContent = data.id;
    document.getElementById("desc").textContent = data.description;
    document.getElementById("address2").textContent = data.location;



    const tagsHtml = data.tags?.map(tag => `
            <span class="badge me-1">${tag}</span>
        `).join("") || "";

    const tag = document.getElementById("tags2")
    tag.innerHTML = ""
    tag.innerHTML = tagsHtml


    const carouselInner = document.getElementById("carouselInner");
    carouselInner.innerHTML = "";

    data.photoPaths.forEach((filename, index) => {
        const isActive = index === 0 ? "active" : "";

        const carouselItem = document.createElement("div");
        carouselItem.className = `carousel-item ${isActive}`;
        carouselItem.innerHTML = `
        <div class="d-flex justify-content-center align-items-center h-100">
            <img src="/uploads/${filename}" class="carousel-img" alt="Фото экскурсии">
        </div>
    `;
        carouselInner.appendChild(carouselItem);
    });

    document.getElementById('createmodalcardview').style.display = 'flex';


}
function closeModalview() {
    const modal = document.getElementById('createmodalcardview');
    modal.style.display = 'none';

}

async function getexc(id_card, csrfToken, csrfHeader) {
    try {

        const response = await fetch("/getexcursion/" + id_card, {
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


function emulateMovement() {
    let step = 0;
    const path = [
        [currentCoords[0], currentCoords[1]],
        [currentCoords[0] - 0.002, currentCoords[1]],
        [currentCoords[0] - 0.006, currentCoords[1]],
        [currentCoords[0] - 0.01, currentCoords[1]],
        [currentCoords[0] - 0.016, currentCoords[1] + 0.002],
    ];

    const interval = setInterval(() => {
        if (step >= path.length) {
            clearInterval(interval);
            return;
        }

        currentCoords = path[step];
        checkDistanceAndShowInfo();

        if (map && typeof ymaps3.YMapMarker !== 'undefined') {
            if (userMarker) {
                map.removeChild(userMarker);
            }

            userMarker = new ymaps3.YMapMarker({ coordinates: currentCoords }, markerEl);
            map.addChild(userMarker);
            // map.setLocation({ center: currentCoords });
        }

        console.log('Эмуляция координат:', currentCoords);
        step++;
    }, 3000); // каждые 3 секунды
}


// setTimeout(() => {
//     emulateMovement();
// }, 3000); // Подождать 3 секунды перед стартом
