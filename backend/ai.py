import os
import requests
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Fetch repository data
def fetch_repositories():
    """Fetch repository details from the Express server."""
    try:
        response = requests.get("http://localhost:3000/user/repos")
        response.raise_for_status()
        return response.json()  # Parse JSON data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching repositories: {e}")
        return []

def format_repo_data_for_faiss(repo_data):
    """Convert repository data to LangChain Document objects."""
    documents = []
    for repo in repo_data:
        content = (
            f"Repository Name: {repo.get('name', 'N/A')}\n"
            f"URL: {repo.get('url', 'N/A')}\n"
            f"Languages: {repo.get('language', 'Not Specified')}\n"
            f"Description: {repo.get('description', 'No Description')}\n"
            f"Deployed At: {repo.get('deployed_at', 'Not Deployed')}\n"
            f"README Content: {repo.get('readme', 'No README available')[:500]}..."  # Truncated
        )
        documents.append(Document(page_content=content, metadata={"name": repo.get("name")}))
    # for documet in documents:
    #     print(documet.page_content)
    return documents

def create_faiss_index(documents, index_path="repo_faiss_index"):
    """Create and save FAISS index."""
    embeddings = OpenAIEmbeddings()  
    vectorstore = FAISS.from_documents(documents, embeddings)
    vectorstore.save_local(index_path)
    print(f"FAISS index saved at {index_path}")
    return vectorstore

# Load FAISS index
def load_faiss_index(index_path="repo_faiss_index"):
    """Load FAISS index."""
    embeddings = OpenAIEmbeddings()
    return FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)


def interact_with_repositories(faiss_index):
    """Set up a conversational interface with the repositories."""
    llm = ChatOpenAI(model="gpt-4")      
    retriever = faiss_index.as_retriever(search_type="similarity", search_kwargs={"k": 20})
    qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

    print("Start chatting about the repositories! Type 'exit' to end the conversation.")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break
        result = qa_chain.run(user_input)
        print(f"{result}")


repo_data = fetch_repositories()
if repo_data:
    documents = format_repo_data_for_faiss(repo_data)
    create_faiss_index(documents)

faiss_index = load_faiss_index()

interact_with_repositories(faiss_index)