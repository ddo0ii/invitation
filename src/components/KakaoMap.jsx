import { useEffect, useRef, useState } from 'react'

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existed = document.querySelector(`script[src="${src}"]`)
    if (existed) {
      existed.addEventListener('load', resolve)
      if (window.kakao && window.kakao.maps) resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function KakaoMap({ lat, lng, address, level = 3, markerText }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const key = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY
    if (!key) {
      setError('Kakao JavaScript Key가 설정되지 않았습니다 (VITE_KAKAO_JAVASCRIPT_KEY).')
      return
    }
    const src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false&libraries=services`
    loadScript(src)
      .then(() => {
        window.kakao.maps.load(() => {
          const init = (center) => {
            const options = { center, level }
            const map = new window.kakao.maps.Map(containerRef.current, options)
            const marker = new window.kakao.maps.Marker({ position: center })
            marker.setMap(map)
            if (markerText) {
              const iw = new window.kakao.maps.InfoWindow({ content: `<div style=\"padding:6px 8px;\">${markerText}</div>` })
              iw.open(map, marker)
            }
          }

          if (address) {
            const geocoder = new window.kakao.maps.services.Geocoder()
            geocoder.addressSearch(address, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK && result[0]) {
                const y = parseFloat(result[0].y)
                const x = parseFloat(result[0].x)
                init(new window.kakao.maps.LatLng(y, x))
              } else if (lat && lng) {
                init(new window.kakao.maps.LatLng(lat, lng))
              } else {
                setError('주소 지오코딩에 실패했습니다.')
              }
            })
          } else if (lat && lng) {
            init(new window.kakao.maps.LatLng(lat, lng))
          } else {
            setError('좌표 또는 주소가 필요합니다.')
          }
        })
      })
      .catch(() => setError('Kakao SDK 로드에 실패했습니다. 네트워크 상태를 확인하세요.'))
  }, [lat, lng, address, level, markerText])

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>
  }
  return <div ref={containerRef} style={{ width: '100%', height: 320, borderRadius: 8, overflow: 'hidden' }} />
}

export default KakaoMap


