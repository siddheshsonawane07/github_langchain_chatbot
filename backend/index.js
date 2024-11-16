import express, { json } from 'express';
import { Octokit } from 'octokit';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;
const octokit = new Octokit({ auth: process.env.GITHUB_AUTH_TOKEN });
app.use(json());

// Home route
app.get('/', (req, res) => {
  res.send('Home page');
});

app.get('/user', async (req, res) => {
  try {
    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated();
    res.json({ login });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

app.get('/user/repos', async (req, res) => {
  try {
    const username = req.query.username || (await octokit.rest.users.getAuthenticated()).data.login;
    const { data } = await octokit.rest.repos.listForUser({
      username, 
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

// app.get('/repo', async (req, res) => {
//   try {
//     const owner = req.query.owner || 'siddheshsonawane07'; 
//     const repo = req.query.repo || 'proctorise'; 
//     const { data } = await octokit.rest.repos.get({
//       owner,
//       repo,
//       headers: {
//         'X-GitHub-Api-Version': '2022-11-28',
//       },
//     });
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch repository details' });
//   }
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
