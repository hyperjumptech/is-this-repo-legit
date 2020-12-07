import { useQuery } from "react-apollo";
import gql from "graphql-tag";

import "./App.css";
import "bulma/css/bulma.css";
import Header from "./components/Header";
import Score from "./components/Score";
import DataTable from "./components/DataTable";
import {useEffect, useState } from "react";

function App() {
  const [url, setUrl] = useState('')
  const [ownerText, setOwnerText] = useState('')
  const [repoText, setRepoText] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const response = useQuery(queries, {
    variables: {
      owner: ownerText,
      repo: repoText
    },
  })

  const handleChangeInput = (e) => {
    const newUrl = e.target.value
    setUrl(newUrl)
  }

  const runAudit = () => {
    setLoading(true)

    const params = url.split('/')
    const githubUrlIdx = params.indexOf('github.com')
    
    let owner = ''
    let repo = ''

    if (githubUrlIdx && params.length + 1 > githubUrlIdx) {
      owner = params[githubUrlIdx + 1]
      repo = params[githubUrlIdx + 2]
    }

    if(!!owner && !!repo) {
      setOwnerText(owner)
      setRepoText(repo)
    }

    setTimeout(() => setLoading(false), 500)
  }

  const responseData = response?.data?.repository || null

  useEffect(() => {
    let newStatus = 'DEPRECATED'

    if (!responseData) {
      return;
    }

    const curDate = new Date();
    const lastYear = curDate.setFullYear(curDate.getFullYear() - 1);
    
    // deprecated
    // - last PR mergedAt >1 year ago
    // - last release publishedAt >1 years ago
    const updatedAt = new Date(responseData?.updatedAt)
    if (
      responseData.updatedAt &&
      updatedAt < lastYear
      ) {
      newStatus = 'NOT LEGIT'
    }
    
    
    // normal
    // - last merged PR within past 1 year
    // - last release publishedAt within past 1 year    
    // const publishedAt = new Date(responseData.releases?.edges?.node?.publishedAt)
    // if (
    //   responseData.releases?.edges?.node?.publishedAt &&
    //   publishedAt > lastYear
    //   ) {
    //   newStatus = 'NORMAL'
    // }
    
    const {
      stargazerCount,
      open_issues,
      closed_issues,
      forkCount,
      open_pull_requests,
      merged_pull_requests
    } = responseData;
    
    const issuePercentage = (open_issues?.totalCount * 100) / (open_issues?.totalCount + closed_issues?.totalCount)
    const totalIssue = open_issues?.totalCount + closed_issues?.totalCount
    const pullRequestPercentage = (open_pull_requests?.totalCount * 100) / (open_pull_requests?.totalCount + merged_pull_requests?.totalCount)

    // good
    // - 100++ stars
    // - issues OPEN < 300 (?)
    // - issues OPEN / CLOSED < 60% (?)
    // - total issues OPEN + CLOSE > 20
    // - PR OPEN / MERGED < 60%
    if (
      stargazerCount > 100 &&
      open_issues?.totalCount < 300 &&
      (issuePercentage < 60 || totalIssue > 20) &&
      pullRequestPercentage < 60
      ) {
      newStatus = 'GOOD'
    }
    
    // awesome
    // - stars 500++
    // - fork 100++
    // - issues OPEN / CLOSE < 30%
    // - total issues OPEN + CLOSE > 200
    // - PR OPEN / MERGED < 10%
    if (
      stargazerCount > 500 &&
      forkCount > 100 &&
      (issuePercentage < 30 || totalIssue > 200) &&
      pullRequestPercentage < 60
      ) {
      newStatus = 'LEGIT'
    }
    
    setStatus(newStatus)    
  }, [responseData])

  return (
    <div>
      <Header />
      <section className="hero">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title">Measure</h1>
            <h2 className="subtitle">Find out is this repo legit</h2>

            <div className="columns">
              <div className="column is-8 is-offset-1">
                <input
                  className="input is-medium"
                  type="text"
                  placeholder="Enter a github repo URL"
                  onChange={handleChangeInput}
                />
              </div>
              <div className="column is-2">
                <button 
                  className="button is-info is-outlined is-medium is-fullwidth"
                  onClick={() => runAudit()}
                >
                  Run Audit
                </button>
              </div>
            </div>

            {loading && <div>Loading...</div>}
            {!!responseData && <Score status={status} />}
          </div>
        </div>
      </section>
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            {!!responseData && <DataTable data={responseData} />}
          </div>
        </div>
      </section>
    </div>
  );
}

const queries = gql`
  query(
    $owner: String!
    $repo: String!
  ) {
    repository(owner: $owner, name: $repo) {
      createdAt
        defaultBranchRef {
        name
        prefix
      }
      description
      forkCount
      hasProjectsEnabled
      hasWikiEnabled
      isArchived
      isBlankIssuesEnabled
      isDisabled
      isEmpty
      isFork
      isInOrganization
      isLocked
      isMirror
      isPrivate
      isSecurityPolicyEnabled
      isTemplate
      isUserConfigurationRepository
      mirrorUrl
      name
      nameWithOwner
      openGraphImageUrl
      stargazerCount
      updatedAt
      usesCustomOpenGraphImage
      viewerCanAdminister
      viewerCanCreateProjects
      viewerCanSubscribe
      viewerCanUpdateTopics
      viewerDefaultCommitEmail
      viewerDefaultMergeMethod
      viewerHasStarred
      viewerPossibleCommitEmails
      open_issues: issues(states: OPEN) {
        totalCount
      }
      closed_issues: issues(states: CLOSED) {
        totalCount
      }
      open_pull_requests: pullRequests(states: OPEN) {
        totalCount
      }
      merged_pull_requests: pullRequests(states: MERGED) {
        totalCount
      }
      releases(first: 1, orderBy: {direction: DESC, field: CREATED_AT}) {
        edges {
            node {
              name
              publishedAt
            }
        }
      }
    }
  }
`;

export default App

// export default graphql(queries, {
//   options: {
//     variables: {
//       owner: "raosan",
//       repo: "is-this-repo-legit"
//     }
//   }
// })(App);

