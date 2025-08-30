import { useState } from 'react'
// import Grid from '@mui/material/Grid2'
import { Box, Button, Grid } from '@mui/material'
import appConfig from '../app.config'

function Gallery() {
  const [expanded, setExpanded] = useState(false)
  const images = appConfig.gallery.images
  const visible = expanded ? images : images.slice(0, 6)

  return (
    <Box>
      <Grid container spacing={1}>
        {visible.map((src, idx) => (
          <Grid key={src + idx} xs={6} sm={4}>
            <Box component="img" src={src} alt="gallery" sx={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 1 }} />
          </Grid>
        ))}
      </Grid>
      {images.length > 6 && (
        <Box textAlign="center" mt={2}>
          <Button variant="outlined" onClick={() => setExpanded((v) => !v)}>
            {expanded ? '사진 접기' : '사진 더 보기'}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Gallery


