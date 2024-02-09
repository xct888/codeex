import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({ apiKey: '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' });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX',
  });
});

app.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).send({
        error: 'Prompt is required in the request body',
      });
    }

    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    // Check if response has the expected structure
    if (response && response.choices && response.choices[0].text) {
        res.status(200).send({
          bot: response.choices[0].text,
        });
      } else {
        console.error('Unexpected API response:', response);
        res.status(500).send({
          error: 'Unexpected API response',
        });
      }
      
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send({
      error: 'Internal Server Error',
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));
