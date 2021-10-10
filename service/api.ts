import axios from "axios";

export const openWeather = axios.create({
    baseURL: `https://api.openweathermap.org/data/2.5/weather`
})

export const shazam = axios.create({
    baseURL: `https://shazam.p.rapidapi.com/`, 
    headers: {
        'x-rapidapi-host': 'shazam.p.rapidapi.com',
        'x-rapidapi-key': 'dd7a93289cmsh5a9cc7b860d1b06p1e134cjsn78c3f67c1ff6'
}
})