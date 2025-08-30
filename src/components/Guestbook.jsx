import { useEffect, useMemo, useState } from 'react'
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

const STORAGE_KEY = 'guestbook-items'

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function Guestbook() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [content, setContent] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(loadItems())
  }, [])

  useEffect(() => {
    saveItems(items)
  }, [items])

  const canSubmit = useMemo(() => name.trim() && password.trim() && content.trim(), [name, password, content])

  const handleSubmit = () => {
    if (!canSubmit) return
    const newItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      password: password,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    }
    setItems([newItem, ...items])
    setName('')
    setPassword('')
    setContent('')
  }

  const handleDelete = (id) => {
    const pw = prompt('비밀번호를 입력하세요')
    if (pw == null) return
    const item = items.find((i) => i.id === id)
    if (!item) return
    if (item.password !== pw) {
      alert('비밀번호가 일치하지 않습니다')
      return
    }
    setItems(items.filter((i) => i.id !== id))
  }

  return (
    <Stack spacing={2}>
      <Typography>따뜻한 마음으로 축복해 주세요</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <TextField label="성함" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        <TextField label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
      </Stack>
      <TextField label="내용" value={content} onChange={(e) => setContent(e.target.value)} multiline minRows={3} fullWidth />
      <Box textAlign="right">
        <Button variant="contained" disabled={!canSubmit} onClick={handleSubmit}>
          제출하기
        </Button>
      </Box>

      <Stack spacing={1}>
        {items.map((i) => (
          <Stack key={i.id} direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ border: '1px solid #eee', borderRadius: 1, p: 2 }}>
            <Stack>
              <Typography variant="subtitle2">{i.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(i.createdAt).toLocaleString('ko-KR')}
              </Typography>
              <Typography sx={{ mt: 1 }}>{i.content}</Typography>
            </Stack>
            <IconButton color="error" onClick={() => handleDelete(i.id)}>
              <DeleteOutlineIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}

export default Guestbook


