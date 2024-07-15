/* eslint-disable camelcase */
import {
  Inter,
  Oswald,
  Poppins,
  Roboto,
  Roboto_Mono,
  Tilt_Warp,
  Permanent_Marker,
  Monoton,
  Lobster,
} from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})

const tiltWarp = Tilt_Warp({
  subsets: ['latin'],
  display: 'swap',
})

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const oswald = Oswald({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const permanentMarker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const fonts = {
  inter,
  robotoMono,
  tiltWarp,
  poppins,
  roboto,
  oswald,
  permanentMarker,
  monoton,
  lobster,
}
