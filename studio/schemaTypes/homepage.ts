import {defineType, defineField, defineArrayMember} from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'textSection',
          title: 'Text Section',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
            defineField({name: 'body', title: 'Body', type: 'text'}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'subtitle'},
          },
        }),
        defineArrayMember({
          name: 'listSection',
          title: 'List Section',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text'}),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({name: 'title', title: 'Title', type: 'string'}),
                    defineField({name: 'description', title: 'Description', type: 'text'}),
                    defineField({name: 'price', title: 'Price', type: 'string'}),
                  ],
                  preview: {
                    select: {title: 'title', subtitle: 'price'},
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'title'},
          },
        }),
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'text',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
  ],
})
