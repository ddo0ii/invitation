import { Box, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

function Section({ id, title, subtitle, children, bg = 'transparent' }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <Box 
      ref={sectionRef}
      id={id} 
      component="section" 
      className={`section ${isVisible ? 'fade-in' : 'fade-out'}`} 
      sx={{ backgroundColor: bg }}
    >
      <Box className="section-inner">
        {(title || subtitle) && (
          <Box className={`fade-in-delay ${isVisible ? 'fade-in' : ''}`}>
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
        <Box className={`fade-in-delay-2 ${isVisible ? 'fade-in' : ''}`}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Section


