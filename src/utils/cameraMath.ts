export const ISO_VALUES = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600]

export const APERTURE_VALUES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22]

export const SHUTTER_VALUES = [
    1,
    0.5,
    0.25,
    0.125,
    1 / 30,
    1 / 60,
    1 / 125,
    1 / 250,
    1 / 500,
    1 / 1000,
    1 / 2000
]

export function calcEV(aperture: number, shutter: number) {
    return Math.log2((aperture * aperture) / shutter)
}

export function calcStops(
    aperture: number,
    shutter: number,
    iso: number
) {
    return Math.log2(
        (aperture * aperture * 100) / (shutter * iso)
    ) - 12
}

export function calcDOF(
    focalLength: number,
    aperture: number,
    focusDistance: number
) {
    const coc = 0.029

    const H =
        (focalLength * focalLength) /
        (aperture * coc)

    const near =
        (focusDistance * H) /
        (H + focusDistance)

    const far =
        focusDistance >= H
            ? null
            : (focusDistance * H) /
            (H - focusDistance)

    return {
        near: near / 1000,
        far: far ? far / 1000 : null,
        H: H / 1000
    }
}

export function calcFOV(focalLength: number) {
    const horizontal =
        2 *
        Math.atan(36 / (2 * focalLength)) *
        (180 / Math.PI)

    const vertical =
        2 *
        Math.atan(24 / (2 * focalLength)) *
        (180 / Math.PI)

    return {
        horizontal,
        vertical
    }
}