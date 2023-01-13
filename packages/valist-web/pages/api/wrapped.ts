import type { NextApiRequest, NextApiResponse } from 'next';
import edgeChromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function stats(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' });
    return;
  }

  const { address } = req.query;
  const LOCAL_CHROME_EXECUTABLE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const executablePath = await edgeChromium.executablePath || LOCAL_CHROME_EXECUTABLE;

  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 800,
      height: 800,
    },
    executablePath,
    args: edgeChromium.args,
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(`http://localhost:3000/-/wrapped/${String(address).toLowerCase()}`);
  await page.waitForSelector('#test');
  const data = await page.screenshot({ encoding: "base64", clip: { x: 0, y: 0, width: 800, height: 800 } });
  await browser.close();

  res.send(`
    <html>
    <head>
      <meta property="twitter:image" content="data:image/png;base64,${data}" />
      <meta property="og:title" content="${address}" />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://app.valist.io" />
      <meta property="og:image" content="data:image/png;base64,${data}" />
      <meta property="og:description" content="2022 wrapped" />
    </head>
      <img src='data:image/png;base64,${data}' />
    </html>
  `);
};