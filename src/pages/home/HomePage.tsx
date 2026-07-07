import { useState } from "react";
import LocationPinIcon from "@/assets/icons/LocationPin.svg?react";
import { Select } from "../../components/Select";

const sortOptions = [
    { label: "조회순", value: "views" },
    { label: "조회순", value: "views" },
    { label: "조회순", value: "views" },
];

const locationOptions = [
    { label: "서울시 강남구", value: "gangnam" },
    { label: "서울시 서초구", value: "seocho" },
    { label: "서울시 송파구", value: "songpa" },
];

export default function HomePage() {
    const [largeValue, setLargeValue] = useState("");
    const [smallValue, setSmallValue] = useState("");
    const [locationValue, setLocationValue] = useState("");

    return (
        <main className="min-h-screen p-6">
            <section className="mt-6 flex max-w-[520px] flex-col gap-6">
                <div>
                    <h2 className="mb-2 text-h3-category-sub text-background-500">variant: L</h2>

                    <Select
                        options={sortOptions}
                        value={largeValue}
                        onChange={setLargeValue}
                        placeholder="시/도"
                        variant="L"
                        className="w-[262px]"
                    />
                </div>

                <div>
                    <h2 className="mb-2 text-h3-category-sub text-background-500">variant: S</h2>

                    <Select
                        options={sortOptions}
                        value={smallValue}
                        onChange={setSmallValue}
                        placeholder="조회순"
                        variant="S"
                        className="w-[120px]"
                    />
                </div>

                <div>
                    <h2 className="mb-2 text-h3-category-sub text-background-500">
                        location example: S
                    </h2>

                    <Select
                        options={locationOptions}
                        value={locationValue}
                        onChange={setLocationValue}
                        placeholder="서울시 강남구"
                        variant="S"
                        icon={<LocationPinIcon className="shrink-0" />}
                        className="w-fit"
                    />
                </div>
            </section>
        </main>
    );
}
