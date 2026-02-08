"use client";

import { useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Label } from "@/components/ui/label";
import Quill from "react-quill-new";
import ImageResize from "quill-image-resize-module-react";

// Register modules
Quill.Quill.register("modules/imageResize", ImageResize);

// --- Custom iframe blot ---
const BlockEmbed = Quill.Quill.import("blots/block/embed");

class IframeBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute("src", value.src || "");
    node.setAttribute("width", value.width || "560");
    node.setAttribute("height", value.height || "315");
    node.setAttribute("frameborder", "0");
    node.setAttribute("allowfullscreen", true);
    node.setAttribute("contenteditable", "false");
    node.style.display = "block";
    node.style.maxWidth = "100%";
    return node;
  }

  static value(node) {
    return {
      src: node.getAttribute("src"),
      width: node.getAttribute("width"),
      height: node.getAttribute("height"),
    };
  }
}
IframeBlot.blotName = "iframe";
IframeBlot.tagName = "iframe";

Quill.Quill.register(IframeBlot);

// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// imgbb image uploader
const imageToUrl = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const API_KEY = "81779eb060f12f84bc67b32a25878f60";

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const upload = await response.json();

    if (upload.success) {
      return {
        originalUrl: upload.data.image?.url,
      };
    } else {
      console.error("imgbb error: Upload failed");
      return null;
    }
  } catch (error) {
    console.error("imgbb error:", error);
    return null;
  }
};

const CustomEditor = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  disabled = false,
}) => {
  const quillEditorRef = useRef(null);

  const handleImageUpload = useCallback(async () => {
    const quillEditor = quillEditorRef.current?.getEditor();
    if (!quillEditor || disabled) return;

    const input = typeof document !== 'undefined' ? document.createElement("input") : null;
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        // Show loading state
        const range = quillEditor.getSelection();
        if (range) {
          quillEditor.insertText(range.index, "Uploading image...", "user");
        }

        const result = await imageToUrl(file);
        const imageUrl = result?.originalUrl;

        if (imageUrl && range) {
          // Remove loading text and insert image
          quillEditor.deleteText(range.index, "Uploading image...".length);
          quillEditor.insertEmbed(range.index, "image", imageUrl);
          quillEditor.setSelection(range.index + 1);
        } else {
          // Remove loading text on error
          if (range) {
            quillEditor.deleteText(range.index, "Uploading image...".length);
          }
          alert("Failed to upload image. Please try again.");
        }
      } catch (error) {
        console.error("Image upload error:", error);
        alert("Failed to upload image. Please try again.");
      }
    };
  }, [disabled]);

  const handleIframeInsert = useCallback(() => {
    const quillEditor = quillEditorRef.current?.getEditor();
    if (!quillEditor || disabled) return;

    const url = prompt("Enter iframe URL (YouTube, Vimeo, etc.):");
    if (url) {
      const range = quillEditor.getSelection();
      if (range) {
        // Create a more robust iframe wrapper
        const iframeWrapper = `
          <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 10px 0;">
            <iframe src="${url}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
          </div>
        `;
        quillEditor.clipboard.dangerouslyPasteHTML(range.index, iframeWrapper);
        quillEditor.setSelection(range.index + 1);
      }
    }
  }, [disabled]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
          ["link", "image", "video", "clean"],
          ["iframe"],
        ],
        handlers: {
          image: handleImageUpload,
          iframe: handleIframeInsert,
        },
      },
      imageResize: {
        modules: ["Resize", "DisplaySize"],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [handleImageUpload, handleIframeInsert]
  );

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "header",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "video",
    "iframe",
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description *</Label>
      <div
        className={`react-quill-wrapper ${disabled ? "opacity-50 pointer-events-none" : ""
          }`}
      >
        <ReactQuill
          ref={quillEditorRef}
          theme="snow"
          value={value || ""}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          readOnly={disabled}
          style={{ minHeight: "200px" }}
          className="react-quill-container"
        />
      </div>
      <style jsx global>{`
        .react-quill-wrapper .ql-editor {
          min-height: 200px;
        }
        .react-quill-wrapper .ql-toolbar {
          border-top: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
        }
        .react-quill-wrapper .ql-container {
          border-bottom: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
        }
        .react-quill-wrapper .ql-editor.ql-blank::before {
          font-style: italic;
          color: #999;
        }
      `}</style>
    </div>
  );
};

export default CustomEditor;
