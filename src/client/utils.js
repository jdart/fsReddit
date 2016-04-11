
import url from 'url';

export const urlParse = url.parse;

export function hostMatch(host, candidate) {
  const hostLevels = host.split('.');
  const candidateLevels = urlParse(candidate).host.split('.');
  return host === candidateLevels.slice(-hostLevels.length).join('.');
}

export function domainDecoder(domain) {
  const hexes = domain.match(/.{1,4}/g) || [];
  let back = '';
  for (let j = 0; j < hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
}
