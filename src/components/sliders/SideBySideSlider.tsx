import { Slider } from "./Slider";


export default function SideBySideSliders({
    label1,
    val1,
    min1,
    max1,
    cur1,
    chg1,
    step1 = 1,
    label2,
    val2,
    min2,
    max2,
    cur2,
    chg2,
    step2 = 1,
}: any) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Slider
                label={label1}
                value={val1}
                min={min1}
                max={max1}
                current={cur1}
                onChange={chg1}
                step={step1}
                compact
            />
            <Slider
                label={label2}
                value={val2}
                min={min2}
                max={max2}
                current={cur2}
                onChange={chg2}
                step={step2}
                compact
            />
        </div>
    );
}