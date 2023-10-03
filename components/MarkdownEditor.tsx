"use client"
import "@mdxeditor/editor/style.css"
import dynamic from "next/dynamic"
import React from "react"

import { UndoRedo } from "@mdxeditor/editor/plugins/toolbar/components/UndoRedo"
import { BoldItalicUnderlineToggles } from "@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles"
import { toolbarPlugin } from "@mdxeditor/editor/plugins/toolbar"

class MarkdownEditor extends React.Component {
  render() {
    const MDXEditor = dynamic(
      // preferred way
      () => import("@mdxeditor/editor/MDXEditor").then((mod) => mod.MDXEditor),
      // legacy, larger bundle
      // () => import('@mdxeditor/editor').then((mod) => mod.MDXEditor),
      { ssr: false }
    )

    return (
      <MDXEditor
        {...this.props}
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <>
                {" "}
                <UndoRedo />
                <BoldItalicUnderlineToggles />
              </>
            ),
          }),
        ]}
      />
    )
  }
}

export default MarkdownEditor
