import { useEffect, useRef } from "react";

import Section from "./Section";
import LocationIcon from "@/assets/icons/Location.svg?react";
import KakaoMap from "./KakaoMap";

interface Props {
  address: string;
}

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

export default function LocationSection({ address }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result, status) => {
        if (status !== window.kakao.maps.services.Status.OK) return;

        const { x, y } = result[0];

        const position = new window.kakao.maps.LatLng(Number(y), Number(x));

        const map = new window.kakao.maps.Map(mapRef.current!, {
          center: position,
          level: 3,
        });

        new window.kakao.maps.Marker({
          map,
          position,
        });
      });
    });
  }, [address]);

  return (
    <Section
      title="위치 정보"
      icon={<LocationIcon className="h-[16px] w-[16px]" />}
    >
      <div
        ref={mapRef}
        className="h-[360px] w-full rounded-[10px]"
      />
      <div>
        <KakaoMap address={address} />
      </div>
      <div className="item-center flex flex-row text-h6-list text-background-500">
        <LocationIcon className="h-[12px] w-[12px] mt-[3.2px]" />
        <p> 내 위치에서 약 3.1km</p>
      </div>
      
      <p className="mt-4 text-h5 text-background-500">{address}</p>
    </Section>
  );
}