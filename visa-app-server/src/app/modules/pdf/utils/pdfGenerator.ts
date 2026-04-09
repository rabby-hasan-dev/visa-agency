import puppeteer from 'puppeteer';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';

export const generatePDF = async (data: any) => {
    const templatePath = path.join(
        process.cwd(),
        'src/app/templates/application_pdf.ejs',
    );
    const template = fs.readFileSync(templatePath, 'utf8');

    const html = ejs.render(template, data);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html);

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    return pdfBuffer;
};
