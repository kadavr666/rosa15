import {defineType, defineField, defineArrayMember} from 'sanity'

export const preview = defineType({
  name: 'preview',
  title: 'Preview',
  type: 'document',
  fields: [
    defineField({
      name: 'artist',
      title: 'Artist',
      type: 'string',
    }),
    defineField({
      name: 'albumTitle',
      title: 'Album Title',
      type: 'string',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'string',
    }),
    defineField({
      name: 'catalogueNo',
      title: 'Catalogue No.',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'artwork',
      title: 'Artwork',
      type: 'image',
    }),
    defineField({
      name: 'slug',
      title: 'Private URL slug',
      type: 'slug',
      description: 'This becomes the private URL, e.g. /preview/abc482mkcs',
      options: {source: 'albumTitle'},
    }),
    defineField({
      name: 'tracks',
      title: 'Tracks',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'audioFile', title: 'Audio File', type: 'file', options: {accept: 'audio/*'}}),
          ],
          preview: {
            select: {title: 'title'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'albumTitle', subtitle: 'artist'},
  },
})
