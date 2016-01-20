import fetch from 'isomorphic-fetch';
import express from 'express';
import url from 'url';

const router = express.Router();
const token = '710eb251d73ad489a7b85c996ff06c3392861872';

function fetcher(url) {
  return fetch([
    'https://www.readability.com/api/content/v1/parser',
    '?url=' + encodeURIComponent(url),
    '&token=' + encodeURIComponent(token)
  ].join(''));
}

router.route('/parse')
  .get((req, res, next) => {
    const urlParts = url.parse(req.url, true);
    const query = urlParts.query;
    fetcher(query.url)
      .then(response => response.json())
      .then(response => {
        res.status(200).send(response).end();
      });

  });

export default router;
