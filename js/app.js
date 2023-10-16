const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () =>{
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e){
    e.preventDefault();

    //Validar 
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === ''){
        mostrarError('Todos los campos son obligatorios');
        
        return;
    
    }
    
    //Consultar la API
    consultarApi(ciudad, pais);
}


function mostrarError(mensaje){
    const alerta = document.querySelector('.bg-red-100')
    
    if(!alerta){
        //Crear alerta
        const alerta = document.createElement('div');

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'nt-6', 'text-center');

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
        `;

        container.appendChild(alerta);

        //Eliminar la alerta despues de 6 segundos
        setTimeout(() => {
            alerta.remove();
        }, 6000);

    }

}

function consultarApi(ciudad, pais){
        
    const appId = '1db7a74026a5989547a7bda2bb11f354'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    Spinner();
    
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML();//Limpiar HTML previo
            if(datos.cod === "404"){
                mostrarError('Cidad no encontrada');
                return;
            }

            //Imprime la respuesta en el HTML
            mostrarClima(datos);
        })
};

function mostrarClima(datos){
    const {name, main: {temp, temp_max, temp_min}} = datos;

    const centigrados = kelvinCentrigrados(temp);
    const max = kelvinCentrigrados(temp_max);
    const min = kelvinCentrigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.innerHTML = `Clima en: ${name}`
    nombreCiudad.classList.add('font-bold', 'text-2xl');
    
    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');
    
    const tempMax = document.createElement('p');
    tempMax.innerHTML = `Max: ${max} &#8451;`;
    tempMax.classList.add('text-xl');

    const temMin = document.createElement('p');
    temMin.innerHTML = `Min: ${min} &#8451;`;
    temMin.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(temMin);

    resultado.appendChild(resultadoDiv);

}

const  kelvinCentrigrados = grados => parseInt(grados - 273.15);



function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}


function Spinner(){

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');
    divSpinner.innerHTML = `
        <div class="sk-chase">
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        </div>
    `;

    resultado.appendChild(divSpinner)

}
