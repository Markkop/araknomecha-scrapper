import jobsData from '../../../data/raw/jobs'

/**
 * Map jobs by their id and titles.
 */
function mapJobs () {
  const jobs = jobsData.reduce((jobs, jobData) => {
    return { ...jobs, [jobData.definition.id]: { ...jobData.title } }
  }, {})
  console.log(jobs)
}

mapJobs()
