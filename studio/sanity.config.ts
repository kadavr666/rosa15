import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {schemaTypes} from './schemaTypes'
import './custom.css'

export default defineConfig({
  name: 'default',
  title: 'rosa15',
  basePath: '/studio',

  projectId: 'hp2p0iij',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('List of Supporters')
              .child(
                S.document()
                  .title('List of Supporters')
                  .schemaType('supporters')
                  .documentId('supporters')
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== 'supporters'
            ),
          ]),
    }),
    visionTool(),
    colorInput(),
  ],

  schema: {
    types: schemaTypes,
  },

})
