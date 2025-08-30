// 사이트 기본 정보 및 복사 가능한 데이터 분리
const appConfig = {
  site: {
    title: 'OUR WEDDING',
    dateTime: '2025-06-21T11:00:00+09:00',
    venue: '로프트가든344 10층',
    address: '서울 양천구 오목로 344',
  },
  couple: {
    groom: { name: '유지환', father: '유창열', mother: '하세원' },
    bride: { name: '안하은', father: '안진수', mother: '김현영' },
  },
  verse: {
    ref: 'John 13:34',
    lines: [
      '새 계명을 너희에게 주노니 서로 사랑하라',
      '내가 너희를 사랑한 것 같이 너희도 서로 사랑하라',
    ],
  },
  transport: {
    subway: '5호선 오목교역 7번 출구 (도보 1분)',
    parking: [
      '전용주차장: 서울 양천구 오목로 344, 청학빌딩 (2시간 무료)',
      '공영주차장: 서울 양천구 목동동로 298 (3시간 무료, 도보 8분)',
    ],
    train: [
      '기차 후 택시: 영등포역 3번출구 → 투썸플레이스 앞 택시(8분)',
      '기차 후 버스: 영등포역 3번출구 → 경방타임스퀘어 정류장 → 오목교역(6640B, 6628, 6630)(20분)',
    ],
    mapLinks: {
      naver: 'https://naver.me/5ojUMFJP',
      kakaoNavi: 'kakaonavi://navigate?name=로프트가든344&x=126.872&y=37.525',
      tmap: 'tmap://search?name=로프트가든344',
    },
  },
  accounts: {
    groomSide: [
      { label: '아버지 유창열', bank: '농협', number: '485058-52-169858' },
      { label: '신랑 유지환', bank: '국민은행', number: '012502-04-588075' },
    ],
    brideSide: [
      { label: '아버지 안진수', bank: '우리은행', number: '080-151155-02-001' },
      { label: '신부 안하은', bank: '카카오뱅크', number: '3333-28-1837834' },
    ],
  },
  gallery: {
    images: [
      '/image/1178.jpg',
      '/image/1829.jpg',
      '/image/1861.jpg',
      '/image/2002.jpg',
      '/image/2028.jpg',
      '/image/2078.jpg',
      '/image/2164.jpg',
      '/image/2483.jpg',
      '/image/2536.jpg',
      '/image/2655.jpg',
      '/image/2917.jpg',
      '/image/3328.jpg',
      '/image/3488.jpg',
    ],
  },
}

export default appConfig


