import { useEffect, useRef } from "react";
import { loadKakaoMap } from "@/utils/loadKakaoMap";

interface KakaoMapProps {
  address: string;
}

export default function KakaoMap({ address }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let marker: kakao.maps.Marker | null = null;

    const initMap = async () => {
      await loadKakaoMap();

      if (!mapRef.current) return;

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result, status) => {
        if (status !== window.kakao.maps.services.Status.OK || !result.length)
          return;

        const position = new window.kakao.maps.LatLng(
          Number(result[0].y),
          Number(result[0].x)
        );

        const map = new window.kakao.maps.Map(mapRef.current!, {
          center: position,
          level: 3,
        });

        marker = new window.kakao.maps.Marker({
          map,
          position,
        });
      });
    };

    initMap();

    return () => {
      marker?.setMap(null);
    };
  }, [address]);

  return <div ref={mapRef} className="h-[360px] w-full rounded-[10px]" />;
}