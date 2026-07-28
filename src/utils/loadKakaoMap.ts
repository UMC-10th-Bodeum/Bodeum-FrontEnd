let kakaoMapPromise: Promise<void> | null = null;

export function loadKakaoMap(): Promise<void> {
  if (window.kakao?.maps) {
    return Promise.resolve();
  }

  if (kakaoMapPromise) {
    return kakaoMapPromise;
  }

  kakaoMapPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");

    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_MAP_KEY
      }&autoload=false&libraries=services`;

    script.async = true;

    script.onload = () => {
      console.log("SDK loaded");
      window.kakao.maps.load(() => {
        console.log("maps.load 완료");
        resolve();
      });
    };

    script.onerror = () => {
      kakaoMapPromise = null;
      reject(new Error("카카오맵 SDK 로드 실패"));
    };
    document.head.appendChild(script);
  });

  return kakaoMapPromise;
};