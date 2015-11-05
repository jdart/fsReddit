
import url from 'url';

export function parseUrl(_url) {
  return url.parse(_url);
}

const imgState = {
  working: false,
  queue: []
};

export function imgPreload(url) {
  imgState.queue.push(url);
  if (imgState.working)
    return;
  imgLoop();
}

function imgLoop() {
  if (!imgState.queue.length) {
    imgState.working = false
    return;
  }
  imgState.working = true;
  const next = imgState.queue.shift();
  const img = new Image();
  img.onload = setTimeout(imgLoop, 50);
  img.src = next;
}

