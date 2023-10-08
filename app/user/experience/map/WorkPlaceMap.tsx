"use client";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

const 체험장좌표 = { lat: 33.2761554, lng: 126.6661777 };
const appkey = "f17f205f677972dcef1af0cee0dcebba";
const className = "flex h-full w-full rounded-lg border-[1px] border-gray-300";

export default function WorkPlaceMap() {
  const [loading, error] = useKakaoLoader({ appkey });

  if (loading) {
    <div className={className}>
      <FontAwesomeIcon icon={faSpinner} fontSize={50} className="m-auto animate-spin" />
      {/* 로딩중... */}
    </div>;
  }

  if (error) {
    return (
      <div className={className}>
        <span className="m-auto">지도를 불러오지 못했습니다.</span>
      </div>
    );
  }

  return (
    <Map center={체험장좌표} className={className}>
      <MapMarker position={체험장좌표} />
    </Map>
  );
}
