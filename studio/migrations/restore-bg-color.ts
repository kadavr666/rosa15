import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'hp2p0iij',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
})

async function run() {
  const project = await client.fetch('*[_type == "project"][0]{ _id, sections }')
  const sections = project.sections.map((s: any) => {
    if (s._type === 'listSection' && s.title === 'SUPPORT HERE') {
      return {
        ...s,
        backgroundColor: {
          _type: 'color',
          hex: '#ff0000',
          alpha: 1,
          hsl: { _type: 'hslaColor', h: 0, s: 1, l: 0.5, a: 1 },
          hsv: { _type: 'hsvaColor', h: 0, s: 1, v: 1, a: 1 },
          rgb: { _type: 'rgbaColor', r: 255, g: 0, b: 0, a: 1 },
        }
      }
    }
    return s
  })
  await client.patch(project._id).set({ sections }).commit()
  console.log('Done — background color restored on SUPPORT HERE')
}

run().catch(console.error)
