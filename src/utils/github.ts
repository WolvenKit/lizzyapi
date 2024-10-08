import { prisma } from "utils";
import type { GraphData, GithubData } from "types";
import { App } from "octokit";
import fs from "fs";

const key = fs.readFileSync(
  `./src/keys/github/${process.env.GITHUB_APP_KEY_FILE!}`,
  "utf-8"
);

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: key,
  auth: {
    id: process.env.GITHUB_APP_ID!,
    privateKey: key,
    installationId: process.env.GITHUB_INSTALLATION_ID!,
  },
  installationId: process.env.GITHUB_INSTALLATION_ID!,
});

export const octokit = await app.getInstallationOctokit(
  Number(process.env.GITHUB_INSTALLATION_ID!)
);

export async function Updater() {
  try {
    const GraphData: GraphData = await octokit.graphql(
      `
    query {
red4ext: repository(owner: "WopsS", name: "RED4ext") {
    latestRelease {
      tagName
      updatedAt
      url
    }
  }
  archivexl: repository(owner: "psiberx", name: "cp2077-archive-xl") {
    latestRelease {
      tagName
      updatedAt
      url
    }
  }
  tweakxl: repository(owner: "psiberx", name: "cp2077-tweak-xl") {
    latestRelease {
      tagName
      updatedAt
      url
    }
  }
  codeware: repository(owner: "psiberx", name: "cp2077-codeware") {
    latestRelease {
      tagName
      updatedAt
      url
    }
  }
  cet: repository(owner: "maximegmd", name: "CyberEngineTweaks") {
    latestRelease {
      tagName
      updatedAt
      url
    }
  }
  redscript: repository(owner: "jac3km4", name: "redscript") {
    latestRelease {
      tagName
      updatedAt
      url
    }
  }
}
    `
    );

    const data = await prisma.github.upsert({
      where: {
        id: "1",
      },
      update: {
        red4ext: GraphData.red4ext,
        archivexl: GraphData.archivexl,
        tweakxl: GraphData.tweakxl,
        codeware: GraphData.codeware,
        cet: GraphData.cet,
        redscript: GraphData.redscript,
        updated: new Date(),
      },
      create: {
        id: "1",
        red4ext: GraphData.red4ext,
        archivexl: GraphData.archivexl,
        tweakxl: GraphData.tweakxl,
        codeware: GraphData.codeware,
        cet: GraphData.cet,
        redscript: GraphData.redscript,
        created: new Date(),
        updated: new Date(),
      },
    });

    if (data) return true;
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function GithubUserContributions(
  author: string,
  repo: string = "wolvenkit"
): Promise<GithubData | unknown> {

  if (!author) return null;
  
  try {
    const RedModdingRepos = await octokit.rest.repos.listForUser({
      username: repo,
    });

    const RepoIds = RedModdingRepos.data.map((repo) => {
      return repo.node_id;
    });

    const GithubUserByName = await octokit.rest.users.getByUsername({
      username: author,
    });

    const GithubUserId = GithubUserByName.data.node_id;
    const data: GithubData = await octokit.graphql(
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

    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}
