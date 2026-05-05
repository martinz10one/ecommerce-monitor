import asyncio
from scraper import scrape_multiple
from api_client import send_data

async def main():
    productos = await scrape_multiple()

    print(f"📦 Total productos: {len(productos)}")

    await send_data(productos)

asyncio.run(main())