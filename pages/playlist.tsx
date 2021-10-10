import { Button, CardActionArea } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
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
  id: string
  city: string
  temp: number
  data: Date
}
const Playlist = () => {
  const [playlist, setPlaylist] = useState<IShazam[]>()
  const { back } = useRouter()

  useEffect(() => {
    const items: any = window.localStorage.getItem('playlist')
    setPlaylist(JSON.parse(items))
  }, [])
  function handleRemove(id: string) {
    const confirm = window.confirm('tem certeza que deseja deletar este item?')
    if (confirm) {
      const filteredData = playlist?.filter((item) => item.id !== id)
      setPlaylist(filteredData)
      window.localStorage.setItem('playlist', JSON.stringify(filteredData))
    }
  }
  return (
    <>
      <Box margin={4}>
        <Grid container spacing={2} xs={12}>
          <Button variant='outlined' onClick={() => back()}>
            Voltar
          </Button>

          {!!playlist &&
            playlist.map((item) => (
              <Grid
                key={item.id}
                container
                justifyContent='space-between'
                style={{ marginTop: '20px' }}
                xs={12}
              >
                <Grid item alignContent='center' xs={11}>
                  <Typography variant='subtitle1' color='GrayText'>
                    {item?.city} | {format(new Date(item?.data), 'dd/MM/yyyy')}
                  </Typography>
                  <Typography variant='h2'>{item?.temp} º</Typography>
                </Grid>
                <Grid item alignContent='center'>
                  <Button
                    variant='outlined'
                    color='error'
                    onClick={() => handleRemove(item.id)}
                  >
                    remover
                  </Button>
                </Grid>
                {!!item ? (
                  item?.tracks.hits.map((item) => {
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
            ))}
        </Grid>
      </Box>
    </>
  )
}

export default Playlist
