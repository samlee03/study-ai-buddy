## Prompts passed to Gemini API from the backend

flashcard_prompt = (
    "Return ONLY an array of pairs, with keys 'front' and 'back' of the vocabulary I list."
    "No supplementary text needed."
    "If the text provided isn't a traditional, front and back, try your best to synthesize information in a front and back order."
    "Also keep in mind of the user comments: "
)

mcq_prompt = (
    "Analyze the topic and ONLY return an array of questions with keys, question options and answer (one of the options), revolving this topic."
    "No other supplementary text needed."
    "Format it must be in: {question: .., options: .., answer}"
    "These are some user comments you may want to consider when creating the question set. "
)

short_response_prompt = (
    "Analyze the topic and ONLY return an array of questions in dictionary format with the question revolving this topic."
    "It should test for the following material and can be answered in a sentence or two."
    "Question should be easy to comprehend."
    "No other supplementary text needed."
    "Here are some comments from the user: "
)