const criptomonedasSelect = document.querySelector('#criptomonedas')
const formulario = document.querySelector('#formulario')
const monedaSelect = document.querySelector('#moneda')
const resultado = document.querySelector('#resultado')



const objBusqueda = {
    moneda:'',
    criptomoneda:''
}



const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas)
})


document.addEventListener('DOMContentLoaded', () => {
    consultarCripto()

    formulario.addEventListener('submit', submitFormulario)

    criptomonedasSelect.addEventListener('change', leerValor)
    monedaSelect.addEventListener('change', leerValor)

})


function consultarCripto(){

    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD"

    fetch(url)
        .then( respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(cm){
    cm.forEach( cripto => {
        const {FullName, Name} = cripto.CoinInfo

        const option = document.createElement('option')
        option.value = Name
        option.textContent = FullName
        criptomonedasSelect.appendChild(option)
    })
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value
    console.log(objBusqueda)
}

function submitFormulario(e){
    e.preventDefault()
    const {moneda, criptomoneda} = objBusqueda

    if (  moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios')
        return;
    } 

    consultarAPI()

}


function mostrarAlerta(msj){
    const exit_error = document.querySelector('.error')

    if (!exit_error){
        const divMsj = document.createElement('div')
        divMsj.classList.add('error')

        divMsj.textContent = msj
        formulario.appendChild(divMsj)
    
        setTimeout(() => {
            divMsj.remove()
        },3000)
    }

    
}

function consultarAPI(){
     const { moneda, criptomoneda }  = objBusqueda
     
     const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

        preCarga()

     fetch(url)
        .then( respuesta =>  respuesta.json())
        .then( cotizacion => mostrarCotizacionHtml(cotizacion.DISPLAY[criptomoneda][moneda]))

}

function mostrarCotizacionHtml(cotizacion){
    limpiarHTML()


    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion

    const precio = document.createElement('p')
    precio.classList.add('precio')
    precio.innerHTML = `El precio es:<span> $${PRICE} </span>`
    
    const precioAlto = document.createElement('p')
    precioAlto.innerHTML = `El precio más alto del dia:<span> $${HIGHDAY} </span>`
    
    const precioBajo = document.createElement('p')
    precioBajo.innerHTML = `El precio más bajo del dia:<span> $${LOWDAY} </span>`
    
    
    const ultimasHoras = document.createElement('p')
    ultimasHoras.innerHTML = `Variación ultimas 24 horas:<span> ${CHANGEPCT24HOUR}%</span>`
   



    const cambio = document.createElement('p')
    cambio.innerHTML = `Ultima actualización:<span> ${LASTUPDATE} </span>`

    
    
    
    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimasHoras)
    resultado.appendChild(cambio)
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function preCarga(){
    limpiarHTML()

    const spinner = document.createElement('div')
    spinner.classList.add('spinner')

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `

    resultado.appendChild(spinner)
}