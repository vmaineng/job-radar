
import asyncio
from dotenv import load_dotenv

load_dotenv()

from pipeline import run_pipeline

if __name__ == "__main__":
    count = asyncio.run(run_pipeline())
    print(f"Pipeline finished — {count} new jobs added.")
