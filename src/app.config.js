// 사이트 기본 정보 및 복사 가능한 데이터 분리
const appConfig = {
  site: {
    title: "OUR WEDDING",
    dateTime: "2025-12-06T12:00:00+09:00",
    venue: "페어몬트 앰배서더 서울",
    address: "서울 영등포구 여의대로 108",
    mapAddress: "서울 영등포구 여의대로 108 페어몬트 앰배서더 서울 호텔",
  },
  couple: {
    groom: { name: "강명준", father: "강복진", mother: "김금산" },
    bride: { name: "권소영", father: "권용덕", mother: "이선애" },
  },
  verse: {
    ref: "John 13:34",
    lines: [
      "새 계명을 너희에게 주노니 서로 사랑하라",
      "내가 너희를 사랑한 것 같이 너희도 서로 사랑하라",
    ],
  },
  transport: {
    subway: [
      "5·9호선 여의도역",
      "(역에서 파크원까지 지하 보행자 통로 연결)",
      "5호선 여의나루역 (1번 출구에서 도보 약 7분)",
    ],
    parking: ["호텔 주차장 4시간 이용 가능", "축의금 접수대에서 주차권 수령"],
    bus: [
      "여의도역",
      "간선: 153, 162, 261, 262, 362, 462, 503, 753",
      "지선: 5012, 5623, 6513",
      "광역: M7625, 7007-1",
      "좌석: 5601, 700",
      "여의도 환승센터",
      "간선: 160, 162, 260, 261, 262, 360, 662, N61",
      "지선: 5012, 5615, 5618, 5623, 6513, 6649",
      "광역: 8600, 8601",
    ],
    etc: ["여의도 현대백화점 1층 Gate 4번 출구 연결"],
    // 좌표가 있으면 바로 사용하고, 없으면 주소로 지오코딩합니다.
    coords: { lat: 37.525, lng: 126.872 },
    mapLinks: {
      naver: "https://naver.me/5ojUMFJP",
      kakaoNavi: "kakaonavi://navigate?name=로프트가든344&x=126.872&y=37.525",
      tmap: "tmap://search?name=로프트가든344",
    },
  },
  accounts: {
    groomSide: [
      { label: "아버지 강복진", bank: "농협", number: "485058-52-169858" },
      { label: "어머니 김금산", bank: "농협", number: "485058-52-169858" },
      { label: "신랑 강명준", bank: "국민은행", number: "012502-04-588075" },
    ],
    brideSide: [
      { label: "아버지 권용덕", bank: "우리은행", number: "080-151155-02-001" },
      { label: "어머니 이선애", bank: "우리은행", number: "080-151155-02-001" },
      { label: "신부 권소영", bank: "카카오뱅크", number: "3333-28-1837834" },
    ],
  },
  gallery: {
    images: [
      "/image/1178.jpg",
      "/image/1829.jpg",
      "/image/1861.jpg",
      "/image/2002.jpg",
      "/image/2028.jpg",
      "/image/2078.jpg",
      "/image/2164.jpg",
      "/image/2483.jpg",
      "/image/2536.jpg",
      "/image/2655.jpg",
      "/image/2917.jpg",
      "/image/3328.jpg",
      "/image/3488.jpg",
    ],
  },
};

export default appConfig;
