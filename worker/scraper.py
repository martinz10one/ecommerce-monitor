import asyncio
import random
from playwright.async_api import async_playwright

async def scrape_page(browser, url):
    try:
        page = await browser.new_page()
        await page.goto(url)

        productos = await page.query_selector_all(".product_pod")

        data = []

        for i, p in enumerate(productos):
            titulo = await p.query_selector("h3 a")
            precio = await p.query_selector(".price_color")

            price_text = await precio.inner_text()

            # 🔥 CAMBIO SOLO PARA PROBAR (primer producto)
            if i == 0:
                price_text = "£999"

            data.append({
                "title": await titulo.get_attribute("title"),
                "price": price_text
            })

        await page.close()

        # delay aleatorio (0.5s a 2s)
        await asyncio.sleep(random.uniform(0.5, 2))

        return data

    except Exception as e:
        print(f"❌ Error en {url}: {e}")
        return []


async def scrape_multiple():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        urls = [
            "https://books.toscrape.com/catalogue/page-1.html",
            "https://books.toscrape.com/catalogue/page-2.html",
            "https://books.toscrape.com/catalogue/page-3.html"
        ]

        tasks = [scrape_page(browser, url) for url in urls]

        results = await asyncio.gather(*tasks)

        await browser.close()

        # unir todos los productos
        all_products = []
        for r in results:
            all_products.extend(r)

        return all_products