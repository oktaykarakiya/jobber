let counter
let tracker = []
let index = 0
async function get_jobs(){
  let test = await Job.find()
  test.forEach((job) => {
    let existing = false
    counter = 0
    test.forEach((jab) => {
      if(job.insert.link == jab.insert.link){
        counter ++
        existing = true
      }
    })
    if(counter == 1){
      tracker.push({name: job, count: counter})
    }
    
  })
  track(tracker)
  tracker.forEach((count) => {
    if(count.count > 1){
      console.log(count)
    }
  })
  console.log('fuuuck')
}
