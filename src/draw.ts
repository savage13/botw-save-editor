
export function fillRect(ctx: any, x: number, y: number, w: number, h: number, fill: string) {
  ctx.save()
  ctx.beginPath()
  ctx.fillStyle = fill
  ctx.rect(x, y, w, h)
  ctx.fill()
  ctx.restore()
}
export function strokeRect(ctx: any, x: number, y: number, w: number, h: number, color: string, line_width: number = 1) {
  ctx.save()
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = line_width
  ctx.rect(x, y, w, h)
  ctx.stroke()
  ctx.restore()
}
export function checkbox(ctx: any, x: number, y: number, checked: boolean) {
  let w = 20
  let h = 20
  let line_width = 3;
  if (checked)
    fillRect(ctx, x, y, w, h, "lime")
  strokeRect(ctx, x, y, w, h, "white", line_width)
}


export function spicy(ctx: any, x0: number, y0: number, value: number) {
  // circle r = 10
  // [-12, 6], [-19, 12]
  // [0, 12], [0, 22]
  // [0, 14], [0, 24]
  // [11,-18], [18,-14]
  // [-12, 8], [-20, -14]
  const scale = 0.6
  let s = scale;
  ctx.save()
  for (let i = 0; i < value; i++) {
    let x = x0 + i * 32
    let y = y0
    ctx.beginPath()
    ctx.strokeStyle = "#A3FCF2"
    ctx.lineWidth = 3

    ctx.beginPath(); ctx.moveTo(x, y - 20 * s); ctx.lineTo(x, y + 20 * s); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(x - 16 * s, y + 9 * s); ctx.lineTo(x + 16 * s, y - 9 * s); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(x - 16 * s, y - 9 * s); ctx.lineTo(x + 16 * s, y + 9 * s); ctx.stroke()
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.beginPath()
    ctx.moveTo(x + 10 * s, y + 1 * s)
    ctx.lineTo(x + 10 * s, y + 10 * s)
    ctx.lineTo(x + 6 * s, y + 11 * s)
    ctx.lineTo(x + 18 * s, y + 24 * s)
    ctx.lineTo(x + 29 * s, y + 11 * s)
    ctx.lineTo(x + 23 * s, y + 11 * s)
    ctx.lineTo(x + 23 * s, y + 1 * s)
    ctx.lineTo(x + 10 * s, y + 1 * s)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
  ctx.restore()

}

export function chilly(ctx: any, x0: number, y0: number, value: number) {
  // circle r = 10
  // [-12, 6], [-19, 12]
  // [0, 12], [0, 22]
  // [0, 14], [0, 24]
  // [11,-18], [18,-14]
  // [-12, 8], [-20, -14]
  const scale = 0.6
  let s = scale;
  ctx.save()
  for (let i = 0; i < value; i++) {
    let x = x0 + i * 32
    let y = y0
    ctx.beginPath()
    ctx.fillStyle = "#F4B940"
    ctx.strokeStyle = "#F4B940"
    ctx.lineWidth = 3
    ctx.arc(x, y, 10 * s, 0, 2.0 * Math.PI)
    ctx.fill()
    ctx.beginPath(); ctx.moveTo(x, y + 13 * s); ctx.lineTo(x, y + 23 * s); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(x, y - 13 * s); ctx.lineTo(x, y - 23 * s); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(x - 12 * s, y + 7 * s); ctx.lineTo(x - 20 * s, y + 13 * s); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(x - 12 * s, y - 7 * s); ctx.lineTo(x - 20 * s, y - 13 * s); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(x + 12 * s, y - 7 * s); ctx.lineTo(x + 20 * s, y - 13 * s); ctx.stroke()
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.beginPath()
    ctx.moveTo(x + 10 * s, y + 1 * s)
    ctx.lineTo(x + 10 * s, y + 10 * s)
    ctx.lineTo(x + 6 * s, y + 11 * s)
    ctx.lineTo(x + 18 * s, y + 24 * s)
    ctx.lineTo(x + 29 * s, y + 11 * s)
    ctx.lineTo(x + 23 * s, y + 11 * s)
    ctx.lineTo(x + 23 * s, y + 1 * s)
    ctx.lineTo(x + 10 * s, y + 1 * s)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
  ctx.restore()
}

export function electro(ctx: any, x: number, y: number, value: number) {
  // m -17 4 l 21 -25 l -2 15 l 13 1 l -21 25 l 2 -15 l -13 -1
  const p: any = [[-17, 4], [21, -25], [-2, 15], [13, 1], [-21, 25], [2, -15], [-13, -1]]
  const scale = 0.8
  ctx.save()
  ctx.fillStyle = "#ECF04F"

  for (let i = 0; i < value; i++) {
    ctx.beginPath()
    let x1 = x + i * 32
    let y1 = y
    for (let i = 0; i < p.length; i++) {
      x1 += p[i][0] * scale
      y1 += p[i][1] * scale
      if (i == 0)
        ctx.moveTo(x1, y1)
      else
        ctx.lineTo(x1, y1)
    }
    ctx.fill()
  }
  ctx.restore()
}

export function sneaky(ctx: any, x: number, y: number, value: number) {
  // m -17 -7 l 7 -5 l 7 5 l 7 -5 l 7 5 l 7 -5
  const p: any = [[-17, -7], [7, -5], [7, 5], [7, -5], [7, 5], [7, -5]]
  let scale = 0.8
  ctx.save()
  ctx.strokeStyle = "#AD23DD"
  ctx.lineWidth = 5
  y += 2
  for (let i = 0; i < value; i++) {
    for (let j = 0; j < 2; j++) {

      ctx.beginPath()
      let x1 = x + i * 36
      let y1 = y + j * 11
      for (let i = 0; i < p.length; i++) {
        x1 += p[i][0] * scale
        y1 += p[i][1] * scale
        if (i == 0)
          ctx.moveTo(x1, y1)
        else
          ctx.lineTo(x1, y1)
      }
      ctx.stroke()
    }
  }
  ctx.restore()
}

export function hasty(ctx: any, x: number, y: number, value: number) {
  //m -21 12 l 11 -7 l 8 12 l 12 -15 l 6 4 l 0 -24 l -20 8 l 5 5 l -4 6 l -6 -8 l -12 19
  const p = [[-21, 12], [11, -7], [8, 12], [12, -15], [6, 4], [0, -24], [-20, 8], [5, 5], [-4, 6], [-6, -8], [-12, 19]]
  let scale = 0.8
  ctx.save()
  ctx.fillStyle = "#3D8BD5"
  for (let i = 0; i < value; i++) {
    ctx.beginPath()
    let x1 = x + i * 32
    let y1 = y
    for (let i = 0; i < p.length; i++) {
      x1 += p[i][0] * scale
      y1 += p[i][1] * scale
      if (i == 0)
        ctx.moveTo(x1, y1)
      else
        ctx.lineTo(x1, y1)
    }
    ctx.fill()
  }
  ctx.restore()
}

export function stamina_circle(ctx: any, x: number, y: number, value: number, color: string) {
  ctx.save()
  const r = 8
  ctx.lineWidth = 8
  for (let i = 1; i <= Math.ceil(value); i++) {
    ctx.strokeStyle = "gray"
    ctx.beginPath()
    ctx.arc(x + (i - 1) * r * 3.5, y, r, 0, 2 * Math.PI)
    ctx.stroke()
    let size = 1
    if (value < i)
      size = value - i
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.arc(x + (i - 1) * r * 3.5, y, r, -Math.PI / 2, -Math.PI / 2 - 2 * Math.PI * size, 1)
    ctx.stroke()
  }
  ctx.restore()
}

export function star(ctx: any, x: number, y: number, color: string) {
  ctx.save()
  const x0 = x
  const y0 = y
  const ang0 = -90
  const da = 36
  const R = 20
  ctx.beginPath()
  ctx.fillStyle = color
  for (let i = 0; i <= 10; i++) {
    let r = (i % 2 == 0) ? R : R * 0.382
    let angle = ang0 + i * da
    let x = x0 + r * Math.cos(angle * Math.PI / 180)
    let y = y0 + r * Math.sin(angle * Math.PI / 180)
    if (i == 0)
      ctx.moveTo(x, y)
    else
      ctx.lineTo(x, y)
  }
  ctx.fill()
  ctx.restore()
}

export function heart(ctx: any, x: number, y: number, color: string) {
  //m 12 6.0002
  // c -1.7994 -2.097 -4.8062 -2.7451 -7.0608 -0.8248
  //c -2.2546 1.9202 -2.572 5.1308 -0.8014 7.4019
  //c 1.4721 1.8882 5.927 5.8707 7.3871 7.1597
  //c 0.1633 0.1442 0.245 0.2163 0.3403 0.2446
  //c 0.0831 0.0247 0.1741 0.0247 0.2573 0
  //c 0.0953 -0.0283 0.1769 -0.1004 0.3403 -0.2446
  //c 1.4601 -1.289 5.915 -5.2715 7.3871 -7.1597
  //c 1.7705 -2.2711 1.4918 -5.5018 -0.8015 -7.4019
  //c -2.2933 -1.9 -5.249 -1.2722 -7.0484 0.8248 z

  const scale = 1.3
  const pts = [
    [-1.7994, -2.097, -4.8062, -2.7451, -7.0608, -0.8248],
    [-2.2546, 1.9202, -2.572, 5.1308, -0.8014, 7.4019],
    [1.4721, 1.8882, 5.927, 5.8707, 7.3871, 7.1597],
    [0.1633, 0.1442, 0.245, 0.2163, 0.3403, 0.2446],
    [0.0831, 0.0247, 0.1741, 0.0247, 0.2573, 0],
    [0.0953, -0.0283, 0.1769, -0.1004, 0.3403, -0.2446],
    [1.4601, -1.289, 5.915, -5.2715, 7.3871, -7.1597],
    [1.7705, -2.2711, 1.4918, -5.5018, -0.8015, -7.4019],
    [-2.2933, -1.9, -5.249, -1.2722, -7.0484, 0.8248],
  ].map(v => v.map(v => v * scale))

  ctx.save()
  ctx.fillStyle = color;
  ctx.beginPath()
  ctx.moveTo(x, y - 6 * scale)
  x += 0
  y += -6 * scale
  for (const p of pts) {
    ctx.bezierCurveTo(x + p[0], y + p[1],
      x + p[2], y + p[3],
      x + p[4], y + p[5])
    x += p[4]
    y += p[5]
  }
  ctx.fill()
  ctx.restore()
}

export function rain(ctx: any, x: number, y: number) {
  //ctx.drawImage(rain,0,0)

  ctx.fillStyle = "lightblue"
  ctx.beginPath()

  x -= 18
  y -= 18

  let x0 = 22 + x
  let y0 = 10 + y

  let x1 = 16 + x
  let y1 = 23 + y

  let x2 = 22 + x
  let y2 = 28 + y

  let x3 = 28 + x
  let y3 = 23 + y
  ctx.moveTo(x0, y0)
  ctx.bezierCurveTo(x0, y0, x1, y1 - 3, x1, y1)
  ctx.bezierCurveTo(x1, y1 + 3, x2 - 4, y2, x2, y2)
  ctx.bezierCurveTo(x2 + 4, y2, x3, y3 + 3, x3, y3)
  ctx.bezierCurveTo(x3, y3 - 3, x0, y0, x0, y0)
  //ctx.stroke()
  ctx.fill()


  x0 = x0 - 10
  x1 = x0 - 3
  y1 = y0 + 6
  x2 = x0
  y2 = y0 + 9
  x3 = x0 + 3
  y3 = y1
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.bezierCurveTo(x0, y0, x1, y1 - 1, x1, y1)
  ctx.bezierCurveTo(x1, y1 + 1, x2 - 1, y2, x2, y2)
  ctx.bezierCurveTo(x2 + 1, y2, x3, y3 + 1, x3, y3)
  ctx.bezierCurveTo(x3, y3 - 1, x0, y0, x0, y0)

  //ctx.stroke()
  ctx.fill()
}
export function sun(ctx: any, x0: number, y0: number) {

  ctx.strokeStyle = "rgba(255,0,0,0)"
  ctx.fillStyle = "#fce23a"
  const pts = [
    [0, 0, 4],
    [0, 8, 2],
    [0, -8, 2],
    [-7, -4, 2],
    [-7, 4, 2],
    [7, -4, 2],
    [7, 4, 2]
  ]
  for (let p of pts) {
    ctx.beginPath()
    ctx.arc(x0 + p[0], y0 + p[1], p[2], 0, 2.0 * Math.PI)
    ctx.fill()
    ctx.stroke()
  }
}

export function storm(ctx: any, x0: number, y0: number) {

  x0 -= 18
  y0 -= 18
  ctx.beginPath()
  ctx.fillStyle = "#f4fc7e"
  ctx.moveTo(x0 + 14, y0 + 9)
  ctx.lineTo(x0 + 23, y0 + 9)
  ctx.lineTo(x0 + 20, y0 + 15)
  ctx.lineTo(x0 + 27, y0 + 15)
  ctx.lineTo(x0 + 13, y0 + 29)
  ctx.lineTo(x0 + 17, y0 + 20)
  ctx.lineTo(x0 + 9, y0 + 20)
  ctx.lineTo(x0 + 14, y0 + 9)
  ctx.fill()
}

export function snow(ctx: any, x0: number, y0: number) {
  const pts = [
    [[0, -10], [0, 10]],
    [[9, -10 + 5], [-9, 10 - 5]],
    [[-9, -10 + 5], [9, 10 - 5]]
  ]
  //x0 -= 18
  //y0 -= 18
  ctx.beginPath()
  ctx.lineCap = "round"
  ctx.lineWidth = 3
  ctx.strokeStyle = "#eeeeee"
  for (const p of pts) {
    const a = p[0]
    const b = p[1]
    ctx.moveTo(x0 + a[0], y0 + a[1])
    ctx.lineTo(x0 + b[0], y0 + b[1])
    ctx.stroke()
  }
}

export function cloudy(ctx: any, x: number, y: number) {

  x -= 18
  y -= 18
  ctx.beginPath()
  ctx.lineWidth = 0.7
  ctx.strokeStyle = "red"
  ctx.fillStyle = "#edeaea"
  ctx.beginPath()
  let x0 = 8 + x
  let y0 = 27 + y
  let x1 = x0 + 16
  let y1 = y0
  let x2 = x1
  let y2 = y1 - 8
  let x3 = x2 - 4
  let y3 = y2
  let x4 = x3 - 5
  let y4 = y3 - 3
  let x5 = x4 - 4
  let y5 = y4 + 5
  let x6 = x5 - 3
  let y6 = y5
  ctx.moveTo(x0, y0)
  ctx.bezierCurveTo(x0, y0, x1, y1, x1, y1)
  ctx.bezierCurveTo(x1 + 3, y1 - 1, x2 + 3, y2 + 1, x2, y2)
  ctx.bezierCurveTo(x2, y2, x3, y3, x3, y3)
  ctx.bezierCurveTo(x3, y3, x4 + 4, y4, x4, y4)
  ctx.bezierCurveTo(x4 - 4, y4, x5, y5, x5, y5)
  ctx.bezierCurveTo(x5, y5, x6, y6, x6, y6)
  ctx.bezierCurveTo(x6 - 3, y6, x0 - 3, y0, x0, y0)
  ctx.fill()

  {
    let x0 = 14 + x
    let y0 = 13 + y
    let x1 = x0 + 8
    let y1 = y0 + 4

    let x2 = x1 + 7
    let y2 = y1

    let x3 = x2
    let y3 = y2 - 5

    let x4 = x3 - 3
    let y4 = y3
    let x5 = x4 - 4
    let y5 = y4 - 5
    let x6 = x5 - 4
    let y6 = y5 + 3
    let x7 = x6 - 3
    let y7 = y6
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.bezierCurveTo(x0 + 2, y0, x1, y1 - 4, x1, y1)
    ctx.bezierCurveTo(x1, y1, x2, y2, x2, y2)
    ctx.bezierCurveTo(x2 + 1, y2, x3 + 1, y3, x3, y3)
    ctx.bezierCurveTo(x3, y3, x4, y4, x4, y4)
    ctx.bezierCurveTo(x4, y4, x5 + 4, y5, x5, y5)
    ctx.bezierCurveTo(x5 - 4, y5, x6, y6, x6, y6)
    ctx.bezierCurveTo(x6, y6, x7, y7, x7, y7)
    ctx.bezierCurveTo(x7 - 1, y7, x0 - 1, y0, x0, y0)
    ctx.fill()
  }

}
