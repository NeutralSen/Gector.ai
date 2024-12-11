//const { OpenAI } = require('node-openai');
//const { OpenAI } = require('openai-node');
//const { OpenAI } = require('openai');

require("dotenv").config();
const OpenAI = require("openai");
const readline = require('readline');

const key = process.env.API_KEY;
const endpoint = process.env.API_ENDPOINT;


const openai = new OpenAI({
  apiKey: key,
  baseURL: endpoint,
});


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const systemMessage = {
  role: "system",
  content: `You are a helpful AI assistant with expertise in gaming and anime.
            You have extensive knowledge about Genshin Impact and other games.
            You should respond in a friendly, enthusiastic manner while maintaining accuracy.
            You can use emoji occasionally to make responses more engaging.
            Please keep responses concise unless asked for detailed explanations.`
};

async function chat(userInput) {
  try {
    const stream = await openai.chat.completions.create({
      model: "Gector-2",
      messages: [
        systemMessage,
        {
          role: "user",
          content: userInput
        }
      ],
	  temperature: 1.2,
    top_k: 0,
    top_p: 1,
    min_p: 0.1,
    typical_p: 1,
    top_a: 0,
    repetition_penalty: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
      max_tokens: 124,
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(content);
    }
    console.log('\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function main() {
  console.log('Chat started. Type your message (type "exit" to quit):\n');
  
  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log('Chat ended.');
        rl.close();
        return;
      }

      process.stdout.write('AI: ');
      await chat(input);
      askQuestion();
    });
  };

  askQuestion();
}

main();
