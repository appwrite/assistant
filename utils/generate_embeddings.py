from langchain.vectorstores.faiss import FAISS
from typing import List, Union
from langchain.chat_models import ChatOpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains.qa_with_sources import load_qa_with_sources_chain
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings
import os
import json


def chunk_sources(sources: List[Document]) -> List[Document]:
    source_chunks = []
    splitter = CharacterTextSplitter(
        separator=" ", chunk_size=1024, chunk_overlap=64)
    for source in sources:
        for chunk in splitter.split_text(source.page_content):
            source_chunks.append(
                Document(page_content=chunk, metadata=source.metadata))

    return source_chunks


sources = [json.load(open(f"docs/{filename}")) for filename in
           os.listdir("docs")]
sources = map(lambda source: Document(page_content=source['page_content'],
                                      metadata=source['metadata']), sources)

template = "You are an AI chat bot trained on Appwrite Docs. You need to help developers answer Appwrite related " \
           "question only. You will be given an input and you need to respond with the appropriate answer from the " \
           "reference docs. For each question show code examples when applicable. Answer in atleast 100 words." \
           "{input}"

search_index = FAISS.from_documents(chunk_sources(sources), OpenAIEmbeddings())
chain = load_qa_with_sources_chain(ChatOpenAI(temperature=0))
