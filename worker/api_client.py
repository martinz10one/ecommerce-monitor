import httpx

async def send_data(products):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:3000/snapshots",
                json=products
            )

            print("Respuesta de la API:")
            print(response.json())

        except Exception as e:
            print("❌ Error enviando datos:", e)