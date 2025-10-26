"use strict";
/**
 * Número de celdas del puzzle (determinado por la dificultad seleccionada).
 * @type {number | null}
 */
let nCells=null;
/**
 * Identificador del temporizador para poder controlarlo con clearInterval.
 * @type {number | null}
 */
let temporizador=null;
/**
 * Nombre del superhéroe para deteminar las piezas que se utilizarán.
 * @type {string}
 */
let superHero;
/**
 * Tiempo transcurrido en segundos desde el inicio del juego.
 * @type {number}
 */
let seconds = 0;
/**
 * Clase CSS que se aplicará al contenedor del puzzle al completar el nivel.
 * @type {string | null}
 */
let completadoClase = null;
$(()=>{
  /**
   * Configura eventos del Dom
   * click en los botones de selección de dificultad.
   */
  $(".easy").on("click",easy);
  $(".medium").on("click",medium);
  $(".hard").on("click",hard);
})
/**
 * Configura la dificultad fácil.
 */
const easy=()=>{
  nCells = 9; // Número de celdas para la dificultad fácil.
  superHero = "spideman"; // superhéroe para acceder a la imagenes.
  completadoClase = "spiderman-completado"; // Clase CSS que se le pondra al completar el puzzle.
  $("#puzzle-container").addClass("spiderman"); // Añade la clase CSS para que el grid se ajuste a la dificultad.
  $("#pieces-container").css("width","350px")
  generarSlots(); // Genera los slots para las piezas.
  comenzar(); // Inicia el juego.
};
/**
 * Configura la dificultad media.
 */
const medium=()=>{
  nCells = 25
  superHero = "iron-man"
  completadoClase = "ironman-completado" // Clase CSS que se le pondra al completar el puzzle.
  $("#puzzle-container").addClass("ironman") // Añade la clase CSS para que el grid se ajuste a la dificultad.
  generarSlots(); // Genera los slots para las piezas.
  comenzar(); // Inicia el juego.
}
/**
 * Configura la dificultad difícil.
 */
const hard=()=>{
  nCells = 49
  superHero = "venom"
  completadoClase = "venom-completado"
  $("#puzzle-container").addClass("venom")
  // Ajusta los tamaños del contenedor principal y el de piezas para un mejoir diseño.
  $(".container").css("max-width","1700px")
  $("#pieces-container").css("width","700px")
  generarSlots();
  comenzar();
}
/**
 * Inicia el juego, mostrando el puzzle y configurando las piezas, slots y temporizador.
 */
const comenzar=()=>{
  // Oculta el menú principal.
  $(".menu").css('display','none')
  // Muestra el contenedor del puzzle, las piezas y el temporizador.
  $("#puzzle-container").css('display','grid')
  $("#pieces-container").css('display','flex')
  $(".timer").css('display','block')
  // Inicia el temporizador.
  temporizador = setInterval(timer, 1000);
  // Genera las piezas y las funcionalidades para arrastrar y soltar.
  generarPiezas();
  piezas();
  slots();
  contenedorPiezas();
}
/**
 * Incrementa el temporizador cada segundo.
 */
const timer=()=>{
  seconds++ // Incrementa los segundos transcurridos.
  updateTimer() // Actualiza el texto del temporizador.
}
/**
 * Actualiza el texto del temporizador en el DOM.
 */
const updateTimer = () => {
  const minutes = Math.floor(seconds / 60); // Calcula los minutos.
  const segundosRestantes = seconds % 60; // Calcula los segundos restantes.
  // Formatea los minutos y segundos con ceros a la izquierda.
  const minutesText = minutes < 10 ? "0" + minutes : minutes; 
  const secondsText = segundosRestantes < 10 ? "0" + segundosRestantes : segundosRestantes;
  const timeText = minutesText + ":" + secondsText;
  // Actualiza el contenido del temporizador.
  $(".timer").text(timeText);
};
/**
 * Genera los slots del puzzle en el contenedor principal.
 */
const generarSlots=()=>{
  let container= $("#puzzle-container");
  for (let i = 1; i < nCells+1; i++) {
      // Crea un slot con un atributo de datos que identifica la pieza correcta.
      const slot =$(`<div class="slot" data-piece="${i}"></div>`);
      // Añade el slot al contenedor principal.
      $(container).append(slot);
  }
}
/**
 * Genera las piezas del puzzle en el contenedor de piezas.
 */
const generarPiezas=()=>{
    let pieces= $("#pieces-container");
    const nPiezas =[];
    // Crea una lista con los números de las piezas.
    for (let i = 1; i < nCells+1; i++) {
     nPiezas.push(i)
    }
    // Mezcla aleatoriamente las piezas.
    const nPiezasRandom = nPiezas.sort(() => Math.random() - 0.5);
    for (let i = 1; i < nCells+1; i++) {
        // Crea un elemento de pieza con una imagen correspondiente.
        const piece =$(`<div class='piece'></div>`);
        const image =$(`<img src='img/${superHero}${nPiezasRandom[i-1]}.jpg'></img>`);
        // Asocia el número de la pieza al elemento.
        $(piece).data("piece",nPiezasRandom[i-1])
        // Añade la imagen a la pieza y esta al contenedor de piezas.
        $(piece).append(image);
        $(pieces).append(piece);
    }
}
/**
 * Configura la funcionalidad draggable de las piezas.
 */
const piezas=()=>{
  $(".piece").draggable({
    revert: true, // Devolver la pieza a su posición inicial si no encaja.
    revertDuration: 250, // Duración de la animación de revert.
    containment: "body", // Limita el movimiento al body del documento.
    cursor: "grabbing", // Cambia el cursor al arrastrar.
    start: function(event, ui) {
      // Establece un z-index alto para la pieza que está siendo arrastrada
      $(this).css("z-index", 1000);
    },
    stop: function(event, ui) {
      // Restablece el z-index al finalizar el arrastre
      $(this).css("z-index", 0);
    }
  });
}
/**
 * Configura la funcionalidad droppable de los slots.
 */
const slots=()=>{
  $(".slot").droppable({
    accept: ".piece", // Solo acepta elementos con clase 'piece'.
    classes: {"ui-droppable-hover":"ui-state-highlight"},
    drop: function(event, ui) {

      if ($(this).children(".piece").length > 0) {
        return; // Si ya tiene una pieza, no permite más
      }

      const piezaDentro = ui.draggable;

      // Mover la pieza completa al slot
      $(this).append(piezaDentro.css({
        position: "relative",
        top: "0",
        left: "0"
      }));


      // Habilita nuevamente el arrastre para la pieza.
      piezaDentro.draggable({
        revert: true,
        containment: "body"
      });

      ganar(); // Verificar si se ha completado el puzzle;
    }
  });
}
/**
 * Configura el contenedor de piezas como un área droppable.
 * Permite devolver piezas al contenedor si no están en el lugar correcto.
 */
const contenedorPiezas=()=>{
  $("#pieces-container").droppable({
    accept: ".piece", // Solo acepta elementos con clase 'piece'.
    drop: function(event, ui) {

      const piezaDentro = ui.draggable;
      // Mover la pieza completa al slot
      $(this).prepend(piezaDentro.css({
        position: "relative",
        top: "0",
        left: "0"
      }));

      // Habilita nuevamente el arrastre para la pieza.
      piezaDentro.draggable({
        revert: true,
        containment: "body"
      });
      }
  });

}
/**
 * Verifica si el jugador ha ganado el juego.
 */
const ganar=()=>{
  let correcto = true; // Booleano para determinar si el puzzle está completado.
  
  $(".slot").each((index,element)=>{
    const primerHijo = $(element).children(); // Obtiene la pieza dentro del slot.
    // Verifica si la pieza en el slot coincide con el slot correspondiente.
    if (primerHijo.length>0 && $(element).data("piece") == primerHijo.data("piece")) {
      console.log('bien');
    } else{
      correcto = false; // Si hay un error, se marca como no completado.
      console.log('mal');
    }
  });

  if (correcto) {
    completado(); // Si todas las piezas están correctas, se llama a la función de completado.
  }
}
/**
 * Desactiva el arrastre de todas las piezas del puzzle.
 */
const desactivarPiezas=()=>{
  $('.piece').each((index,element)=>{
    $(element).draggable('destroy'); // Desactiva la funcionalidad draggable.
  })
}
/**
 * Maneja el estado al completar el puzzle.
 */
const completado=()=>{
  // Ajusta el diseño del contenedor y restaura las propiedades iniciales.
  $(".container").css("max-width","1200px")
  $("#pieces-container").css("width","550px")
  $("#puzzle-container").removeClass("venom spiderman ironman"); // Elimina clases anteriores.
  $("#puzzle-container").addClass(completadoClase); // Añade la clase del nivel completado.
  $(".slot").css('border', '0px'); // Elimina los bordes de los slots.
  desactivarPiezas(); // Desactiva el arrastre de todas las piezas.
  $("#pieces-container").css('display','none'); // Oculta el contenedor de piezas.
  // Detiene el temporizador.
  clearInterval(temporizador);
  temporizador =null;
  // Obtiene el tiempo transcurrido y muestra el mensaje de victoria.
  const tiempo = $(".timer").text()
  $(".timer").css('display','none') // Oculta el temporizador.
  // Añade un mensaje de victoria con el tiempo que se ha tardado en completar el puzzle.
  const mensaje =$(`<p>Completed!!<br>Your time was ${tiempo}</p>`);
  $(".win-message").append(mensaje)
  // Añade un botón para volver al menú principal.
  const volver =$(`<button class='back'>Go back to main menu</button>`);
  $(".win-message").append(volver)
  volver.on("click",reiniciar); // Configura el evento para reiniciar el juego.
  // Restablece el temporizador y los segundos.
  $(".timer").text('00:00')
  seconds = 0;
}
/**
 * Reinicia el juego, eliminando los elementos generados dinámicamente y restaurando el menú.
 */
const reiniciar=()=>{
  $(".win-message").empty(); // Limpia el mensaje de victoria.
  $("#puzzle-container").empty(); // Limpia el contenedor del puzzle.
  $("#puzzle-container").removeClass(completadoClase); // Elimina la clase de completado.
  $("#puzzle-container").css('display','none'); // Oculta el contenedor del puzzle.
  $(".menu").css('display','block'); // Muestra el menú principal.
}