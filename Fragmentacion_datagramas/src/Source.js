
/**
 * Lista en donde se almacenas los fragmentos en caso de que exista fragmentacion
 */
var listaFragmentos = new Array;
var listaFragmentosBinario = new Array;
var listaFragmentosDecimal = new Array;
var listaFragmentosHexa= new Array;
var transformacionBinario = [65536,32768,16384,8192,4096,2048,1024,512,256,128,64,32,16,8,4,2,1];
var mapa = new Map();
mapa.set("0" , 0); mapa.set("1" , 1);mapa.set("2" , 2);mapa.set("3" , 3);mapa.set("4" , 4);mapa.set("5" , 5);
mapa.set("6" , 6);mapa.set("7" , 7);mapa.set("8" , 8);mapa.set("9" , 9);mapa.set("a" , 10);mapa.set("b" , 11);
mapa.set("c" , 12);mapa.set("d" , 13);mapa.set("e" , 14);mapa.set("f" , 15);


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
        this.serviciosD = "0";

        this.flag1 = flag1;
        this.flag2 = flag2;
        this.flag3 = flag3;
        this.desplazamiento = desplazamiento;
        this.sumaComprobacion = sumaComprobacion;
    }

                /**
                 * Este Metodo para imprimir los valores de la clase Datagrama
                 * @returns Cadena con los atributos de la clase Datagrama
                 */
                toString()
                {
                    return "Version :" +  this.version + "<br/>" + " Longitud del encabezado : " + this.longitudEncabezado + "<br/>"
                            + " Servicios diferenciados : 0 " + "<br/>"+ "Longitud total : " + this.longitudDatagrama 
                            + "<br/>"+ "Identificacion : " + this.identificacion + "<br/>"+ "Reservado : " + this.flag1 
                            + "<br/>"+ "No fragmentar : " + this.flag2 + "<br/>"+ "Mas fragmentos : " + this.flag3 
                            + "<br/>"+ " Desplazamiento : "+ this.desplazamiento + "<br/>"+ "Tiempo de vida : " 
                            + this.tiempoVida + "<br/>"+ " Protocolo : " +this.protocolo + "<br/>"+ " Suma Comprobacion : " 
                            + this.sumaComprobacion + "<br/>"+ "Direccion ip Origen : " + direccionOrigen 
                            + "<br/>"+ "Direccion ip Destino : " + direccionDestino + "<br/>";
                }  
    
    

}

/**
 * Metodo que recolecta los datos ingresados por el usuario en la interfaz de usuario
 */
function cargarDatos()
{

    //Falta validar que los datos ingresados por el usuario sean correctos ej : Numeros, direccion Ip etc
    listaFragmentos.splice(0,listaFragmentos.length);
    listaFragmentosBinario.splice(0,listaFragmentosBinario.length);
    listaFragmentosDecimal.splice(0,listaFragmentosDecimal.length);
    listaFragmentosHexa.splice(0,listaFragmentosHexa.length);
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
      
        
        convertirAHexadecimal();
        completarHexadecimal();
        encontrarSumaComprobacion();
        transformarFragmentoDecimal();
        imprimirFragmentosDecimal();

        imprimirHexadecimal();
        imprimirFragmentobinario();
       
    }
    else{
        
        datagrama = new Datagrama(longitudDatagrama,protocolo, direccionOrigen,direccionDestino, identificacion,
            tiempoVida , flag1, flag2,flag3, desplazamiento,sumaComprobacion);

            listaFragmentos.push(datagrama);

            convertirAHexadecimal();
            completarHexadecimal();
            encontrarSumaComprobacion();
            transformarFragmentoDecimal();
            imprimirFragmentosDecimal();

            imprimirHexadecimal();
            imprimirFragmentobinario();

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
/**
 * Metodo para convertir el datagrama en grupos de 16 bits con el fin de poder hacer la suma de comprobacion
 * @param {Arraylist con cada parte del datagrama en formato hexadecimal} listaHexadecimal 
 * @returns suma de comprovacion 
 */
function encontrarSumaComprobacion()
{
    var cadena="";

    for(let i=0; i<listaFragmentosHexa.length;i++)
    {
        cadena+=listaFragmentosHexa[i].version +""+ listaFragmentosHexa[i].longitudEncabezado +"" + listaFragmentosHexa[i].serviciosD + ":" + listaFragmentosHexa[i].longitudDatagrama + ":"
        + listaFragmentosHexa[i].identificacion + ":" + listaFragmentosHexa[i].desplazamiento + ":" + listaFragmentosHexa[i].tiempoVida 
        + "" + listaFragmentosHexa[i].protocolo + ":" + listaFragmentosHexa[i].direccionOrigen.substring(0,4) + ":" + listaFragmentosHexa[i].direccionOrigen.substring(4,8) + ":" + listaFragmentosHexa[i].direccionDestino.substring(0,4)
        + ":" + listaFragmentosHexa[i].direccionDestino.substring(4,8);

        var arrayFracmentosSuma=cadena.split(":");

        var suma=realizarSuma(arrayFracmentosSuma);

        listaFragmentos[i].sumaComprobacion = transformarHexaADecimal(suma);
        listaFragmentosHexa[i].sumaComprobacion=suma;   

        cadena="";
    }


}

/**
 * Metodo para realizar la suma de comprobacion por medio del arraylist de 16 bits en cada posicion
 * @param {Arraylist dividido de a 16 bits por posicion } arrayFragmentosSuma 
 * @returns La suma de comprobacion
 */

function realizarSuma(arrayFragmentosSuma)
{
    var sumaS="";
    for(let i=0 ;i<arrayFragmentosSuma.length ;i++)
    {
        if(i<arrayFragmentosSuma.length-1)
        {
            var num1=parseInt(arrayFragmentosSuma[i],16);
            var num2=parseInt(arrayFragmentosSuma[i+1],16);
            var sum=num1 + num2;
             /**console.log( num1+ "," + num2 + "," +sum.toString(16));
             */
            if(sum.toString(16).length>4)
            {
                sum=sum.toString(16);
                var parte1=parseInt(sum.substring(0,1),16);
                var parte2=parseInt(sum.substring(1),16);
         
                var suma=parte1+parte2;
         
                arrayFragmentosSuma[i+1]=suma.toString(16);
            }
            else
            {
                
                arrayFragmentosSuma[i+1]=sum.toString(16);
                
            }


        }  

         
    }
    sumaS=65535-parseInt(arrayFragmentosSuma[arrayFragmentosSuma.length-1],16); 
    
    return sumaS.toString(16);
}
function imprimirFragmentosDecimal()
{

    aux = "";
    for (let index = 0; index < listaFragmentosDecimal.length; index++) 
    {
      
       aux += "Datagrama " + (index+1) + "\n\n" + listaFragmentosDecimal[index] + "\n\n";
    }

     var tex = imprimirlistaHtml(listaFragmentosDecimal);
    //document.getElementById('campoDecimalParrafo').innerHTML = aux ;
    document.getElementById("cont-decimal").innerHTML = tex;
    //console.log(aux);
}

function imprimirFragmentobinario()
{
    var fragmentosB = "";
    for(let index = 0; index < listaFragmentos.length; index++)
    {
        fragmentosB += "\n Datagrama "+ index + " \n "+ "Version :"+calcularBinario(listaFragmentos[index].version, 4) +
        " Longitud del encabezado : "+calcularBinario(listaFragmentos[index].longitudEncabezado, 4) + 
        " Servicios diferenciados : 00000000 "+
        " Longitud total : "+calcularBinario(listaFragmentos[index].longitudDatagrama, 16) +"\n"+

        " Identificacion : "+calcularBinario(listaFragmentos[index].identificacion, 16)  +
        " Reservado : "+listaFragmentos[index].flag1 + " No fragmentar : "+listaFragmentos[index].flag2 +
          " Mas fragmentos : "+listaFragmentos[index].flag3+
         " Desplazamiento : "+calcularBinario(listaFragmentos[index].desplazamiento, 13) +"\n"+

         " Tiempo de vida : "+calcularBinario(listaFragmentos[index].tiempoVida, 8)  +
         " Protocolo : "+calcularBinario(listaFragmentos[index].protocolo, 8) +
         " Suma Comprobacion : "+calcularBinario(listaFragmentos[index].sumaComprobacion, 16) +"\n"
        + " Direccion ip Origen : " + direccionOrigen 
             + " Direccion ip Destino : " + direccionDestino; 
    }
        document.getElementById('campoBinarioParrafo').innerHTML = fragmentosB ;
       // console.log(fragmentosB);
   

}
function  calcularBinario(version,bits)
	{
		var sum = 0;
		var cadena = ""; 

		for(var i = (transformacionBinario.length - bits) ; i < transformacionBinario.length ;i++)
		{
			if((transformacionBinario[i] + sum) <= version)
			{
				sum += transformacionBinario[i];
				cadena+="1";
			}
			else
			{
                if((transformacionBinario.length-1)-i < bits)
                {
				cadena+="0";
                }  
			}
		}
		
		return cadena;
	}

function completarHexadecimal(){
    for (let index = 0; index < listaFragmentosHexa.length; index++) 
    {
        if(listaFragmentosHexa[index].longitudDatagrama.length<4){
            for(let index1 =0;index1 <= 4-listaFragmentosHexa[index].longitudDatagrama.length;index1++){
                listaFragmentosHexa[index].longitudDatagrama="0"+listaFragmentosHexa[index].longitudDatagrama;
            }
        }
        if(listaFragmentosHexa[index].identificacion.length<4){
            for(let index1 =0;index1 <=4-listaFragmentosHexa[index].identificacion.length;index1++){
                listaFragmentosHexa[index].identificacion="0"+listaFragmentosHexa[index].identificacion;
            }
        }
        if(listaFragmentosHexa[index].desplazamiento.length<4){
            for(let index1 =0;index1 <4-listaFragmentosHexa[index].desplazamiento.length;index1){
                listaFragmentosHexa[index].desplazamiento="0"+listaFragmentosHexa[index].desplazamiento;
            }
        }
        if(listaFragmentosHexa[index].tiempoVida.length<2){
            for(let index1 =0;index1 <= 2-listaFragmentosHexa[index].tiempoVida.length;index1++){
                listaFragmentosHexa[index].tiempoVida="0"+listaFragmentosHexa[index].tiempoVida;
            }
        }

        if(listaFragmentosHexa[index].protocolo.length<2){
            for(let index1 =0;index1 <= 2-listaFragmentosHexa[index].protocolo.length;index1++){
                listaFragmentosHexa[index].protocolo="0"+listaFragmentosHexa[index].protocolo;
            }
        }
        if(listaFragmentosHexa[index].serviciosD.length<2){
            for(let index1 =0;index1 <= 2-listaFragmentosHexa[index].serviciosD.length;index1++){
                listaFragmentosHexa[index].serviciosD="0"+listaFragmentosHexa[index].serviciosD;
            }
        }
       
        if(listaFragmentosHexa[index].sumaComprobacion.length<4){
            for(let index1 =0;index1 <4-listaFragmentosHexa[index].sumaComprobacion.length;index1){
                listaFragmentosHexa[index].sumaComprobacion="0"+listaFragmentosHexa[index].sumaComprobacion;
            }
        }
       
    }
}
function convertirAHexadecimal(){
    var longitudFragmentoHexa;
    var protocoloHexa;
    var direccionDestinoHexa="";
    var direccionOrigenHexa="";
    var identificacionHexa;
    var tiempoVidaHexa;
    var desplazamientoHexa;
    var sumaComprobacionHexa;
  
    for (let index = 0; index<listaFragmentos.length; index++) 
    {
        longitudFragmentoHexa=listaFragmentos[index].longitudDatagrama.toString(16);
        protocoloHexa=listaFragmentos[index].protocolo.toString(16);
        var direccionDes=listaFragmentos[index].direccionDestino.split(".");
        var direccionOrg=listaFragmentos[index].direccionOrigen.split(".");
       
        identificacionHexa=listaFragmentos[index].identificacion.toString(16);
        tiempoVidaHexa=listaFragmentos[index].tiempoVida.toString(16);
        desplazamientoHexa=listaFragmentos[index].desplazamiento.toString(16)
        sumaComprobacionHexa=listaFragmentos[index].sumaComprobacion.toString(16);
        for(let index2=0; index2<direccionDes.length ; index2++){
            if(direccionDestinoHexa.length<=8){
                if(direccionDes[index2].length==1){
                direccionDestinoHexa+="0"+Number(direccionDes[index2]).toString(16);
                }
                else{
                    direccionDestinoHexa+=Number(direccionDes[index2]).toString(16);
                }
                if(direccionOrg[index2].length==1){
                    direccionOrigenHexa+="0"+Number(direccionOrg[index2]).toString(16);
                }
                else{
                    direccionOrigenHexa+=Number(direccionOrg[index2]).toString(16);
                }
            }
           
        }
        datagrama = new Datagrama(longitudFragmentoHexa,protocoloHexa, direccionOrigenHexa,direccionDestinoHexa, identificacionHexa,
            tiempoVidaHexa,flag1,flag2,flag3,desplazamientoHexa,sumaComprobacionHexa);

        listaFragmentosHexa.push(datagrama);
    }

   
}
function imprimirHexadecimal(){
    var aux="";
    for (let index = 0; index < listaFragmentosHexa.length; index++) 
    {
    aux+="Datagrama "+(index+1)+":\n"+listaFragmentosHexa[index].version+""+listaFragmentosHexa[index].longitudEncabezado+" "
    +listaFragmentosHexa[index].serviciosD+" "+listaFragmentosHexa[index].longitudDatagrama.substring(0,2)+" "
    +listaFragmentosHexa[index].longitudDatagrama.substring(2,)+"\n"+listaFragmentosHexa[index].identificacion.substring(0,2)+ " "
    +listaFragmentosHexa[index].identificacion.substring(2,)+" "+listaFragmentosHexa[index].desplazamiento.substring(0,2)+" "
    +listaFragmentosHexa[index].desplazamiento.substring(2,)+"\n"+listaFragmentosHexa[index].tiempoVida+" " +listaFragmentosHexa[index].protocolo+" "+listaFragmentosHexa[index].sumaComprobacion.substring(0,2)+" "
    +listaFragmentosHexa[index].sumaComprobacion.substring(2,)+"\n"+listaFragmentosHexa[index].direccionOrigen.substring(0,2)+" "
    +listaFragmentosHexa[index].direccionOrigen.substring(2,4)+" "+listaFragmentosHexa[index].direccionOrigen.substring(4,6)+" "
    +listaFragmentosHexa[index].direccionOrigen.substring(6,8)+"\n"+listaFragmentosHexa[index].direccionDestino.substring(0,2)+" "
    +listaFragmentosHexa[index].direccionDestino.substring(2,4)+" "+listaFragmentosHexa[index].direccionDestino.substring(4,6)+" "
    +listaFragmentosHexa[index].direccionDestino.substring(6,8)+ "\n";
    }
    document.getElementById('campoHexa').innerHTML = aux ;
    //console.log(aux); 
       

}

/**
 * Metodo que transforma un numero hexadecimal en decimal
 * @param {*} numeroHexadecimal 
 * @returns Numero convertido a decimal
 */
function  transformarHexaADecimal(cadena)
{
    suma = mapa.get(cadena.charAt(0))*(16**3) + mapa.get(cadena.charAt(1))*(16**2) + mapa.get(cadena.charAt(2))*(16**1) + mapa.get(cadena.charAt(3));
    return suma;
}

/**
 * Metodo para generar valores de entrada aleatorios
 */
function generarAleatorio()
{

    
    mtuAleatorio = Math.floor((Math.random() * (2000 - 0 + 1)) + 0);
    longitudAleatorio =Math.floor((Math.random() * (2000 - 0 + 1)) + 0);
    protocoloAleatorio = Math.floor((Math.random() * (2 - 0 + 1)) + 1);



    oct1Origen= Math.floor((Math.random() * (254 - 1)) + 1);
    oct2Origen= Math.floor((Math.random() * (254 - 0 + 1)) + 0);
    oct3Origen= Math.floor((Math.random() * (254 - 0 + 1)) + 0);
    oct4Origen= Math.floor((Math.random() * (254 - 0 + 1)) + 0);

    origen = oct1Origen + "." + oct2Origen + "." + oct3Origen + "." + oct4Origen;
    oct1Des= Math.floor((Math.random() * (254 - 1)) + 1);
    oct2Des= Math.floor((Math.random() * (254 - 0 + 1)) + 0);
    oct3Des= Math.floor((Math.random() * (254 - 0 + 1)) + 0);
    oct4Des= Math.floor((Math.random() * (254 - 0 + 1)) + 0);

    destino = oct1Des + "." + oct2Des + "." + oct3Des + "." + oct4Des;


    document.getElementById("mtu").value = mtuAleatorio;
    document.getElementById("longitudDatagrama").value = longitudAleatorio;
    document.getElementById("direccionOrigen").value = origen;
    document.getElementById("direccionDestino").value = destino;


    if(protocoloAleatorio == 1)
    {
        document.getElementById("ICMP").checked =  true;
        
    }
    if(protocoloAleatorio == 2)
    {
        document.getElementById("TCP").checked = true;
    }
    if(protocoloAleatorio == 3)
    {
       
        document.getElementById("UDP").checked = true;
    }
}

/**
 * Metodo para imprimir fragmentos en el documento html
 * @param {*} listaFragmentos Lista de fragmentos a imprimir 
 * @returns Cadena con las etiquetas listas para ser indexados en el documento html
 */
function imprimirlistaHtml(listaFragmentos)
 {
     console.log(listaFragmentos);
    var nav = "<nav>"
   var texto = "<scroll-container style=\"display: block;width: 350px; height: 200px; overflow-y: scroll; scroll-behavior: smooth;\">";
        for (let index = 0; index < listaFragmentos.length; index++) {
                
            texto+="<scroll-page style=\"display: flex;align-items: left;justify-content: left;height: 100%;font-size: 11px;\" id=\""+"Datagrama"+index+"\">"+ listaFragmentos[index]+"</scroll-page>" 
            nav += "<a style=\"width: 339px;padding: 5px;border: 1px solid black;\" href=\" #Datagrama"+index+"\">"+(index+1)+"</a>"
            }
           
            texto+="</scroll-container>";
            nav += "</nav>"
            return nav + texto;
 }
