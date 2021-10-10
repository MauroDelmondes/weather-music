import type { NextPage } from 'next'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useRef, useState } from 'react'
import { openWeather, shazam } from '../service/api'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { CardActionArea, InputAdornment } from '@mui/material'
import Grid from '@mui/material/Grid'
import { AiOutlineCloud } from 'react-icons/ai'
import { useRouter } from 'next/router'
import {v4 as uuid} from 'uuid'

interface IWeather {
  coord: {
    lon: number
    lat: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}
interface IShazam {
  tracks: {
    hits: {
      track: {
        layout: string
        type: string
        key: string
        title: string
        subtitle: string
        share: {
          subject: string
          text: string
          href: string
          image: string
          twitter: string
          html: string
          avatar: string
          snapchat: string
        }
        url: string
      }
    }[]
  }
}
interface IToast {
  severity: 'error' | 'info' | 'success' | 'warning'
}
const Home: NextPage = () => {
  const { push } = useRouter()
  const inputValue: any = useRef(null)
  const [toastInfo, setToastInfo] = useState({
    message: 'not message',
    severity: 'success',
    open: false,
  })
  const [weatherData, setWeatherData] = useState<IWeather>()
  const [shazamData, setShazamData] = useState<IShazam>()

  async function handleFetchApi() {
    if (inputValue) {
      setToastInfo({
        message: 'buscando cidade',
        open: true,
        severity: 'info',
      })
      const { value } = inputValue.current
      try {
        const response = await openWeather.get<IWeather>(
          `?q=${value}&units=metric&appid=6544ca0e50a910ba1fd6e3c0275895c9`
        )
        setWeatherData(response.data)
        getPLaylistShazam(convertTempToTerm(response.data.main.temp))
      } catch (error) {
        setToastInfo({
          message: 'Erro ao buscar endereço',
          open: true,
          severity: 'warning',
        })
      }
    }
  }

  async function getPLaylistShazam(term: string) {
    const response = await shazam.get(`search`, {
      params: {
        term,
      },
    })
    setShazamData(response.data)
  }

  function convertTempToTerm(temp: number): string {
    if (temp < 16) {
      return 'lofi'
    }
    if (temp < 24 && temp > 16) {
      return 'classica'
    }
    if (temp < 32 && temp > 24) {
      return 'pop'
    }
    return 'rock'
  }

  async function handleSavePLaylist() {
    const getAnotherItemFromLocal: any =
      window.localStorage.getItem('playlist') || '[]'
    const treatDataToSave: any = {
      ...shazamData,
      city: weatherData?.name,
      temp: weatherData?.main.temp,
      data: new Date(),
      id: uuid()
    }
    const data = JSON.parse(getAnotherItemFromLocal)
    window.localStorage.setItem(
      'playlist',
      JSON.stringify([...data, treatDataToSave])
    )
    setToastInfo({
      message: 'playlist salva com sucesso!',
      open: true,
      severity: 'success',
    })
  }

  return (
    <>
      <Box margin={4}>
        <Grid container spacing={2} xs={12}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size='small'
              placeholder='Cidade'
              inputRef={inputValue}
            />
          </Grid>
          <Grid item>
            <Button onClick={handleFetchApi} variant='contained'>
              Pesquisar
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={() => push('/playlist')} variant='outlined'>
              playlist salva
            </Button>
          </Grid>
        </Grid>
        {!!shazamData && (
          <Grid
            container
            justifyContent='space-between'
            style={{ marginTop: '20px' }}
            xs={12}
          >
            <Grid item alignContent='center' xs={10}>
              <Typography variant='subtitle1' color='GrayText'>
                <AiOutlineCloud /> {weatherData?.name}
              </Typography>
              <Typography variant='h2'>{weatherData?.main.temp} º</Typography>
            </Grid>
            <Grid item alignContent='center'>
              <Button
                disabled={!inputValue}
                onClick={handleSavePLaylist}
                variant='contained'
              >
                Salvar playlist
              </Button>
            </Grid>
            {!!shazamData ? (
              shazamData?.tracks.hits.map((item) => {
                return (
                  <>
                    <Grid item xs={2}>
                      <Card variant='outlined'>
                        <CardActionArea>
                          <CardMedia
                            component='img'
                            height='200'
                            width='200'
                            image={item.track.share.image}
                            alt='green iguana'
                          />
                          <CardContent>
                            <Typography
                              noWrap
                              gutterBottom
                              variant='h5'
                              component='div'
                            >
                              {item.track.title}
                            </Typography>
                            <Typography
                              noWrap
                              variant='body2'
                              color='text.secondary'
                            >
                              {item.track.subtitle}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  </>
                )
              })
            ) : (
              <Typography>Sem playlist para mostrar</Typography>
            )}
          </Grid>
        )}
      </Box>
      <Snackbar open={toastInfo.open} autoHideDuration={6000}>
        <Alert
          onClose={() => setToastInfo({ ...toastInfo, open: false })}
          severity={toastInfo.severity as any}
          sx={{ width: '100%' }}
        >
          {toastInfo.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Home
