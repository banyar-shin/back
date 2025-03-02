import os 
from groq import Groq

client = Groq(
    api_key=os.environ.get("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"),
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Explain the importance of fast language models",
        }
    ],
    model="llama-3.3-70b-versatile",
    stream=False,
)

print(chat_completion.choices[0].message.content)