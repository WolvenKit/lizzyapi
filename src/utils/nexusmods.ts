export async function NexusModsQuery(username: string) {
  const User = await fetch(process.env.NEXUSMODS_URI!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query Query($filter: ModsFilter!, $sort: [ModsSort!], $count: Int, $name: String!) {
                mods(filter: $filter, sort: $sort, count: $count) {
                    nodes {
                        modId
                        name
                        version
                        downloads
                        endorsements
                        adultContent
                        summary
                        pictureUrl
                        game {
                          domainName
                        }
                        status
                        modCategory {
                          name
                        }
                    }
                }
                userByName(name: $name) {
                    name
                    modCount
                    avatar
                    kudos
                    country
                    uniqueModDownloads
                    memberId
                    about
                    posts
                }
            }`,
      variables: JSON.stringify({
        count: 4,
        name: username,
        filter: { author: { value: username, op: "EQUALS" } },
        sort: [{ endorsements: { direction: "DESC" } }],
      }),
    }),
  });

  const data = await User.json();

  return data.data;
}
