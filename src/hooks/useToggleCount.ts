import { useState } from "react";

interface UseToggleCountParams {
    initialCount: number;
    initialIsActive?: boolean;
}

function useToggleCount({ initialCount, initialIsActive = false }: UseToggleCountParams) {
    const [isActive, setIsActive] = useState(initialIsActive);
    const [count, setCount] = useState(initialCount);

    const toggle = () => {
        const nextIsActive = !isActive;

        setIsActive(nextIsActive);
        setCount((prevCount) => {
            const nextCount = nextIsActive ? prevCount + 1 : prevCount - 1;
            return Math.max(0, nextCount);
        });

        return nextIsActive;
    };

    return { isActive, count, toggle };
}

export default useToggleCount;
