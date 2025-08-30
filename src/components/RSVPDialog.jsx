import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import appConfig from '../app.config'

const HIDE_KEY = 'rsvp.hideUntil'
const SUBMIT_KEY = 'rsvp.submissions'

function getStoredSubmissions() {
  try {
    const raw = localStorage.getItem(SUBMIT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function storeSubmission(entry) {
  const list = getStoredSubmissions()
  list.unshift({ ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() })
  localStorage.setItem(SUBMIT_KEY, JSON.stringify(list))
}

async function sendToSheet(entry) {
  const endpoint = import.meta.env.VITE_RSVP_ENDPOINT
  if (!endpoint) return { ok: false, skipped: true }
  const body = new URLSearchParams({
    side: entry.side,
    name: entry.name,
    count: String(entry.count ?? ''),
    companion: entry.companion || '',
    meal: entry.meal || '',
    ua: navigator.userAgent,
  })
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    mode: 'no-cors',
  })
  // no-cors 경우 상태 확인 불가 → 전송 시도만 수행
  return { ok: true }
}

function shouldShowDialog() {
  const hideUntil = Number(localStorage.getItem(HIDE_KEY) || 0)
  return Date.now() > hideUntil
}

function setHideForOneDay(checked) {
  if (checked) {
    const oneDay = 24 * 60 * 60 * 1000
    localStorage.setItem(HIDE_KEY, String(Date.now() + oneDay))
  } else {
    localStorage.removeItem(HIDE_KEY)
  }
}

function RSVPDialog() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('intro') // intro | form
  const [hideToday, setHideToday] = useState(false)

  const [side, setSide] = useState('groom')
  const [name, setName] = useState('')
  const [count, setCount] = useState('1')
  const [companion, setCompanion] = useState('')
  const [meal, setMeal] = useState('예정')

  const dateLabel = useMemo(() => {
    const date = new Date(appConfig.site.dateTime)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: '2-digit',
    })
  }, [])

  useEffect(() => {
    if (shouldShowDialog()) setOpen(true)
  }, [])

  const handleClose = () => {
    setHideForOneDay(hideToday)
    setOpen(false)
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('성함을 입력해 주세요.')
      return
    }
    const entry = {
      side,
      name: name.trim(),
      count: Number(count) || 1,
      companion: companion.trim(),
      meal,
    }
    storeSubmission(entry)
    try {
      await sendToSheet(entry)
    } catch (e) {
      console.error(e)
    }
    alert('참석 의사가 전달되었습니다. 감사합니다!')
    setHideForOneDay(true)
    setOpen(false)
  }

  if (!open) return null

  return (
    <Dialog open onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        {step === 'intro' ? '참석 의사 전달' : '참석 의사 전달'}
        <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {step === 'intro' ? (
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography>
              축하의 마음으로 참석해주시는 모든 분들을 귀하게 모실 수 있도록 참석 의사를 전달 부탁드립니다.
            </Typography>
            <Box sx={{ width: '100%', borderTop: '1px solid #eee' }} />
            <Stack spacing={0.5}>
              <Typography fontWeight={700}>
                신랑 {appConfig.couple.groom.name} & 신부 {appConfig.couple.bride.name}
              </Typography>
              <Typography>{dateLabel}</Typography>
              <Typography>
                {appConfig.site.address} {appConfig.site.venue}
              </Typography>
            </Stack>
            <Button variant="contained" size="large" onClick={() => setStep('form')} sx={{ mt: 1 }}>
              참석 의사 전달하기
            </Button>
            <FormControlLabel
              control={<Checkbox checked={hideToday} onChange={(e) => setHideToday(e.target.checked)} />}
              label="오늘 하루 보지 않기"
            />
          </Stack>
        ) : (
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography sx={{ width: 80 }}>구분</Typography>
              <ToggleButtonGroup value={side} exclusive onChange={(e, v) => v && setSide(v)}>
                <ToggleButton value="groom">신랑측</ToggleButton>
                <ToggleButton value="bride">신부측</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography sx={{ width: 80 }}>성함</Typography>
              <TextField fullWidth value={name} onChange={(e) => setName(e.target.value)} placeholder="성함" />
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography sx={{ width: 80 }}>참석인원</Typography>
              <TextField
                type="number"
                inputProps={{ min: 1 }}
                value={count}
                onChange={(e) => setCount(e.target.value)}
                fullWidth
                placeholder="본인 포함 총 참석인원"
              />
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography sx={{ width: 80 }}>동행인</Typography>
              <TextField fullWidth value={companion} onChange={(e) => setCompanion(e.target.value)} placeholder="함께 오시는 분 성함" />
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography sx={{ width: 80 }}>식사여부</Typography>
              <RadioGroup row value={meal} onChange={(e) => setMeal(e.target.value)}>
                <FormControlLabel value="예정" control={<Radio />} label="예정" />
                <FormControlLabel value="안함" control={<Radio />} label="안함" />
                <FormControlLabel value="미정" control={<Radio />} label="미정" />
              </RadioGroup>
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        {step === 'intro' ? (
          <Button onClick={handleClose}>닫기</Button>
        ) : (
          <Stack direction="row" spacing={1} sx={{ px: 2, pb: 2, width: '100%', justifyContent: 'space-between' }}>
            <Button onClick={() => setStep('intro')}>뒤로</Button>
            <Button variant="contained" onClick={handleSubmit}>
              참석 의사 전달하기
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default RSVPDialog


