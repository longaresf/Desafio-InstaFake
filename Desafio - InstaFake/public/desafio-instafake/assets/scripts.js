// Variable para el número de página, será incrementado por el
// evento click del botón Agregar Fotos
let pagina = 1;

// Evento click del botón Entrar que carga el primer conjunto de fotos
// al llamar al método getPhotos() el cual usa el token generado por
// la función postData() a la cuál se le pasan lo valores de los
// campos del formulario
$('#js-form').submit(async (event) => {
    event.preventDefault();
    const email = document.getElementById('js-input-email').value;
    const password = document.getElementById('js-input-password').value;
    const JWT = await postData(email,password);
    const photos = await getPhotos(JWT,pagina);
    mostrarFotos(photos);
    toggleFormAndContainer('js-form-wrapper','js-container');
});

// Función para hacer login y generar el JWT, el cuál se guarda
// en el LocalStorage
const postData = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
        {
            method:'POST',
            body: JSON.stringify({email:email,password:password})
        })
        const { token } = await response.json();
        localStorage.setItem('jwt-token',token);
        return token;
    }
    catch (err) { 
        console.error(`Error: ${err}`)
    }
};

// Función que usa el token para solicitar los datos de photos
// según el valor guardado en la variable pagina según corresponda
const getPhotos = async (jwt,page) => {
    try {

        const response = await fetch(`http://localhost:3000/api/photos?page=${page}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        const { data } = await response.json();
        return data;
    }
    catch (err) {
        console.error(`Error: ${err}`)
    }
};

// Función que adjunta los conjuntos de fotos manipulando el DOM
const mostrarFotos = (data) => {
    let container = document.getElementById('js-container-2');

    data.forEach(elemento => {
        container.innerHTML += `
            <div class='card m-1'>
                <img src='${elemento.download_url}'>
                <div class='card-body'>
                    <p class='cart-title'>Autor: ${elemento.author}</p>
                </div>
            </div>
                `;
    })
    
};

// Función que muestra el feed de fotos y oculta el formulario al 
// segpun el evento correspondiente, y viceversa
const toggleFormAndContainer = (form,container) => {
    $(`#${form}`).toggle();
    $(`#${container}`).toggle();
}

// Evento click para agregar más conjuntos de fotos, añadiéndolas
// al listado existente
$('#js-agregar-fotos').click(async () =>{
    pagina = pagina + 1;

    const token = localStorage.getItem('jwt-token');
    const photos = await getPhotos(token,pagina);
    mostrarFotos(photos);

    return pagina;
});

// Si el JWT esta guardado en LocalStorage carga automáticamente
// el feed de fotos
const init = (async () => {

    document.getElementById('js-input-email').value = '';
    document.getElementById('js-input-password').value = '';

    const token = localStorage.getItem('jwt-token');
    if(token){
        const photos = await getPhotos(token);
        mostrarFotos(photos);
        toggleFormAndContainer('js-form-wrapper','js-container');
    }
})();

// Al presionar el botón cerrar se borra el LocalStorage y
// vuelve la applicación a su estado inicial
$('#js-cerrar').click( () => {
    localStorage.clear();
    window.location.reload();
});
