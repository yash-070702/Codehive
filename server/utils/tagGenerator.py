import sys
import json
from sentence_transformers import SentenceTransformer, util

# Load BERT model once
model = SentenceTransformer("all-MiniLM-L6-v2")

# Expanded predefined tag list
TAGS = [
    # 🔹 Programming Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C", "C#", "Go", "Rust", "PHP", "Swift", "Kotlin", 
    "R", "Ruby", "Dart", "Perl", "Scala", "Lua", "Objective-C", "Haskell", "Shell", "PowerShell", "Bash",
    
    # 🔹 Web Development
    "HTML", "CSS", "SCSS", "Tailwind CSS", "Bootstrap", "SASS", "Material-UI", "Chakra UI",

    # 🔹 Frontend Frameworks/Libraries
    "React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "SolidJS", "jQuery",

    # 🔹 Backend Frameworks/Libraries
    "Node.js", "Express.js", "FastAPI", "Django", "Flask", "Spring Boot", "ASP.NET", "Laravel", "Ruby on Rails",
    
    # 🔹 Databases
    "MongoDB", "PostgreSQL", "MySQL", "MariaDB", "Firebase", "Supabase", "DynamoDB", "Redis", "Cassandra", 
    "Neo4j", "CockroachDB", "Elasticsearch", "SQLite",

    # 🔹 DevOps & Cloud
    "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "Terraform", "Ansible", "CI/CD", "Jenkins", "GitHub Actions", 
    "Cloudflare", "Nginx", "Apache", "Serverless", "Netlify", "Vercel", "DigitalOcean", "Heroku",

    # 🔹 APIs & Communication
    "REST API", "GraphQL", "WebSockets", "Socket.io", "tRPC", "gRPC", "OAuth", "JWT", "OpenAPI", "Postman",

    # 🔹 Version Control & Tools
    "Git", "GitHub", "GitLab", "Bitbucket", "SVN", "CI/CD", "VS Code", "JIRA", "Trello",

    # 🔹 Machine Learning & AI
    "AI", "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "TensorFlow", "PyTorch", "Scikit-learn", 
    "Keras", "Hugging Face", "Transformers", "LLMs", "OpenAI API", "Stable Diffusion", "LangChain", "Pandas", "NumPy",

    # 🔹 Cybersecurity
    "Cybersecurity", "Ethical Hacking", "Penetration Testing", "OWASP", "Metasploit", "Burp Suite", "Security", "Zero Trust",

    # 🔹 Other Technologies
    "Blockchain", "Solidity", "Ethereum", "NFTs", "Web3", "Metaverse", "IoT", "AR/VR", "Quantum Computing"
]

def generate_tags(text, top_n=5):
    """Generate tags based on the input text"""
    text_embedding = model.encode(text, convert_to_tensor=True)
    tag_embeddings = model.encode(TAGS, convert_to_tensor=True)

    similarities = util.pytorch_cos_sim(text_embedding, tag_embeddings)[0]
    top_indices = similarities.argsort(descending=True)[:top_n]

    return [TAGS[i] for i in top_indices]

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No input text provided"}))
            sys.exit(1)
        
        text_input = sys.argv[1]
        tags = generate_tags(text_input)

        # Output valid JSON
        print(json.dumps({"tags": tags}))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
