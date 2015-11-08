
import url from 'url';

export const urlParse = url.parse;

export function hostMatch(host, candidate) {
  const hostLevels = host.split('.');
  const candidateLevels = urlParse(candidate).host.split('.');
  return host === candidateLevels.slice(-hostLevels.length).join('.');
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

