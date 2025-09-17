import { Box, Typography } from '@mui/material'

function Section({ id, title, subtitle, children, bg = 'transparent' }) {
  return (
    <Box id={id} component="section" className="section" sx={{ backgroundColor: bg }}>
      <Box className="section-inner">
        {(title || subtitle) && (
          <Box>
            {title && (
              <Typography component="h2" className="section-title">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography className="section-subtitle">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
        {children}
      </Box>
    </Box>
  )
}

export default Section


