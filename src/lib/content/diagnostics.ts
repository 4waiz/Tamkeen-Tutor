import type { DiagnosticQuestion, Goal } from "@/lib/types";

/**
 * Seed diagnostic question banks — 8 questions per goal, each mapped to a
 * skill category. These power the assessment with zero external services.
 * `correct_index` is used by the scorer; it is never sent to the client.
 */
const BANK: Record<Goal, DiagnosticQuestion[]> = {
  ai_basics: [
    {
      id: "ai-1",
      skill_name: "AI Concepts",
      prompt: "What does it mean to 'train' a machine learning model?",
      options: [
        { index: 0, label: "Manually writing every rule it follows" },
        { index: 1, label: "Letting it learn patterns from example data" },
        { index: 2, label: "Plugging it into the internet" },
        { index: 3, label: "Restarting the computer" },
      ],
      correct_index: 1,
      explanation: "Models learn patterns from example data rather than from hand-written rules.",
    },
    {
      id: "ai-2",
      skill_name: "AI Concepts",
      prompt: "Which of these is an example of AI you might use at school?",
      options: [
        { index: 0, label: "A calculator adding two numbers" },
        { index: 1, label: "A chatbot that answers questions in your own words" },
        { index: 2, label: "A printer making copies" },
        { index: 3, label: "A light switch" },
      ],
      correct_index: 1,
      explanation: "A chatbot that understands and responds in natural language is an AI application.",
    },
    {
      id: "ai-3",
      skill_name: "Data Basics",
      prompt: "Why does the quality of data matter for AI?",
      options: [
        { index: 0, label: "It does not matter at all" },
        { index: 1, label: "Bad data can teach the model wrong patterns" },
        { index: 2, label: "More data is always worse" },
        { index: 3, label: "Data only affects the screen colour" },
      ],
      correct_index: 1,
      explanation: "Models learn from data, so biased or wrong data leads to wrong outputs.",
    },
    {
      id: "ai-4",
      skill_name: "Data Basics",
      prompt: "What is a 'dataset'?",
      options: [
        { index: 0, label: "A single number" },
        { index: 1, label: "A collection of examples used to train or test a model" },
        { index: 2, label: "A type of computer screen" },
        { index: 3, label: "A password" },
      ],
      correct_index: 1,
      explanation: "A dataset is an organised collection of examples (rows) the model learns from.",
    },
    {
      id: "ai-5",
      skill_name: "Prompting",
      prompt: "Which prompt is most likely to get a useful answer from an AI assistant?",
      options: [
        { index: 0, label: "'Help'" },
        { index: 1, label: "'Explain photosynthesis to a 14-year-old in 3 short points'" },
        { index: 2, label: "'Do the thing'" },
        { index: 3, label: "'???'" },
      ],
      correct_index: 1,
      explanation: "Specific prompts with audience and format produce clearer, more useful answers.",
    },
    {
      id: "ai-6",
      skill_name: "Ethics & Safety",
      prompt: "An AI gives you an answer for a school report. What should you do?",
      options: [
        { index: 0, label: "Copy it word for word and submit it" },
        { index: 1, label: "Check the facts and write it in your own words" },
        { index: 2, label: "Assume it is always correct" },
        { index: 3, label: "Share your friend's password to get more answers" },
      ],
      correct_index: 1,
      explanation: "AI can be wrong, so verify facts and do your own work to learn and stay honest.",
    },
    {
      id: "ai-7",
      skill_name: "Ethics & Safety",
      prompt: "Why should you avoid sharing personal data with public AI tools?",
      options: [
        { index: 0, label: "It makes the AI slower" },
        { index: 1, label: "Your private information could be stored or exposed" },
        { index: 2, label: "It changes the font" },
        { index: 3, label: "There is no reason to avoid it" },
      ],
      correct_index: 1,
      explanation: "Personal data shared with public tools may be retained, so protect your privacy.",
    },
    {
      id: "ai-8",
      skill_name: "Real-World Application",
      prompt: "Which is a realistic way a UAE student could use AI responsibly?",
      options: [
        { index: 0, label: "To take an exam for them secretly" },
        { index: 1, label: "To practise English by getting feedback on their writing" },
        { index: 2, label: "To impersonate a teacher" },
        { index: 3, label: "To spread fake news" },
      ],
      correct_index: 1,
      explanation: "Using AI to get practice feedback is a genuine, responsible learning use.",
    },
  ],

  coding_foundations: [
    {
      id: "code-1",
      skill_name: "Variables & Types",
      prompt: "What is a variable in programming?",
      options: [
        { index: 0, label: "A named place to store a value" },
        { index: 1, label: "A type of error" },
        { index: 2, label: "A keyboard key" },
        { index: 3, label: "A website" },
      ],
      correct_index: 0,
      explanation: "A variable is a named container that holds a value you can use and change.",
    },
    {
      id: "code-2",
      skill_name: "Variables & Types",
      prompt: "Which value is a string (text)?",
      options: [
        { index: 0, label: "42" },
        { index: 1, label: "true" },
        { index: 2, label: '"Dubai"' },
        { index: 3, label: "3.14" },
      ],
      correct_index: 2,
      explanation: 'Text wrapped in quotes, like "Dubai", is a string.',
    },
    {
      id: "code-3",
      skill_name: "Control Flow",
      prompt: "What does an 'if' statement do?",
      options: [
        { index: 0, label: "Repeats code forever" },
        { index: 1, label: "Runs code only when a condition is true" },
        { index: 2, label: "Deletes the program" },
        { index: 3, label: "Prints the date" },
      ],
      correct_index: 1,
      explanation: "An if statement runs its block only when the condition evaluates to true.",
    },
    {
      id: "code-4",
      skill_name: "Control Flow",
      prompt: "You want to do something 10 times. What is the best tool?",
      options: [
        { index: 0, label: "Write the same line 10 times" },
        { index: 1, label: "A loop" },
        { index: 2, label: "A variable" },
        { index: 3, label: "A comment" },
      ],
      correct_index: 1,
      explanation: "A loop repeats code a set number of times without duplicating lines.",
    },
    {
      id: "code-5",
      skill_name: "Functions",
      prompt: "Why do we use functions?",
      options: [
        { index: 0, label: "To make code slower" },
        { index: 1, label: "To reuse a block of logic with a name" },
        { index: 2, label: "To change the screen colour" },
        { index: 3, label: "Functions are not useful" },
      ],
      correct_index: 1,
      explanation: "Functions package reusable logic under a name so you avoid repeating yourself.",
    },
    {
      id: "code-6",
      skill_name: "Functions",
      prompt: "What is a function 'parameter'?",
      options: [
        { index: 0, label: "An input value the function receives" },
        { index: 1, label: "The function's name" },
        { index: 2, label: "An error message" },
        { index: 3, label: "A file" },
      ],
      correct_index: 0,
      explanation: "Parameters are named inputs a function uses to do its work.",
    },
    {
      id: "code-7",
      skill_name: "Debugging",
      prompt: "Your program crashes with an error message. What is the smartest first step?",
      options: [
        { index: 0, label: "Delete the whole project" },
        { index: 1, label: "Read the error message and find the line it points to" },
        { index: 2, label: "Restart the laptop and hope" },
        { index: 3, label: "Ignore it" },
      ],
      correct_index: 1,
      explanation: "Error messages usually name the file and line — read them first.",
    },
    {
      id: "code-8",
      skill_name: "Problem Solving",
      prompt: "What is the best way to approach a big coding problem?",
      options: [
        { index: 0, label: "Write all the code at once and run it" },
        { index: 1, label: "Break it into smaller steps and solve one at a time" },
        { index: 2, label: "Copy a random program" },
        { index: 3, label: "Give up" },
      ],
      correct_index: 1,
      explanation: "Decomposing a problem into small steps makes it solvable and testable.",
    },
  ],

  english_communication: [
    {
      id: "eng-1",
      skill_name: "Vocabulary",
      prompt: "Which word means 'to make something better'?",
      options: [
        { index: 0, label: "Worsen" },
        { index: 1, label: "Improve" },
        { index: 2, label: "Ignore" },
        { index: 3, label: "Forget" },
      ],
      correct_index: 1,
      explanation: "'Improve' means to make something better.",
    },
    {
      id: "eng-2",
      skill_name: "Vocabulary",
      prompt: "A synonym for 'confident' is:",
      options: [
        { index: 0, label: "Shy" },
        { index: 1, label: "Self-assured" },
        { index: 2, label: "Tired" },
        { index: 3, label: "Angry" },
      ],
      correct_index: 1,
      explanation: "'Self-assured' is a synonym for confident.",
    },
    {
      id: "eng-3",
      skill_name: "Grammar",
      prompt: "Choose the correct sentence.",
      options: [
        { index: 0, label: "She go to school every day." },
        { index: 1, label: "She goes to school every day." },
        { index: 2, label: "She going to school every day." },
        { index: 3, label: "She gone to school every day." },
      ],
      correct_index: 1,
      explanation: "Third-person singular present tense takes 's': 'She goes'.",
    },
    {
      id: "eng-4",
      skill_name: "Grammar",
      prompt: "Which sentence uses the past tense correctly?",
      options: [
        { index: 0, label: "Yesterday I buyed a book." },
        { index: 1, label: "Yesterday I bought a book." },
        { index: 2, label: "Yesterday I buy a book." },
        { index: 3, label: "Yesterday I buying a book." },
      ],
      correct_index: 1,
      explanation: "The past tense of 'buy' is the irregular form 'bought'.",
    },
    {
      id: "eng-5",
      skill_name: "Speaking Confidence",
      prompt: "You are giving a short class presentation. What helps most?",
      options: [
        { index: 0, label: "Reading every word silently in your head" },
        { index: 1, label: "Practising aloud and using a few clear key points" },
        { index: 2, label: "Speaking as fast as possible" },
        { index: 3, label: "Avoiding eye contact entirely" },
      ],
      correct_index: 1,
      explanation: "Practising aloud with clear key points builds fluency and confidence.",
    },
    {
      id: "eng-6",
      skill_name: "Reading Comprehension",
      prompt: "Read: 'Maryam saved money for months to buy a laptop for her studies.' Why did Maryam save money?",
      options: [
        { index: 0, label: "To buy a phone" },
        { index: 1, label: "To buy a laptop for her studies" },
        { index: 2, label: "To travel abroad" },
        { index: 3, label: "The text does not say" },
      ],
      correct_index: 1,
      explanation: "The sentence states she saved to buy a laptop for her studies.",
    },
    {
      id: "eng-7",
      skill_name: "Reading Comprehension",
      prompt: "In a paragraph, the 'main idea' is:",
      options: [
        { index: 0, label: "The first word" },
        { index: 1, label: "The most important point the writer makes" },
        { index: 2, label: "The longest sentence" },
        { index: 3, label: "The title only" },
      ],
      correct_index: 1,
      explanation: "The main idea is the central point the paragraph is making.",
    },
    {
      id: "eng-8",
      skill_name: "Writing Clarity",
      prompt: "Which is the clearest sentence?",
      options: [
        { index: 0, label: "The thing that I did was that I finished the homework that was given." },
        { index: 1, label: "I finished my homework." },
        { index: 2, label: "Homework finished by me it was." },
        { index: 3, label: "Done the homework is." },
      ],
      correct_index: 1,
      explanation: "'I finished my homework' is direct and clear — fewer words, same meaning.",
    },
  ],

  university_readiness: [
    {
      id: "uni-1",
      skill_name: "Study Skills",
      prompt: "Which study method usually works best for remembering material?",
      options: [
        { index: 0, label: "Re-reading the textbook once the night before" },
        { index: 1, label: "Spaced practice and testing yourself over several days" },
        { index: 2, label: "Highlighting everything" },
        { index: 3, label: "Studying only what you already know" },
      ],
      correct_index: 1,
      explanation: "Spaced repetition and self-testing beat last-minute cramming for retention.",
    },
    {
      id: "uni-2",
      skill_name: "Study Skills",
      prompt: "What is an effective way to take notes in a lecture?",
      options: [
        { index: 0, label: "Write down every single word" },
        { index: 1, label: "Capture key ideas in your own words and questions" },
        { index: 2, label: "Draw only pictures" },
        { index: 3, label: "Do not take notes" },
      ],
      correct_index: 1,
      explanation: "Summarising key ideas in your own words aids understanding more than transcribing.",
    },
    {
      id: "uni-3",
      skill_name: "Critical Thinking",
      prompt: "You read a claim online. What shows critical thinking?",
      options: [
        { index: 0, label: "Believing it because it has many likes" },
        { index: 1, label: "Checking the source and looking for evidence" },
        { index: 2, label: "Sharing it immediately" },
        { index: 3, label: "Assuming it is false because it is online" },
      ],
      correct_index: 1,
      explanation: "Critical thinking means evaluating sources and evidence, not popularity.",
    },
    {
      id: "uni-4",
      skill_name: "Critical Thinking",
      prompt: "What is a 'counter-argument'?",
      options: [
        { index: 0, label: "A point that supports your view" },
        { index: 1, label: "A point that challenges your view" },
        { index: 2, label: "A maths formula" },
        { index: 3, label: "A title page" },
      ],
      correct_index: 1,
      explanation: "A counter-argument is a reasoned objection to your position.",
    },
    {
      id: "uni-5",
      skill_name: "Application Writing",
      prompt: "What makes a strong university personal statement?",
      options: [
        { index: 0, label: "Listing every activity with no detail" },
        { index: 1, label: "Specific examples that show your motivation and growth" },
        { index: 2, label: "Copying a template exactly" },
        { index: 3, label: "Only describing your grades" },
      ],
      correct_index: 1,
      explanation: "Concrete examples of motivation and growth make a statement memorable.",
    },
    {
      id: "uni-6",
      skill_name: "Time Management",
      prompt: "You have three assignments due next week. What is the best approach?",
      options: [
        { index: 0, label: "Do them all the night before" },
        { index: 1, label: "Break each into tasks and schedule them across the week" },
        { index: 2, label: "Only do the easiest one" },
        { index: 3, label: "Wait for inspiration" },
      ],
      correct_index: 1,
      explanation: "Breaking work into scheduled tasks reduces stress and improves quality.",
    },
    {
      id: "uni-7",
      skill_name: "Research Skills",
      prompt: "Which source is most reliable for an academic essay?",
      options: [
        { index: 0, label: "A random social media post" },
        { index: 1, label: "A peer-reviewed journal or official statistics" },
        { index: 2, label: "An anonymous forum comment" },
        { index: 3, label: "A meme" },
      ],
      correct_index: 1,
      explanation: "Peer-reviewed and official sources are vetted and more reliable.",
    },
    {
      id: "uni-8",
      skill_name: "Research Skills",
      prompt: "Why do we cite our sources?",
      options: [
        { index: 0, label: "To make the essay longer" },
        { index: 1, label: "To give credit and let readers verify claims" },
        { index: 2, label: "It is not necessary" },
        { index: 3, label: "To hide where ideas came from" },
      ],
      correct_index: 1,
      explanation: "Citation credits original authors and lets readers check your evidence.",
    },
  ],

  entrepreneurship_skills: [
    {
      id: "ent-1",
      skill_name: "Idea Validation",
      prompt: "You have a business idea. What is the smartest first step?",
      options: [
        { index: 0, label: "Spend all your savings building it" },
        { index: 1, label: "Talk to potential customers to test the need" },
        { index: 2, label: "Keep it secret from everyone" },
        { index: 3, label: "Design a logo first" },
      ],
      correct_index: 1,
      explanation: "Validating real demand with customers comes before heavy investment.",
    },
    {
      id: "ent-2",
      skill_name: "Idea Validation",
      prompt: "What is a 'minimum viable product' (MVP)?",
      options: [
        { index: 0, label: "The final, perfect product" },
        { index: 1, label: "The simplest version that tests the core idea" },
        { index: 2, label: "A marketing video" },
        { index: 3, label: "A company logo" },
      ],
      correct_index: 1,
      explanation: "An MVP is the simplest build that lets you learn whether the idea works.",
    },
    {
      id: "ent-3",
      skill_name: "Customer Understanding",
      prompt: "What does 'target customer' mean?",
      options: [
        { index: 0, label: "Everyone in the world" },
        { index: 1, label: "The specific group most likely to need your product" },
        { index: 2, label: "Your competitors" },
        { index: 3, label: "Your suppliers" },
      ],
      correct_index: 1,
      explanation: "A target customer is the specific group whose problem you solve best.",
    },
    {
      id: "ent-4",
      skill_name: "Customer Understanding",
      prompt: "Best way to learn what customers really want?",
      options: [
        { index: 0, label: "Guess based on your own taste" },
        { index: 1, label: "Ask open questions and listen to their problems" },
        { index: 2, label: "Only read about other companies" },
        { index: 3, label: "Assume they want the cheapest price" },
      ],
      correct_index: 1,
      explanation: "Open interviews about real problems reveal genuine customer needs.",
    },
    {
      id: "ent-5",
      skill_name: "Financial Basics",
      prompt: "If a product costs AED 20 to make and sells for AED 50, the profit per unit is:",
      options: [
        { index: 0, label: "AED 70" },
        { index: 1, label: "AED 30" },
        { index: 2, label: "AED 20" },
        { index: 3, label: "AED 50" },
      ],
      correct_index: 1,
      explanation: "Profit per unit = price (50) − cost (20) = AED 30.",
    },
    {
      id: "ent-6",
      skill_name: "Financial Basics",
      prompt: "What is 'revenue'?",
      options: [
        { index: 0, label: "Money left after all costs" },
        { index: 1, label: "Total money earned from sales before costs" },
        { index: 2, label: "Money you owe" },
        { index: 3, label: "The price of one item" },
      ],
      correct_index: 1,
      explanation: "Revenue is total income from sales, before subtracting costs.",
    },
    {
      id: "ent-7",
      skill_name: "Pitching",
      prompt: "What should a 60-second pitch focus on?",
      options: [
        { index: 0, label: "Every technical detail" },
        { index: 1, label: "The problem, your solution, and why it matters" },
        { index: 2, label: "Only the price" },
        { index: 3, label: "Your life story" },
      ],
      correct_index: 1,
      explanation: "A strong short pitch covers the problem, the solution, and the impact.",
    },
    {
      id: "ent-8",
      skill_name: "Execution & Planning",
      prompt: "You have a great plan but limited time. What helps most?",
      options: [
        { index: 0, label: "Trying to do everything at once" },
        { index: 1, label: "Prioritising the few tasks with the biggest impact" },
        { index: 2, label: "Waiting until conditions are perfect" },
        { index: 3, label: "Avoiding any planning" },
      ],
      correct_index: 1,
      explanation: "Focusing on the highest-impact tasks first is how lean teams execute.",
    },
  ],
};

/**
 * Returns the 8 diagnostic questions for a goal. Deterministic so results
 * are reproducible and can be snapshotted into the assessment record.
 */
export function generateDiagnosticQuestions(goal: Goal): DiagnosticQuestion[] {
  return BANK[goal];
}

/** Strip answer keys before sending questions to the browser. */
export function toPublicQuestions(questions: DiagnosticQuestion[]) {
  return questions.map(({ correct_index, explanation, ...rest }) => rest);
}
