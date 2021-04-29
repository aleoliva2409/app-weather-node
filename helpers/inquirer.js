require('colors')
const inquirer = require('inquirer')

const preguntas = [
  {
    type: 'list',
    name: 'opcion',
    message: '¿Qué deseas hacer?',
    choices: [ 
      {
        value: 1,
        name: `${'1.'.green} Buscar ciudad`
      },
      {
        value: 2,
        name: `${'2.'.green} Historial`
      },
      {
        value: 0,
        name: `${'0.'.green} Salir`
      }
    ]
  }
]

const inquirerMenu = async() => {
  console.clear();
  console.log("===================================".green);
  console.log("      Seleccione una opción".white);
  console.log("===================================\n".green);

  //* con destructuring
  const {opcion} = await inquirer.prompt(preguntas)

  return opcion
}

const pausa = async() => {

  const question = [
    {
      type: "input",
      name: "pausa",
      message: `Presione ${"Enter".green} para continuar`
    }
  ];

  //* aca no guardamos el valor de inquirer ya que solo es para pausar la consola
  await inquirer.prompt(question)
}

const leerInput = async(message) => {

  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if(value.length === 0) {
          return 'Por favor ingrese un valor'
        }
        return true
      }
    }
  ]

  //? inquirer prompt devuelve un objeto 
  //* sin destructuring
  const description = await inquirer.prompt(question);
  
  // console.log(description.desc)

  return description.desc
}

const listarLugares = async(lugares = []) => {
  const choices = lugares.map((lugar,i) => {

    const id = `${i+1}.`.green

    return {
      value: lugar.id,
      name: `${id} ${lugar.nombre}`
    }
  })

  choices.unshift({
    value: '0',
    name: '0. '.green + 'Cancelar'
  })

  const preguntas = [
    {
      type: 'list',
      name: 'id',
      message: 'Selecione lugar:',
      choices
    }
  ]

  const {id} = await inquirer.prompt(preguntas)
  return id
}

const confirmar = async(message) => {
  const question = [
    {
      type: 'confirm',
      name: 'ok',
      message
    }
  ]

  const {ok} = await inquirer.prompt(question)

  return ok
}

const mostrarListadoCheckList = async (tareas = []) => {
  const choices = tareas.map((tarea, i) => {
    const id = `${i + 1}.`.green;

    return {
      value: tarea.id,
      name: `${id} ${tarea.desc}`,
      checked: tarea.completadoEn ? true : false
    };
  });

  
  const pregunta = [
    {
      type: "checkbox",
      name: "ids",
      message: "Selecciones",
      choices,
    },
  ];

  const { ids } = await inquirer.prompt(pregunta);
  return ids;
};



module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
  confirmar,
  mostrarListadoCheckList
}