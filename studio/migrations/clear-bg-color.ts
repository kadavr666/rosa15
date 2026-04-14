import {createClient} from '@sanity/client'
const client = createClient({ projectId: 'hp2p0iij', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token: process.env.SANITY_AUTH_TOKEN })
async function run() {
  const project = await client.fetch('*[_type == "project"][0]{ _id, sections }')
  const sections = project.sections.map((s: any) => {
    const { backgroundColor, ...rest } = s
    return rest
  })
  await client.patch(project._id).set({ sections }).commit()
  console.log('Done — background colors cleared')
}
run().catch(console.error)
