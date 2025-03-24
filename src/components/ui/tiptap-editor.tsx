"use client";

import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import FontFamily from "@tiptap/extension-font-family";
import { Extension, CommandProps } from '@tiptap/core'
import Highlight from "@tiptap/extension-highlight";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image as ImageIcon,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Underline as UnderlineIcon,
  Hash,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Quote,
  Table as TableIcon,
  Code as CodeIcon,
  Minus
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toolbar, ToolbarButton } from "@/components/ui/toolbar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

interface FontSizeOptions {
  types: string[]
}

interface FontSizeAttributes extends Record<string, any> {
  fontSize: string | null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set the font size
       */
      setFontSize: (fontSize: string) => ReturnType
    }
  }
}

const CustomFontSize = Extension.create<FontSizeOptions>({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle']
    }
  },

  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize,
        renderHTML: (attributes: FontSizeAttributes) => {
          if (!attributes.fontSize) return {}
          return {
            style: `font-size: ${attributes.fontSize}`
          }
        }
      }
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize,
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.fontSize) return {}
              return {
                style: `font-size: ${attributes.fontSize}`
              }
            }
          }
        }
      }
    ]
  },

  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: CommandProps) => {
        return chain().setMark('textStyle', { fontSize }).run()
      }
    }
  }
})

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        heading: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        paragraph: {
          HTMLAttributes: {
            class: 'prevent-submit'
          }
        }
      }),
      BulletList,
      OrderedList,
      ListItem,
      Underline,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6]
      }),
      Link.configure({
        openOnClick: false
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"]
      }),
      Image.configure({
        inline: true,
        allowBase64: true
      }),
      Color,
      TextStyle,
      Strike,
      Subscript,
      Superscript,
      FontFamily.configure({
        types: ["textStyle"]
      }),
      CustomFontSize,
      Highlight.configure({
        multicolor: true
      }),
      Table.configure({
        resizable: true
      }),
      TableRow,
      TableHeader,
      TableCell,
      Code,
      CodeBlock,
      Blockquote,
      HorizontalRule
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML().replace(/(?!<pre|<code)>\n(?![^<]*<\/pre>|[^<]*<\/code>)/g, '');
      onChange(htmlContent);
    },
    editorProps: {
      attributes: {
        class: 'prevent-submit'
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();
          if (!event.shiftKey) {
            view.dispatch(view.state.tr.insertText('\n'));
          }
          return true;
        }
      }
    }
  });

  return (
    <div className="relative border rounded-lg border-gray-200 min-h-[300px]">
      <Toolbar className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap items-center gap-1">
        {/* Nhóm Font - Thu gọn chiều rộng */}
        <Select onValueChange={(value) => editor?.chain().focus().setFontFamily(value).run()}>
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Inter">Inter</SelectItem>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
          </SelectContent>
        </Select>

        {/* Nhóm FontSize - Thu gọn */}
        <Select onValueChange={(value) => editor?.chain().focus().setFontSize(value).run()}>
          <SelectTrigger className="w-[70px] h-8">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            {[12, 14, 16, 18, 20, 24, 30, 36].map((size) => (
              <SelectItem key={size} value={`${size}px`}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        {/* Nhóm Heading - Thu gọn */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="h-8 px-2">
              <Hash className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => editor?.chain().focus().setParagraph().run()}>
              Đoạn văn bản
            </DropdownMenuItem>
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <DropdownMenuItem
                key={level}
                onClick={() => editor?.chain().focus().toggleHeading({ level }).run()}
                className={editor?.isActive("heading", { level }) ? "bg-gray-100" : ""}
              >
                Heading {level}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* Nhóm Định dạng - Giữ nguyên */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            active={editor?.isActive("bold")}
            title="In đậm"
            type="button"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            active={editor?.isActive("italic")}
            title="In nghiêng"
            type="button"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            active={editor?.isActive("underline")}
            title="Gạch chân"
            type="button"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Nhóm Màu sắc - Thu gọn */}
        <div className="flex items-center gap-0.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-1">
                <span 
                  className="w-full h-full rounded" 
                  style={{ backgroundColor: editor?.getAttributes('textStyle').color || '#000000' }} 
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <div className="grid grid-cols-8 gap-1 p-2">
                {[
                  '#000000', '#343434', '#787878', '#9E9E9E', '#B4B4B4', '#CCCCCC', '#EBEBEB', '#FFFFFF',
                  '#FF0000', '#FF4D00', '#FF9900', '#FFE600', '#7FFF00', '#00FF00', '#00FF80', '#00FFFF',
                  '#0080FF', '#0000FF', '#4D00FF', '#9900FF', '#FF00FF', '#FF0080', '#FF0040', '#804000'
                ].map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-200 hover:border-gray-400"
                    style={{ backgroundColor: color }}
                    onClick={() => editor?.chain().focus().setColor(color).run()}
                    type="button"
                  />
                ))}
              </div>
              <Separator className="my-2" />
              <div className="p-2">
                <input
                  type="color"
                  className="w-full h-8"
                  value={editor?.getAttributes('textStyle').color || '#000000'}
                  onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-1">
                <span 
                  className="w-full h-full rounded" 
                  style={{ backgroundColor: editor?.getAttributes('highlight').color || '#FFEB3B' }} 
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <div className="grid grid-cols-8 gap-1 p-2">
                {[
                  '#FFEB3B', '#FFF176', '#FFF59D', '#FFF9C4', '#FFFDE7',
                  '#FF8F00', '#FFA726', '#FFB74D', '#FFCC80', '#FFE0B2',
                  '#F06292', '#FF94C2', '#F8BBD0', '#FCE4EC',
                  '#90CAF9', '#BBDEFB', '#E3F2FD',
                  '#A5D6A7', '#C8E6C9', '#E8F5E9',
                ].map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-200 hover:border-gray-400"
                    style={{ backgroundColor: color }}
                    onClick={() => editor?.chain().focus().setHighlight({ color }).run()}
                  />
                ))}
              </div>
              <Separator className="my-2" />
              <div className="p-2">
                <input
                  type="color"
                  className="w-full h-8"
                  value={editor?.getAttributes('highlight').color || '#FFEB3B'}
                  onChange={(e) => editor?.chain().focus().setHighlight({ color: e.target.value }).run()}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Nhóm Căn chỉnh */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <AlignLeft className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => editor?.chain().focus().setTextAlign("left").run()}>
              <AlignLeft className="mr-2 h-4 w-4" /> Căn trái
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor?.chain().focus().setTextAlign("center").run()}>
              <AlignCenter className="mr-2 h-4 w-4" /> Căn giữa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor?.chain().focus().setTextAlign("right").run()}>
              <AlignRight className="mr-2 h-4 w-4" /> Căn phải
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor?.chain().focus().setTextAlign("justify").run()}>
              <AlignJustify className="mr-2 h-4 w-4" /> Căn đều
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* Nhóm Danh sách */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive("bulletList")}
          title="Danh sách không thứ tự"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive("orderedList")}
          title="Danh sách có thứ tự"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6" />

        {/* Nhóm Chèn */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Chèn
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => document.getElementById("image-upload")?.click()}>
              <ImageIcon className="mr-2 h-4 w-4" /> Hình ảnh
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}>
              <TableIcon className="mr-2 h-4 w-4" /> Bảng
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
              <Minus className="mr-2 h-4 w-4" /> Đường kẻ ngang
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          type="file"
          id="image-upload"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const result = e.target?.result as string;
                editor?.chain().focus().setImage({ src: result }).run();
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </Toolbar>

      <div className="p-4 bg-white">
        <EditorContent
          editor={editor}
          className="min-h-[200px] prose max-w-none [&>ul]:list-disc [&>ul]:pl-[40px] [&>ol]:list-decimal [&>ol]:pl-[40px] [&>ul>li]:my-1 [&>ol>li]:my-1 focus:outline-none"
        />
      </div>
    </div>
  );
}
