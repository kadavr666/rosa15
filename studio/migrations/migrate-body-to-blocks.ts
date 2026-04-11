/**
 * Migrates textSection.body fields from plain string to Portable Text blocks.
 * Run from the studio directory:
 *   npx sanity exec migrations/migrate-body-to-blocks.ts --with-user-token
 */

import { createClient } from '@sanity/client'

const client = createClient({
    projectId: 'hp2p0iij',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_AUTH_TOKEN,
})

function stringToBlocks(text: string) {
    // Split on single newlines — each line becomes its own paragraph block.
    // Blank lines produce an empty paragraph, preserving spacing.
    return text.split('\n').map((line) => ({
        _type: 'block',
        _key: Math.random().toString(36).slice(2, 10),
        style: 'normal',
        markDefs: [],
        children: [
            {
                _type: 'span',
                _key: Math.random().toString(36).slice(2, 10),
                text: line,
                marks: [],
            },
        ],
    }))
}

async function run() {
    const projects = await client.fetch(
        '*[_type == "project" && defined(sections)]{ _id, sections }'
    )

    let patchCount = 0

    for (const project of projects) {
        const sections = project.sections as any[]
        let changed = false

        const newSections = sections.map((section: any) => {
            if (section._type === 'textSection' && typeof section.body === 'string') {
                changed = true
                console.log(`  Migrating section "${section.title || '(no title)'}" in project ${project._id}`)
                return { ...section, body: stringToBlocks(section.body) }
            }
            return section
        })

        if (changed) {
            await client.patch(project._id).set({ sections: newSections }).commit()
            patchCount++
            console.log(`✓ Patched project ${project._id}`)
        }
    }

    console.log(`\nDone. ${patchCount} document(s) migrated.`)
}

run().catch((err) => { console.error(err); process.exit(1) })
