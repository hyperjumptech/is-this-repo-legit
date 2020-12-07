const params = [
  {key: 'stargazerCount', label: 'Star'},
  {key: 'updatedAt', label: 'Last Updated'},
  {key: 'forkCount', label: 'Fork'},
  {key: 'merged_pull_requests', label: 'Merged PR', child: 'totalCount'},
  {key: 'open_issues', label: 'Open Issue', child: 'totalCount'},
  {label: 'Closed Issue', key: 'closed_issues', child: 'totalCount'},
  // {label: 'NPM Download'},
  // {label: 'README'},
  // {label: 'Get Started'},
  // {label: 'Website / Docs'},
]

export default params