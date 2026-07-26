import Section from "./Section";
import LocationIcon from "@/assets/icons/Location.svg?react";
import KakaoMap from "./KakaoMap";
import { useEffect, useState } from "react";
import ChevronLeftIcon from "@/assets/icons/ChevronLeft.svg?react";

interface Props {
  address: string;
  homepageUrl?: string;
}

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function LocationSection({ address, homepageUrl }: Props) {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [placeLocation, setPlaceLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCurrentLocation({
          lat: coords.latitude,
          lng: coords.longitude,
        });
      },
      (err) => {
        console.error(err);
      }
    );
  }, []);

  const distance =
    currentLocation && placeLocation
      ? getDistance(
          currentLocation.lat,
          currentLocation.lng,
          placeLocation.lat,
          placeLocation.lng
        )
      : null;

  return (
    <Section
      title="위치 정보"
      icon={<LocationIcon className="h-[16px] w-[16px]" />}
    >
      <KakaoMap
        address={address}
        onLocationLoaded={(lat, lng) =>
          setPlaceLocation({ lat, lng })
        }
      />
      <div className="flex flex-row items-center text-h6-list text-background-500 mt-[13px]">
        <LocationIcon className="h-[12px] w-[12px]" />
        <p className="ml-1">
          {distance !== null
            ? `내 위치에서 약 ${distance.toFixed(1)}km`
            : "거리 계산 중..."}
        </p>
      </div>
      
      <a
        href={homepageUrl ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex h-[36px] w-[128px] items-center rounded-[10px] border border-background-300 bg-background-100 px-[16px]"
      >
        <ChevronLeftIcon className="mr-[4px] h-[14px] w-[14px] text-background-500" />

        {/* <img
          src={NaverMapLogo}
          alt="카카오"
          className="mr-5 h-10 w-10"
        /> */}

        <span className="text-h4-list text-[#5E626E]">
          카카오지도
        </span>
      </a>
    </Section>
  );
}