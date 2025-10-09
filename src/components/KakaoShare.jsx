import React, { useEffect } from "react";
import "./KakaoShare.css";
import { Button } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

const KakaoShare = () => {
  useEffect(() => {
    // 카카오 SDK 초기화
    const initKakao = () => {
      const key = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
      if (!key || key === "YOUR_APP_KEY") {
        console.error("VITE_KAKAO_JAVASCRIPT_KEY가 설정되지 않았습니다.");
        return;
      }

      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(key);
      }
    };

    initKakao();
  }, []);

  const shareKakao = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      console.error("Kakao SDK가 초기화되지 않았습니다.");
      alert(
        "카카오톡 공유 기능을 사용할 수 없습니다. VITE_KAKAO_JAVASCRIPT_KEY를 확인해주세요.",
      );
      return;
    }

    window.Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: "강명준💗권소영 결혼합니다",
        description: "2025년 12월 6일 (금) 오후 12시\n페어몬트 앰배서더 서울 호텔",
        imageUrl: "https://ddo0ii.github.io/invitation/image/2536.jpg",
        link: {
          mobileWebUrl: "https://ddo0ii.github.io/invitation/",
          webUrl: "https://ddo0ii.github.io/invitation/",
        },
      },
      buttons: [
        {
          title: "길찾기",
          link: {
            mobileWebUrl: "https://naver.me/FZ2iObZY",
            webUrl: "https://naver.me/FZ2iObZY",
          },
        },
        {
          title: "초대장 보기",
          link: {
            mobileWebUrl: "https://ddo0ii.github.io/invitation/",
            webUrl: "https://ddo0ii.github.io/invitation/",
          },
        },
      ],
    });
  };

  return (
    <Button variant="outlined" startIcon={<ShareIcon />} onClick={shareKakao}>
      카카오톡으로 공유하기
    </Button>
    // <button className="kakao-share-btn" onClick={shareKakao}>
    //   <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    //     <path
    //       d="M10 0C4.477 0 0 3.523 0 7.857c0 2.76 1.582 5.2 4.023 6.6-.1-.9-.2-2.3.042-3.3.22-.9 1.4-5.4 1.4-5.4s-.36-.7-.36-1.7c0-1.6.93-2.8 2.09-2.8.98 0 1.46.74 1.46 1.6 0 .99-.63 2.5-.95 3.9-.27 1.1.56 2 1.66 2 1.99 0 3.52-2.1 3.52-5.1 0-2.7-1.94-4.6-4.71-4.6-3.21 0-5.09 2.4-5.09 4.9 0 .97.37 2.01.84 2.57.09.11.1.21.08.32-.09.37-.29 1.16-.33 1.32-.05.21-.17.26-.4.16-1.48-.69-2.4-2.87-2.4-4.62 0-3.77 2.74-7.24 7.9-7.24 4.15 0 7.37 2.96 7.37 6.92 0 4.12-2.6 7.44-6.21 7.44-1.21 0-2.36-.63-2.75-1.38l-.75 2.86c-.27 1.04-1 2.35-1.49 3.15C8.57 19.5 9.27 20 10 20c5.523 0 10-3.523 10-7.857S15.523 0 10 0z"
    //       fill="#3C1E1E"
    //     />
    //   </svg>
    //   카카오톡으로 공유하기
    // </button>
  );
};

export default KakaoShare;
