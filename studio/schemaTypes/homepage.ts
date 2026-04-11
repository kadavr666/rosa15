import {defineType, defineField, defineArrayMember} from 'sanity'
import {BatchInput} from '../components/BatchInput'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
    }),
    defineField({
      name: 'heroImageHover',
      title: 'Hero Image (Hover)',
      type: 'image',
    }),
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
            defineField({
              name: 'body',
              title: 'Body',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'block',
                  styles: [{title: 'Normal', value: 'normal'}],
                  lists: [],
                  marks: {
                    decorators: [
                      {title: 'Strong', value: 'strong'},
                      {title: 'Emphasis', value: 'em'},
                    ],
                    annotations: [
                      defineArrayMember({
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        fields: [
                          defineField({name: 'href', type: 'url', title: 'URL', validation: Rule => Rule.uri({ allowRelative: true })}),
                          defineField({name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true}),
                        ],
                      }),
                    ],
                  },
                }),
              ],
            }),
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
      name: 'supporters',
      title: 'Supporters',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'supporterItem',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
          ],
          preview: { select: { title: 'name' } },
        }),
      ],
    }),
    defineField({
      name: 'supportersBatch',
      title: 'Batch add supporters',
      type: 'string',
      components: { input: BatchInput },
    }),
  ],
})

export const supporters = defineType({
  name: 'supporters',
  title: 'List of Supporters',
  type: 'document',
  initialValue: {
    title: 'List of Supporters',
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'items',
      title: 'Supporters',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'supporterItem',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
          ],
          preview: { select: { title: 'name' } },
        }),
      ],
    }),
    defineField({
      name: 'batchInput',
      title: 'Batch add names',
      type: 'string',
      components: { input: BatchInput },
    }),
  ],
})

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
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
