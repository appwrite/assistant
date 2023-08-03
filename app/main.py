from fastapi import FastAPI
from uuid import uuid4 as uuid
from typing import Union
from fastapi.middleware.cors import CORSMiddleware
from utils.generate_embeddings import chain, search_index,template

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/chat")
async def chat(question: str):
    answer =  chain(
            {
                "input_documents": search_index.similarity_search(question, k=4),
                "question": template.format(input=question),
            },
            return_only_outputs=True,
        )["output_text"]
    return {"answer": answer}