require('dotenv').config();
require('colors')

const { green } = require('colors');
const {leerInput, inquirerMenu, pausa, listarLugares} = require('./helpers/inquirer')
const Busquedas = require('./models/busquedas')
const main = async() => {

  let opt
  const busquedas = new Busquedas()

  do {
    opt = await inquirerMenu()
    
    // console.log(opt);

    switch (opt) {
      case 1:
        //Mostrar mensaje
        const lugar = await leerInput('Ciudad: ')
        const lugares = await busquedas.ciudad(lugar)
        const id = await listarLugares(lugares)
        if(id === '0') continue
        const lugarSelec = lugares.find(l => l.id === id)
        busquedas.agregarHistorial(lugarSelec.nombre)
        const clima = await busquedas.climaLugar(lugarSelec.lat,lugarSelec.long)

        console.clear()
        console.log('\nInformacion de la ciudad\n'.green)
        console.log('Ciudad:', green(lugarSelec.nombre));
        console.log('Lat:', lugarSelec.lat);
        console.log('Long:', lugarSelec.long);
        console.log('Temperatura:', clima.temp);
        console.log('Minima:', clima.min);
        console.log('Maxima:', clima.max);
        console.log(clima.desc);
        console.log('\n');

        break;
      case 2:
        busquedas.historialCapitalizado.forEach((lugar,i) => {
          const idx = `${i+1}.`.green
          console.log(`${idx} ${lugar}`);
        })
        break;
      default:
        break;
    }


    if(opt !== 0) await pausa()

  } while (opt !== 0);
}

main();

// console.log(process.env);