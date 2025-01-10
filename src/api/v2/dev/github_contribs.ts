import express from "express";
import { octokit } from "utils";
const router = express.Router();

router.post("/", async (req, res) => {
  const author = "moonded";

  const RedModdingRepos = await octokit.rest.repos.listForUser({
    username: "wolvenkit",
  });

  const RepoIds = RedModdingRepos.data.map((repo) => {
    return repo.node_id;
  });

  const GithubUserByName = await octokit.rest.users.getByUsername({
    username: author,
  });

  const GithubUserId = GithubUserByName.data.node_id;

  try {
    const data = await octokit.graphql(
      `
      query ($repos: [ID!]!, $author: String!, $authorId: ID!) {
          nodes(ids: $repos) {
            ... on Repository {
              nameWithOwner
              issues(filterBy: { createdBy: $author }) {
                totalCount
              }
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(author: { id: $authorId }) {
                      totalCount
                    }
                  }
                }
              }
            }
          }
        }
      `,
      {
        author: author,
        authorId: GithubUserId,
        repos: RepoIds,
      }
    );

    console.log(data);

    res.send(data);
  } catch (error) {
    res.send(error);
  }
});

export default router;
