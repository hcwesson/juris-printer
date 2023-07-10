import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import { readdirSync } from "fs";
import { resolve, dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// URL of the running Vite dev server
const baseUrl = "http://localhost:5173";

const goto = async (page, link) => {
  return page.evaluate((link) => {
    location.href = link;
  }, link);
};

let browser;
(async () => {
  browser = await puppeteer.launch({
    headless: false,
    dumpio: true,
    executablePath: '/usr/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920x1080',
    ]
  });

  const studentIds = []

  // Assumes that all students evaluated on each question
  readdirSync(resolve(__dirname, "../data/csv/Q1")).forEach((file) => {
    studentIds.push(file.split(".")[0]);
  });

  // This could be a gazillion times faster as the task is embarassingly parallel,
  // but debugging Puppeteer isn't fun and it gets the job done eventually
  for (let id of studentIds) {
    let page = await browser.newPage();
    await page.goto(`${baseUrl}/Q1/${id}`, {
      waitUntil: 'networkidle2',
    })
    await page.pdf({
      format: "LETTER",
      path: resolve(__dirname, `../pdf_out/Q1/${id}_Q1.pdf`),
    });
    await page.goto(`${baseUrl}/Q2/${id}`, {
      waitUntil: 'networkidle2',
    })
    await page.pdf({
      format: "LETTER",
      path: resolve(__dirname, `../pdf_out/Q2/${id}_Q2.pdf`),
    });
    await page.close();
  }
})()
  .catch(err => console.error(err))
  .finally(() => browser?.close());
