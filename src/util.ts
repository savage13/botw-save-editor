
import { ON_SWITCH } from './View'

export function clamp(value: number, x0: number, x1: number) {
  return Math.min(Math.max(value, x0), x1);
}

export function range(n: number) {
  return [...Array(n + 1).keys()]
}

export async function loadImage(imageUrl: any): Promise<Image> {
  let img: Image;
  const imageLoadPromise = new Promise((resolve, reject) => {
    img = new Image()
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageUrl;
  });

  await imageLoadPromise;
  // @ts-ignore
  return img;
}

export async function loadImageFile(imageUrl: any): Promise<Image> {
  let img: Image;
  const imageLoadPromise = new Promise((resolve, reject) => {
    img = new Image()
    img.onload = resolve;
    img.onerror = reject;
    if (ON_SWITCH)
      img.src = "romfs:/" + imageUrl;
    else
      img.src = "romfs/" + imageUrl;
  });

  await imageLoadPromise;
  // @ts-ignore
  return img;
}
