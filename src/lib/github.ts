"use server";

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface GitHubContributionData {
  totalContributions: number;
  weeks: {
    contributionDays: ContributionDay[];
  }[];
}

interface GitHubStats {
  totalContributions: number;
  contributionCalendar: ContributionDay[];
  repositories: number;
  followers: number;
  following: number;
}

const GITHUB_USERNAME = "jngonzales"; // Change this to your GitHub username

export async function getGitHubStats(): Promise<GitHubStats | null> {
  try {
    // Use GitHub GraphQL API to get contribution data
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
          repositories(ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
            totalCount
          }
          followers {
            totalCount
          }
          following {
            totalCount
          }
        }
      }
    `;

    const token = process.env.GITHUB_TOKEN;
    
    if (!token || token === "your_github_token_here") {
      console.warn("GITHUB_TOKEN not set, using mock data");
      return getMockData();
    }

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username: GITHUB_USERNAME },
      }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    const user = data.data.user;
    const calendar = user.contributionsCollection.contributionCalendar as GitHubContributionData;
    
    // Flatten weeks into array of days
    const contributionCalendar = calendar.weeks.flatMap(
      (week) => week.contributionDays
    );

    return {
      totalContributions: calendar.totalContributions,
      contributionCalendar,
      repositories: user.repositories.totalCount,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
    };
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    return getMockData();
  }
}

function getMockData(): GitHubStats {
  // Generate mock contribution data for the last 365 days
  const contributionCalendar: ContributionDay[] = [];
  const today = new Date();
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random contribution count (weighted towards lower numbers)
    const rand = Math.random();
    let count = 0;
    if (rand > 0.3) count = Math.floor(Math.random() * 3);
    if (rand > 0.7) count = Math.floor(Math.random() * 5) + 3;
    if (rand > 0.9) count = Math.floor(Math.random() * 8) + 5;
    
    contributionCalendar.push({
      date: date.toISOString().split("T")[0],
      contributionCount: count,
    });
  }

  return {
    totalContributions: contributionCalendar.reduce((sum, day) => sum + day.contributionCount, 0),
    contributionCalendar,
    repositories: 24,
    followers: 156,
    following: 89,
  };
}
