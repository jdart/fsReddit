
import url from 'url';

export const urlParse = url.parse;

export function hostMatch(host, candidate) {
  const hostLevels = host.split('.');
  const candidateLevels = urlParse(candidate).host.split('.');
  return host === candidateLevels.slice(-hostLevels.length).join('.');
}

