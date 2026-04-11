import React from 'react'
import { set, unset, useFormValue, useDocumentOperation } from 'sanity'
import type { StringInputProps } from 'sanity'

const CONFIG: Record<string, { targetField: string }> = {
    supporters: { targetField: 'items' },
    project:    { targetField: 'supporters' },
}

export function BatchInput(props: StringInputProps) {
    const { value, onChange } = props
    const doc = useFormValue([]) as any
    const docId = doc?._id?.replace('drafts.', '')
    const docType = doc?._type
    const { patch } = useDocumentOperation(docId, docType)
    const cfg = CONFIG[docType]

    function handleAdd() {
        if (!value?.trim() || !cfg) return
        const names = value.split('\n').map((n: string) => n.trim()).filter(Boolean)
        const newItems = names.map((name: string) => ({
            _type: 'supporterItem',
            _key: Math.random().toString(36).slice(2, 10),
            name,
        }))
        const existing = doc?.[cfg.targetField] || []
        patch.execute([{ set: { [cfg.targetField]: [...existing, ...newItems] } }])
        onChange(unset())
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value ? set(e.target.value) : unset())}
                rows={5}
                placeholder="One name per line"
                style={{
                    width: '100%',
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    padding: '8px',
                    border: '1px solid var(--card-border-color, #e0e0e0)',
                    borderRadius: '3px',
                    resize: 'vertical',
                }}
            />
            <button
                type="button"
                onClick={handleAdd}
                disabled={!value?.trim()}
                style={{
                    alignSelf: 'flex-start',
                    padding: '6px 14px',
                    fontSize: '13px',
                    border: '1px solid currentColor',
                    borderRadius: '3px',
                    background: 'none',
                    cursor: value?.trim() ? 'pointer' : 'not-allowed',
                    opacity: value?.trim() ? 1 : 0.4,
                }}
            >
                + Add from batch
            </button>
        </div>
    )
}
