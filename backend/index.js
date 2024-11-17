import express, { json } from 'express';
import { Octokit } from '@octokit/rest';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;
const octokit = new Octokit({auth : process.env.GITHUB_AUTH_TOKEN});
app.use(json());

app.get('/user', async (req, res) => {
  try{
    const { data } = await octokit.request("/user");
    res.json(data)
  }catch (err){
    res.send(err)
  }
});


app.get('/user/repos', async (req, res) => {
  try {
    const data = await octokit.paginate("GET /user/repos", { per_page: 100 });
    const repoDetails = await Promise.all(
      data.map(async (repo) => {
        let languages = "Not Specified";
        try {
          const languageResponse = await octokit.request(repo.languages_url);
          languages = Object.keys(languageResponse.data).join(", ") || "Not Specified";
        } catch (err) {
          console.error(`Error fetching languages for ${repo.name}:`, err.message);
        }

        return {
          name: repo.name,
          url: repo.html_url,
          language: languages,
          description: repo.description || "No Description",
          deployed_at: repo.homepage || "Not Deployed",
        };
      })
    );

    res.json(repoDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});


app.get('/user/reposss', async (req, res) => {
  try {
    // const {data} = await octokit.request("GET /user/repos")
    const data = await octokit.paginate("GET /user/repos",{per_page : 100})
    res.json(data)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
