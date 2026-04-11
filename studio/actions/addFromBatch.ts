import { useDocumentOperation } from 'sanity'

const CONFIG: Record<string, { inputField: string; targetField: string; itemType: string }> = {
    supporters: { inputField: 'batchInput',      targetField: 'items',      itemType: 'supporterItem' },
    project:    { inputField: 'supportersBatch', targetField: 'supporters', itemType: 'supporterItem' },
}

export function AddFromBatchAction(props: any) {
    const { patch } = useDocumentOperation(props.id, props.type)
    const cfg = CONFIG[props.type]
    if (!cfg) return null

    const doc = props.draft ?? props.published
    const hasInput = !!(doc?.[cfg.inputField]?.trim())

    return {
        label: '+ Add from batch',
        disabled: !hasInput,
        onHandle: () => {
            if (!hasInput) return
            const names: string[] = doc[cfg.inputField]
                .split('\n')
                .map((n: string) => n.trim())
                .filter(Boolean)

            const newItems = names.map((name: string) => ({
                _type: cfg.itemType,
                _key: Math.random().toString(36).slice(2, 10),
                name,
            }))

            patch.execute([
                {
                    set: {
                        [cfg.targetField]: [...(doc[cfg.targetField] || []), ...newItems],
                        [cfg.inputField]: '',
                    },
                },
            ])

            props.onComplete()
        },
    }
}
