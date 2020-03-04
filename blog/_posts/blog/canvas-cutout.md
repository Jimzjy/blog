---
title: 使用 Canvas 实时抠图🙃
date: 2020-03-04
author: Jimzjy
location: Hangzhou
tags: 
  - canvas
  - blog
---

通过 Canvas 的 [getImageData](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData) 和 [putImageData](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData) API 可以非常轻松的获取和修改画布上的图像数据. 只要加一些拓展, 就可以实现图片甚至视频的抠图.  

### 图片中的部分颜色去除
<img :src="$withBase('/blog/canvas-cutout/poster.png')" alt="poster"/>

[Live Demo](https://jimzjy.github.io/misc/canvas-cutout/)  
[代码](https://github.com/Jimzjy/misc/tree/master/canvas-cutout)  

`getImageData` 返回的 ImageData 中的 data 是一个数组, 以 RGBA 的顺序排列图像中的每个像素的颜色数据. 所以只要修改掉 data 中对应 RGB 值的数据, 再通过 `putImageData` 把数据放回去就可以完成抠图啦.  

这里用了一个不可见的 canvas ,和两个 img 分别代表原图和处理完成后的图片.  
```html
<canvas id="img-canvas" width="0" height="200" style="display: none;"></canvas>
<div class="wrapper">
  <img id="img-pre" src="xxx.png" height="200"/>
  <div class="arrow-right" style="display: none;" onclick="onArrowClick()"></div>
  <img id="img-cutted" src="" height="200"/>
</div>
```
触发处理的操作后, 先获取 imgData ,再把每个像素的 RGB 值都提取出来比较, 把符合条件的像素的 alpha 值改成 0, 使像素透明.  
```js
function onArrowClick() {
  const colors = [255, 255, 255, 255, 255, 255]
  canvas.setAttribute('width', imgPre.width)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(imgPre, 0, 0, imgPre.width, imgPre.height)

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < imgData.data.length / 4; i++) {
    let r = imgData.data[i * 4 + 0]
    let g = imgData.data[i * 4 + 1]
    let b = imgData.data[i * 4 + 2]

    if (r >= colors[0] && r <= colors[1] && g >= colors[2] && g <= colors[3] && b >= colors[4] && b <= colors[5]) {
      imgData.data[i * 4 + 3] = 0 // 通过把 Alpha 值设为 0 , 来使像素透明
    }
  }
  ctx.putImageData(imgData, 0, 0)
  imgOut.src = canvas.toDataURL() // 转成 base64 在 img 标签中显示并且可以下载
}
```
再加一些 input 可以设置想要清除的颜色范围
```html
<div>
  R: <input class="color-input" type="number"/> to <input class="color-input" type="number"/> 
</div>
<div>
  G: <input class="color-input" type="number"/> to <input class="color-input" type="number"/> 
</div>
<div>
  B: <input class="color-input" type="number"/> to <input class="color-input" type="number"/> 
</div>
```
```js
const colors = sortColors(Array.prototype.map.call(colorInput, item => (Number(item.value) || 255)))

function sortColors(colors) {
  for (let i = 0; i < 6; i += 2) {
    if (colors[i] > colors[i + 1]) {
      [colors[i], colors[i + 1]] = [colors[i + 1], colors[i]]
    }
  }
  return colors
}
```

### 视频中的部分颜色去除
<img :src="$withBase('/blog/canvas-cutout/video.gif')" alt="video-cutout"/>

[Live Demo](https://jimzjy.github.io/misc/canvas-cutout-video/)  
[代码](https://github.com/Jimzjy/misc/tree/master/canvas-cutout-video)  

这里用了一个 video 显示未处理过的视频, 并且一直循环视频, 用 canvas 显示处理过的视频
```html
<div class="wrapper">
  <video id="video-pre" src="./video0.mp4" height="200" autoplay muted loop/></video>
  <canvas id="video-after" height="200"/>
</div>
```
基本和图片的处理逻辑没有什么区别, 只是视频这里将透明的颜色改成了白色, 通过 setTimeout 循环处理
```js
function cutout() {
  const colors = sortColors(Array.prototype.map.call(colorInput, item => (Number(item.value) || 0)))
  canvasVideoAfterCtx.drawImage(videoPre, 0, 0, videoWidth, videoHeight)

  const imgData = canvasVideoAfterCtx.getImageData(0, 0, videoWidth, videoHeight)
  for (let i = 0; i < imgData.data.length / 4; i++) {
    let r = imgData.data[i * 4 + 0]
    let g = imgData.data[i * 4 + 1]
    let b = imgData.data[i * 4 + 2]

    if (r >= colors[0] && r <= colors[1] && g >= colors[2] && g <= colors[3] && b >= colors[4] && b <= colors[5]) {
      imgData.data[i * 4 + 0] = 255
      imgData.data[i * 4 + 1] = 255
      imgData.data[i * 4 + 2] = 255
    }
  }
  canvasVideoAfterCtx.putImageData(imgData, 0, 0)
  setTimeout(cutout) // 循环处理视频
}
```

### 参考资料
[Realtime Video Processing with JavaScript (No Library)](https://redstapler.co/realtime-video-processing-javascript-tutorial/)