function App() {
  /**
   * Como no quiero hacer varias paginas, y ademas guardar datos sin archivo local, creo que debo usar firebase
   * AREAS: 
   *  REVELACIÓN DE SEXO:
   *    - AREA DE VOTANTES NIÑA (ICON Y CONTADOR) AL HACER HOVER ESTE MUESTRA EL NOMBRE DE LA PERSONA
   *    - AREA DE VOTANTES NIÑO (ICON Y CONTADOR) AL HACER HOVER ESTE MUESTRA EL NOMBRE DE LA PERSONA
   *    - AREA VOTO (SOLICITA REGISTRO CON GOOGLE PARA UN SOLO VOTO, PUEDE CAMBIAR EL VOTO)
   *    - AREA CENTRAL CON CONTADOR REGRESIVO Y CUANDO SE REVELA EL SEXO ESTE VOLVERÁ A CONTAR 5 SEGUNDOS Y MUESTRA EL SEXO.
   *    - AL TENER RESULTADOS SE MARCA CON COLOR VERDE QUIENES ACERTARON.
   *  ACTIVIDAD DEL BEBE - MADRE - PADRE:
   *    - PARA ESCRIBIR ALGO PIDE CÓDIGO, seleccionas de quien es la actividad, y dejas un mensaje, se marcara automáticamente la semana en la que esta, se puede escribir semanas anteriores.
   *    - CHAT CENTRAL CON NOMBRE E ICONO PAPA, MAMA, BEBE Y LA ACTIVIDAD. SIMPLE
   *  ACTIVIDAD NOMBRES PARA EL BEBE:
   *    - NECESITAS TENER USUARIO GOOGLE, PARA PONER UNO O VARIOS NOMBRES, ESTOS FLOTARAN JUNTO A LOS DEMÁS NOMBRES
   *  ACTIVIDAD DESCUBRE MI NOMBRE
   *   - SE MUESTRA SEGÚN EL SEXO YA REVELADO COMO EL JUEGO DEL AHORCADO, DONDE CADA UNO ESCOGE UNA LETRA, SI LA LETRA ES ACERTADA SE PONDRÁ DEBAJO DE LA LETRA ACERTADA
   *   LA PERSONA QUE TENGA MAS ACIERTOS GANARA, ES UN PREMIO POR CADA NOMBRE.
   *  NAV SUPERIOR FIJO:
   *  - FECHA DE PARTO CUANTOS DÍAS FALTAN.
   *  - TIEMPO EN MESES Y SEMANAS Y DÍAS  QUE LLEVA EL BEBE.
   *  REVELADORA:
   *   - BLOQUEADO HASTA EL DIA DE LA REVELACIÓN
   *   - AL DESBLOQUEAR PIDE EL TOKEN NUMÉRICO QUE SE ENVÍA AL TELEGRAM.
   *   - UNA VEZ CORRECTO SE DESBLOQUEA LA REVELACIÓN Y DEBE SELECCIONAR CUAL ES Y PRESIONAR REVELAR.
   */


  return (
    <>
      
      <h1 className="text-3xl font-bold">Hola Mundo!</h1>
    </>
  )
}

export default App
