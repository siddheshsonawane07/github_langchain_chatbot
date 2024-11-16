import express, { json } from 'express';
import { Octokit } from 'octokit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN }); 

app.use(json());

app.get('/', (req, res) => {
  res.send('Home page');
});

app.get('/repos', async (req, res) => {
  try {
    const { data } = await octokit.request('GET /users/{username}/', {
      username: 'siddheshsonawane07' 
    });
    res.json(data); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
