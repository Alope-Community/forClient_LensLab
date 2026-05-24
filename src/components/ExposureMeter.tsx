interface Props {
    stops: number
}

export function ExposureMeter({
    stops
}: Props) {
    const position = Math.min(
        Math.max(((stops + 4) / 8) * 100, 0),
        100
    )

    return (
        <div className="space-y-2 mt-10 w-[90%] mx-auto">
            <div className="relative h-2 rounded-full overflow-hidden bg-gradient-to-r from-black via-gray-400 to-white">
                <div
                    className="absolute top-1/2 w-4 h-4 rounded-full bg-primary border border-white -translate-y-1/2"
                    style={{
                        left: `${position}%`,
                        transform:
                            "translate(-50%, -50%)"
                    }}
                />
            </div>

            <div className="flex justify-between text-[10px] text-white/50">
                <span>-4</span>
                <span>0</span>
                <span>+4</span>
            </div>
        </div>
    )
}