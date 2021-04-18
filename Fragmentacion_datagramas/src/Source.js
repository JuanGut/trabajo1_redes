
/**
 * Lista en donde se almacenas los fragmentos en caso de que exista fragmentacion
 */
var listaFragmentos = new Array;
var listaFragmentosBinario = new Array;
var listaFragmentosDecimal = new Array;
var transformacionBinario = [128,64,32,16,8,4,2,1];

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
 * Comentario prieba
 */

/**
 * Clase que representa el encabezado de un datagrama
 */
class Datagrama {


    /**
     * Metodo constructor de la clase Datagrama
     * @param {*} longitudDatagrama Longitud del datagrama
     * @param {*} protocolo Tipo de protocolo del datagrama
     * @param {*} direccionOrigen Direccion origen del datagrama
     * @param {*} direccionDestino Direccion destino del datagrama
     * @param {*} identificacion Identificacion del datagrama
     * @param {*} tiempoVida Tiempo de vida 
     * @param {*} flag1 Flag 1
     * @param {*} flag2 Flag 2
     * @param {*} flag3 Flag de mas fragmentos
     * @param {*} desplazamiento Desplazamiento 
     * @param {*} sumaComprobacion Suma de comprobacion
     */
    constructor(longitudDatagrama,protocolo, direccionOrigen,direccionDestino, identificacion,
                tiempoVida ,flag1, flag2,flag3, desplazamiento,sumaComprobacion)
    {
        
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


            datagrama = new Datagrama(longitudFragmento,protocolo, direccionOrigen,direccionDestino, identificacion,
                                         tiempoVida , flag1, flag2,flag3, desplazamiento,sumaComprobacion);

        

           listaFragmentos.push(datagrama);
            
        }
      
        transformarFragmentoDecimal();
        imprimirFragmentosDecimal();
       
    }
    // Definir el codigo para cuando no es necesario realizar una fragmentacion
    else{
        

    }
}



/**
 * Metodo para transformar la informacion de los fragmentos en decimal
 */
function transformarFragmentoDecimal()
{

    datagrama = "";
    for (let index = 0; index < listaFragmentos.length; index++) 
    {
       datagrama = listaFragmentos[index].toString();
       listaFragmentosDecimal.push(datagrama);
    }

}

function imprimirFragmentosDecimal()
{

    aux = "";
    for (let index = 0; index < listaFragmentosDecimal.length; index++) 
    {
      
       aux += "Datagrama " + (index+1) + "\n\n" + listaFragmentosDecimal[index] + "\n\n";
    }

    document.getElementById('campoDecimalParrafo').innerHTML = aux ;
    console.log(aux);
}

function imprimirFragmentoHexa()
{
 

}



function imprimirFragmentobinario()
{
    var fragmentosB;
    for(let index = 0; index < listaFragmentos.length; index)
    {
        fragmentosB = listaFragmentos[index].version.calcularBinario +
         listaFragmentos[index].longitudEncabezado.calcularBinario + 
         listaFragmentos[index].longitudDatagrama.calcularBinario +
         listaFragmentos[index].identificacion.calcularBinario  +
         listaFragmentos[index].longitudEncabezado.calcularBinario + flag1 ;

    }
}
function  calcularBinario(version)
	{
		var sum = 0;
		var cadena = "";
		for(var i = 0 ; i < transformacion.length ;i++)
		{
			if((transformacion[i] + sum) <= decimal)
			{
				sum += transformacion[i];
				cadena+="1";
			}
			else
			{
				cadena+="0";
			}
		}
		
		return cadena;
	}

