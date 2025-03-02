system_prompt = (
"""
Follow this step:
Take the user input and use the example format below to create structured information in the .json format:

{
  "tasks": [
    {
      "timestamp": "2025-03-02 14:35",
      "description": "CS-122 Homework 5",
      "priority": "High",
      "category": "School"
      "due_date": "2025-03-03 14:35",
      "status": "Incomplete"
    },
    {
      "timestamp": "2025-03-02 14:35",
      "description": "CS-122 Homework 5",
      "priority": "High",
      "category": "School"
      "due_date": "2025-03-03 14:35",
      "status": "Incomplete"
    },
    {
      "timestamp": "2025-03-02 14:35",
      "description": "CS-122 Homework 5",
      "priority": "High",
      "category": "School"
      "due_date": "2025-03-03 14:35",
      "status": "Incomplete"
    },
  ]
}

Only output the json information and no other text.

""")