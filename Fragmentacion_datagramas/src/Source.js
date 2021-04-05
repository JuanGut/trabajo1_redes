
/**
 * Lista en donde se almacenas los fragmentos en caso de que exista fragmentacion
 */
var listaFragmentos = new Array;

/**
 * Variables globales para la recoleccion de la informacion del datagrama inicial
 */
var mtu, longitudDatagrama,protocolo , direccionOrigen,direccionDestino,
identificacion,tiempoVida;


/**
 * Variables globales para la definicion de los fragmentos
 */
var flag1 = 0, flag2 = 0,flag3 = 0, desplazamiento,sumaComprobacion = 0, longitudFragmento;


/**
 * Clase que representa el encabezado de un datagrama
 */
class Datagrama {


    constructor(mtu, longitudDatagrama,protocolo, direccionOrigen,direccionDestino, identificacion,
                tiempoVida ,flag1, flag2,flag3, desplazamiento,sumaComprobacion)
    {
        this.mtu = mtu;
        this.longitudDatagrama = longitudDatagrama;
        this.protocolo = protocolo;
        this.direccionOrigen = direccionOrigen;
        this.direccionDestino = direccionDestino;
        this.identificacion = identificacion;
        this.tiempoVida = tiempoVida;

        this.version = 4;
        this.longitudEncabezado = 5;
        this.serviciosD = 0;

        this.flag1 = flag1;
        this.flag2 = flag2;
        this.flag3 = flag3;
        this.desplazamiento = desplazamiento;
        this.sumaComprobacion = sumaComprobacion;
    }

    /**
     * Metodo para imprimir los valores de la clase Datagrama
     * @returns Cadena con los atributos de la clase Datagrama
     */
    toString()
    {
        return "Version :" +  this.version +  " Longitud del encabezado : " + this.longitudEncabezado 
                + " Servicios diferenciados : 0 " + "Longitud total : " + this.longitudDatagrama 
                + "\n"+ " Identificacion : " + this.identificacion + " Reservado : " + this.flag1 
                + " No fragmentar : " + this.flag2 + " Mas fragmentos : " + this.flag3 
                + " Desplazamiento : "+ this.desplazamiento + "\n"+ "Tiempo de vida : " 
                + this.tiempoVida + " Protocolo : " +this.protocolo + " Suma Comprobacion : " 
                + this.sumaComprobacion + "\n"+ "Direccion ip Origen : " + direccionOrigen 
                + " Direccion ip Destino : " + direccionDestino;
    }
    
    

}

/**
 * Metodo que recolecta los datos ingresados por el usuario en la interfaz de usuario
 */
function cargarDatos()
{

    //Falta validar que los datos ingresados por el usuario sean correctos ej : Numeros, direccion Ip etc
    listaFragmentos.splice(0,listaFragmentos.length);
    let formularioEntrada = document.forms["datosInicio"];
    mtu = Number(formularioEntrada.mtu.value);
    longitudDatagrama = Number (formularioEntrada.longitudDatagrama.value);
    direccionOrigen = document.getElementById("direccionOrigen").value;
    direccionDestino = document.getElementById("direccionDestino").value;
    identificacion = Math.floor((Math.random() * (65535 - 0 + 1)) + 0);
    tiempoVida = Math.floor((Math.random() * (255 - 0 + 1)) + 0);
    longitudFragmento = 0;
    desplazamiento = 0;
    protocolo = definirProticolo();

    validarFragmentacion();

}

/**
 * Metodo que identifica el tipo de protocolo ingresado por el usuario
 * @returns Tipo de protocolo convertido en un numero 
 */
function definirProticolo ()
{
    if(document.getElementById("ICMP").checked)
    {
        return 1;
    }
    if(document.getElementById("TCP").checked)
    {
        return 6;
    }
    if(document.getElementById("UDP").checked)
    {
        return 17;
    }
}

/**
 * Metodo que identifica si es necesario realizar fragmentacion
 */
function validarFragmentacion ()
{    

    if (longitudDatagrama > mtu)
    {
        
        var cantFragmentos = Math.ceil((longitudDatagrama-20)/(mtu-20));
        var totalDatos = longitudDatagrama+(20*(cantFragmentos-1))

        for (let index = 0; index < cantFragmentos; index++) 
        {

            if(index != cantFragmentos-1)
            {
                flag3 = 1;
            }
            else
            {
                flag3 = 0;
            }
            if(index != 0)
            {
                desplazamiento+= (mtu-20);
                
            }
            if(totalDatos < mtu)
            {
                longitudFragmento = totalDatos;
            }
            else{
                totalDatos = totalDatos - mtu;
                longitudFragmento = mtu;
            }


            datagrama = new Datagrama(mtu, longitudFragmento,protocolo, direccionOrigen,direccionDestino, identificacion,
                                         tiempoVida , flag1, flag2,flag3, desplazamiento,sumaComprobacion);

        

           listaFragmentos.push(datagrama);
            
        }
      
        imprimirFragmentoDecimal()
       
    }
    // Definir el codigo para cuando no es necesario realizar una fragmentacion
    else{
        

    }
}

/**
 * Metodo para imprimir por consola la informacion de los fragmentos 
 */
function imprimirFragmentoDecimal()
{

    for (let index = 0; index < listaFragmentos.length; index++) 
    {
        
        console.log((listaFragmentos[index]).toString())    
    }
    

}


