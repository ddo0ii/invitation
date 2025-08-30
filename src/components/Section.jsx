import { Box, Container, Typography } from '@mui/material'

function Section({ id, title, subtitle, children, bg = 'transparent', py = 10 }) {
  return (
    <Box id={id} component="section" sx={{ backgroundColor: bg, py }}>
      <Container>
        {(title || subtitle) && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            {title && (
              <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="subtitle1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
        {children}
      </Container>
    </Box>
  )
}

export default Section


