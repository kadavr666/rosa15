import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'hp2p0iij',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
})

async function run() {
  const projects = await client.fetch('*[_type == "project"]{ _id, sections }')

  for (const project of projects) {
    if (!project.sections?.length) continue

    const sections = project.sections.map((section: any) => {
      if (section._type !== 'textSection' || !Array.isArray(section.body)) return section

      const extractedButtons: any[] = []

      const newBody = section.body
        .map((block: any) => {
          if (block._type !== 'block' || !block.markDefs?.length) return block

          const buttonDefs = block.markDefs.filter((md: any) => md._type === 'button')
          if (!buttonDefs.length) return block

          const buttonKeys = new Set(buttonDefs.map((md: any) => md._key))

          // extract button data, use span text as fallback label
          buttonDefs.forEach((md: any) => {
            const spanText = (block.children || [])
              .filter((child: any) => child.marks?.includes(md._key))
              .map((child: any) => child.text)
              .join('')

            extractedButtons.push({
              _type: 'object',
              _key: md._key,
              label: md.label || spanText || '',
              href: md.href || '',
              blank: md.blank ?? true,
            })
          })

          // strip button marks from spans
          const newChildren = (block.children || []).map((child: any) => {
            if (!child.marks?.some((m: string) => buttonKeys.has(m))) return child
            return {
              ...child,
              marks: child.marks.filter((m: string) => !buttonKeys.has(m)),
            }
          })

          // drop button markDefs
          const newMarkDefs = block.markDefs.filter((md: any) => md._type !== 'button')

          return {
            ...block,
            markDefs: newMarkDefs,
            children: newChildren,
          }
        })
        // remove blocks that are now fully empty (only button text that's now plain)
        .filter((block: any) => {
          if (block._type !== 'block') return true
          const text = (block.children || []).map((c: any) => c.text || '').join('').trim()
          return text.length > 0
        })

      return {
        ...section,
        body: newBody,
        buttons: [...(section.buttons || []), ...extractedButtons],
      }
    })

    await client.patch(project._id).set({sections}).commit()
    console.log(`Migrated: ${project._id}`)
  }

  console.log('Done.')
}

run().catch(console.error)
