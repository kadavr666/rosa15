import React from 'react'

export function AlignLeft(props: any) {
  return <div style={{textAlign: 'left'}}>{props.children}</div>
}

export function AlignCenter(props: any) {
  return <div style={{textAlign: 'center'}}>{props.children}</div>
}

export function AlignRight(props: any) {
  return <div style={{textAlign: 'right'}}>{props.children}</div>
}
