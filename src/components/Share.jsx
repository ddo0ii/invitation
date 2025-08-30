import { Button, Stack } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

function Share() {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('링크가 복사되었습니다.')
    } catch (e) {
      console.error(e)
      alert('복사에 실패했습니다.')
    }
  }

  const handleKakao = () => {
    alert('카카오톡 공유는 추후 연동 예정입니다.')
  }

  return (
    <Stack direction="row" spacing={1} justifyContent="center">
      <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={handleCopy}>
        링크 복사하기
      </Button>
      <Button variant="outlined" onClick={handleKakao}>카카오톡 공유</Button>
    </Stack>
  )
}

export default Share


