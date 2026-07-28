'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import CharacterCount from '@tiptap/extension-character-count'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import Typography from '@tiptap/extension-typography'
import { useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Separator } from '@/components/ui/separator'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Quote,
  Heading1, Heading2, Heading3, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Highlighter, Link as LinkIcon, Undo2, Redo2, Minus, Type,
} from 'lucide-react'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  chapterNumber: string
  chapterTitle: string
}

export default function TiptapEditor({ content, onChange, chapterNumber, chapterTitle }: TiptapEditorProps) {
  const isSettingContent = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: `Commencez la redaction du Chapitre ${chapterNumber || 'I'}. ${chapterTitle || ''}...` }),
      Highlight.configure({ multicolor: true }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CharacterCount,
      TextStyle,
      Color,
      Link.configure({ openOnClick: true, HTMLAttributes: { class: 'text-emerald-600 underline' } }),
      Typography,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-full p-6 sm:p-10 text-[15px] leading-[1.8] font-serif text-slate-800',
      },
    },
    onUpdate: ({ editor }) => {
      if (!isSettingContent.current) {
        const html = editor.getHTML()
        onChange(html)
      }
    },
    immediatelyRender: false,
  })

  // Sync external content changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      isSettingContent.current = true
      editor.commands.setContent(content)
      isSettingContent.current = false
    }
  }, [content, editor])

  const addLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL du lien :')
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }, [editor])

  const characters = editor?.storage.characterCount?.characters() || 0
  const words = editor?.storage.characterCount?.words() || 0

  if (!editor) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="animate-pulse text-sm text-slate-400">Chargement de l'editeur...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white">
      {/* Toolbar */}
      <div className="shrink-0 border-b bg-white px-2 py-1 flex items-center gap-0.5 flex-wrap overflow-x-auto">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Annuler">
          <Undo2 className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Retablir">
          <Redo2 className="h-3.5 w-3.5" />
        </Button>

        <Separator orientation="vertical" className="h-5 mx-1" />

        {/* Text type */}
        <ToggleGroup type="single" value={
          editor.isActive('heading', { level: 1 }) ? 'h1' :
          editor.isActive('heading', { level: 2 }) ? 'h2' :
          editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'
        } onValueChange={(v) => {
          if (v === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run()
          else if (v === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run()
          else if (v === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run()
          else if (v === 'p') editor.chain().focus().setParagraph().run()
        }}>
          <ToggleGroupItem value="p" className="h-7 w-7 p-0" title="Paragraphe"><Type className="h-3.5 w-3.5" /></ToggleGroupItem>
          <ToggleGroupItem value="h1" className="h-7 w-7 p-0" title="Titre 1"><Heading1 className="h-3.5 w-3.5" /></ToggleGroupItem>
          <ToggleGroupItem value="h2" className="h-7 w-7 p-0" title="Titre 2"><Heading2 className="h-3.5 w-3.5" /></ToggleGroupItem>
          <ToggleGroupItem value="h3" className="h-7 w-7 p-0" title="Titre 3"><Heading3 className="h-3.5 w-3.5" /></ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <ToggleGroup type="multiple">
          <ToggleGroupItem value="bold" className="h-7 w-7 p-0" title="Gras" pressed={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-3.5 w-3.5" /></ToggleGroupItem>
          <ToggleGroupItem value="italic" className="h-7 w-7 p-0" title="Italique" pressed={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-3.5 w-3.5" /></ToggleGroupItem>
          <ToggleGroupItem value="underline" className="h-7 w-7 p-0" title="Souligner" pressed={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="h-3.5 w-3.5" /></ToggleGroupItem>
          <ToggleGroupItem value="strike" className="h-7 w-7 p-0" title="Barre" pressed={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="h-3.5 w-3.5" /></ToggleGroupItem>
          <ToggleGroupItem value="code" className="h-7 w-7 p-0" title="Code" pressed={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()}><Code className="h-3.5 w-3.5" /></ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <ToggleGroup type="single">
          <ToggleGroupItem value="left" className="h-7 w-7 p-0" title="Aligner a gauche" pressed={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft className="h-3.5 w-3.5" /></ToggleGroupItem>
          <ToggleGroupItem value="center" className="h-7 w-7 p-0" title="Centrer" pressed={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter className="h-3.5 w-3.5" /></ToggleGroupItem>
          <ToggleGroupItem value="right" className="h-7 w-7 p-0" title="Aligner a droite" pressed={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight className="h-3.5 w-3.5" /></ToggleGroupItem>
          <ToggleGroupItem value="justify" className="h-7 w-7 p-0" title="Justifier" pressed={editor.isActive({ textAlign: 'justify' })}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}><AlignJustify className="h-3.5 w-3.5" /></ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => editor.chain().focus().toggleBulletList().run()} pressed={editor.isActive('bulletList')} title="Liste a puces">
          <List className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => editor.chain().focus().toggleOrderedList().run()} pressed={editor.isActive('orderedList')} title="Liste numerotee">
          <ListOrdered className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => editor.chain().focus().toggleBlockquote().run()} pressed={editor.isActive('blockquote')} title="Citation">
          <Quote className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => editor.chain().focus().toggleCodeBlock().run()} pressed={editor.isActive('codeBlock')} title="Bloc de code">
          <Code className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Ligne horizontale">
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={addLink} pressed={editor.isActive('link')} title="Lien">
          <LinkIcon className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()} pressed={editor.isActive('highlight')} title="Surligner">
          <Highlighter className="h-3.5 w-3.5" />
        </Button>

        <div className="flex-1" />

        <span className="text-[10px] text-slate-400 tabular-nums whitespace-nowrap">
          {words} mots
        </span>
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Status bar */}
      <div className="shrink-0 border-t bg-slate-50 px-4 py-1 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-3">
          <span>{characters} caracteres</span>
          <span>{words} mots</span>
        </div>
        <span>Editeur enrichi TipTap</span>
      </div>
    </div>
  )
}