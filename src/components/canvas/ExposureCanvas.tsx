import { useEffect, useRef } from "react"
import { calcEV, calcStops } from "../../utils/cameraMath"

interface Props {
    iso: number
    aperture: number
    shutter: number
}

export function ExposureCanvas({
    iso,
    aperture,
    shutter
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const W = canvas.width
        const H = canvas.height

        ctx.clearRect(0, 0, W, H)

        const stops = calcStops(
            aperture,
            shutter,
            iso
        )

        const brightness = Math.pow(2, -stops)

        // SKY
        const sky = ctx.createLinearGradient(
            0,
            0,
            0,
            H * 0.5
        )

        sky.addColorStop(0, "#182848")
        sky.addColorStop(1, "#4a7fbf")

        ctx.fillStyle = sky
        ctx.fillRect(0, 0, W, H * 0.5)

        // GROUND
        const ground = ctx.createLinearGradient(
            0,
            H * 0.5,
            0,
            H
        )

        ground.addColorStop(0, "#3a6b1e")
        ground.addColorStop(1, "#1a3a0d")

        ctx.fillStyle = ground
        ctx.fillRect(0, H * 0.5, W, H)

        // SUBJECT
        const sx = W * 0.45

        ctx.fillStyle = "#1f2937"

        ctx.beginPath()
        ctx.arc(sx, H * 0.3, 16, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillRect(
            sx - 12,
            H * 0.35,
            24,
            70
        )

        // EXPOSURE OVERLAY
        const b = Math.min(
            Math.max(brightness, 0.01),
            6
        )

        if (b < 1) {
            ctx.fillStyle = `rgba(0,0,0,${1 - Math.pow(b, 0.45)
                })`
        } else {
            ctx.fillStyle = `rgba(255,255,255,${(b - 1) / 3.5
                })`
        }

        ctx.fillRect(0, 0, W, H)

        // ISO NOISE
        if (iso >= 1600) {
            const imageData = ctx.getImageData(
                0,
                0,
                W,
                H
            )

            const d = imageData.data

            for (let i = 0; i < d.length; i += 4) {
                const noise =
                    (Math.random() - 0.5) * 25

                d[i] += noise
                d[i + 1] += noise
                d[i + 2] += noise
            }

            ctx.putImageData(imageData, 0, 0)
        }

        // TEXT
        const ev = calcEV(aperture, shutter)

        ctx.fillStyle = "white"
        ctx.font = "12px monospace"

        ctx.fillText(
            `ISO ${iso} | f/${aperture} | 1/${Math.round(
                1 / shutter
            )}s | EV ${ev.toFixed(1)}`,
            16,
            H - 20
        )
    }, [iso, aperture, shutter])

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="w-full rounded-lg border border-white/10 bg-black"
        />
    )
}