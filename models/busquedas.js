const fs = require('fs');
const axios = require('axios');

class Busquedas {
  constructor(){
    this.historial = []
    this.dbPath = './db/database.json'
    this.leerDB()
  }


  get paramsMapbox(){
    return {
      'access_token': process.env.MAPBOX_KEY,
      'limit': 5,
      'language': "es",
    };
  }

  get paramsOpenWeather(){
    return {
      appid: process.env.OPEN_WEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  get historialCapitalizado(){
    return this.historial.map(lugar => {
      let palabras = lugar.split(' ');
      palabras = palabras.map(palabra => palabra[0].toUpperCase() + palabra.substring(1))

      return palabras.join(' ')
    })
  }

  async ciudad(lugar = '') {

    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox
      });

      const resp = await instance.get()

      return resp.data.features.map(lugar => ({
        id: lugar.id,
        nombre: lugar.place_name,
        long: lugar.center[0],
        lat: lugar.center[1]
      }))
    } catch (error) {
      return []
    }
  }

  async climaLugar(lat,lon){
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: {...this.paramsOpenWeather,lat,lon}
      });

      const resp = await instance.get()
      return {
        desc: resp.data.weather[0].description,
        min: resp.data.main.temp_min + '°C',
        max: resp.data.main.temp_max + '°C',
        temp: resp.data.main.temp + '°C'
      }

    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugar = '') {

    if(this.historial.includes(lugar.toLocaleLowerCase())) return

    this.historial = this.historial.splice(0,5)

    this.historial.unshift(lugar.toLocaleLowerCase());
  
    this.guardarDB()
  }
  
  guardarDB(){
    
    const payload = {
      historial: this.historial
    }
    fs.writeFileSync(this.dbPath,JSON.stringify(payload))
  }
  
  leerDB(){
    if(!fs.existsSync(this.dbPath)) return

    const info = fs.readFileSync(this.dbPath,{encoding:'utf8'});
    const data = JSON.parse(info)
    this.historial = data.historial
  }
}

module.exports = Busquedas