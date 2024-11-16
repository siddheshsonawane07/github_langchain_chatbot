import express, { json } from 'express';
import { Octokit } from 'octokit';
import * as dotenv from 'dotenv';

dotenv.config(); 

const app = express();
const port = 3000;
const octokit = new Octokit({auth : process.env.GITHUB_AUTH_TOKEN}); 
console.log(process.env.GITHUB_AUTH_TOKEN)
app.use(json());

app.get('/', (req, res) => {
  res.send('Home page');
});

app.get('/repos', async (req, res) => {
  try {
    const { data } = await octokit.request('GET /repos/{owner}/', {
      owner: 'siddheshsonawane07' 
    });
    res.json(data); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

app.get('/repo', async (req, res) => {
  try {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}', {
      owner: 'siddheshsonawane07',
      repo: 'proctorise',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    res.json(data); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
