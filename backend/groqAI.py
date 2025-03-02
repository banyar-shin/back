import os
import json
from groq import Groq
from system_prompt import system_prompt

def genJSON(task: str):
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    stream = client.chat.completions.create(
        #
        # Required parameters
        #
        messages=[
            # Set an optional system message. This sets the behavior of the
            # assistant and can be used to provide specific instructions for
            # how it should behave throughout the conversation.
            {
                "role": "system",
                "content": system_prompt,
            },
            # Set a user message for the assistant to respond to.
            {
                "role": "user",
                "content": task,
            }
        ],

        # The language model which will generate the completion.
        model="llama-3.3-70b-versatile",

        #
        # Optional parameters
        #

        # Controls randomness: lowering results in less random completions.
        # As the temperature approaches zero, the model will become deterministic
        # and repetitive.
        temperature=0.5,

        # The maximum number of tokens to generate. Requests can use up to
        # 2048 tokens shared between prompt and completion.
        max_completion_tokens=1024,

        # Controls diversity via nucleus sampling: 0.5 means half of all
        # likelihood-weighted options are considered.
        top_p=1,

        # A stop sequence is a predefined or user-specified text string that
        # signals an AI to stop generating content, ensuring its responses
        # remain focused and concise. Examples include punctuation marks and
        # markers like "[end]".
        stop=None,

        # If set, partial message deltas will be sent.
        stream=True,
    )

    # Print the incremental deltas returned by the LLM.
    result = ""
    for chunk in stream:
        result += chunk.choices[0].delta.content or ""

    data = json.loads(result)
    with open("tasks.json", "w") as file:
        json.dump(data, file, indent=4)
    return result


def generate_reply(jsonData: str):
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    stream = client.chat.completions.create(
        #
        # Required parameters
        #
        messages=[
            # Set an optional system message. This sets the behavior of the
            # assistant and can be used to provide specific instructions for
            # how it should behave throughout the conversation.
            {
                "role": "system",
                "content": "this is the list of tasks that you have added to the user's calendar, generate a text message like response saying you have successfully did that for the user and also summarize the tasks. This message should be a response, no greets are needed"
            },
            # Set a user message for the assistant to respond to.
            {
                "role": "user",
                "content": jsonData,
            }
        ],

        # The language model which will generate the completion.
        model="llama-3.3-70b-versatile",

        #
        # Optional parameters
        #

        # Controls randomness: lowering results in less random completions.
        # As the temperature approaches zero, the model will become deterministic
        # and repetitive.
        temperature=0.5,

        # The maximum number of tokens to generate. Requests can use up to
        # 2048 tokens shared between prompt and completion.
        max_completion_tokens=1024,

        # Controls diversity via nucleus sampling: 0.5 means half of all
        # likelihood-weighted options are considered.
        top_p=1,

        # A stop sequence is a predefined or user-specified text string that
        # signals an AI to stop generating content, ensuring its responses
        # remain focused and concise. Examples include punctuation marks and
        # markers like "[end]".
        stop=None,

        # If set, partial message deltas will be sent.
        stream=True,
    )

    # Print the incremental deltas returned by the LLM.
    result = ""
    for chunk in stream:
        result += chunk.choices[0].delta.content or ""
    return result