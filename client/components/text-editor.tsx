"use client";

import Quill, { QuillOptions } from "quill";
import { Delta, Op } from "quill/core";

import "quill/dist/quill.snow.css";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import { MdClose, MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type EditorValue = {
  image: File | null;
  body: string;
  backgroundImage: string | null;
  backgroundColor: string | null;
  width: number;
  height: number;
};

interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  defaultBackgroundImage?: string | null;
  defaultBackgroundColor?: string | null;
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: "create" | "update";
  defaultWidth?: number;
  defaultHeight?: number;
}

const Editor = ({
  variant = "create",
  onSubmit,
  defaultValue = [],
  defaultBackgroundImage = null,
  defaultBackgroundColor = null,
  disabled = false,
  innerRef,
  onCancel,
  placeholder = "Write something...",
  defaultWidth = 800,
  defaultHeight = 300,
}: EditorProps) => {
  const [text, setText] = useState("");
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(
    defaultBackgroundImage
  );
  const [backgroundColor, setBackgroundColor] = useState<string | null>(
    defaultBackgroundColor
  );
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);
  const [customColor, setCustomColor] = useState("");

  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const disabledRef = useRef(disabled);

  const widthOptions = [600, 800, 1000];
  const heightOptions = [300, 400, 500];

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    // Define custom fonts
    const Font = Quill.import("formats/font") as any; // Casting as any
    Font.whitelist = [
      "merriweather",
      "playfair",
      "crimson",
      "poppins",
      "arial",
      "helvetica",
      "times-new-roman",
      "courier-new",
      "georgia",
      "palatino",
      "garamond",
      "bookman",
      "comic-sans",
      "trebuchet",
      "arial-black",
      "impact",
    ];
    Quill.register(Font, true);

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "strike"],
          [{ font: Font.whitelist }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                //TODO Submit form
                return;
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus(); // Automatically focuses to the editor.

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    // Add custom color picker
    const toolbar = quill.getModule("toolbar") as any;
    toolbar.addHandler("color", (value: string) => {
      if (value === "custom") {
        const color = customColor || "#000000";
        quill.format("color", color);
      } else {
        quill.format("color", value);
      }
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef, customColor]);

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const handleBackgroundImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBackgroundImage(result);
        setBackgroundColor(null); // Reset background color when image is set
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = () => {
    if (quillRef.current) {
      const content = quillRef.current.getContents();
      const contentWithAttributes = {
        ops: [
          ...content.ops,
          { insert: "\n" },
          { insert: `__dimensions__:${width}x${height}` },
          { insert: "\n" },
          { insert: `__backgroundImage__:${backgroundImage || ""}` },
          { insert: "\n" },
          { insert: `__backgroundColor__:${backgroundColor || ""}` },
        ],
      };
      submitRef.current({
        image: null,
        body: JSON.stringify(contentWithAttributes),
        backgroundImage: backgroundImage,
        backgroundColor: backgroundColor,
        width: width,
        height: height,
      });
    }
  };

  const handleRemoveBackgroundImage = () => {
    setBackgroundImage(null);
  };

  const handleBackgroundColorChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBackgroundColor(e.target.value);
    setBackgroundImage(null); // Reset background image when color is set
  };

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col" style={{ width: `${width}px` }}>
      <div
        className="flex flex-col border border-slate-200 rounded-[8px] overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          backgroundColor: backgroundColor || "white",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {backgroundImage && (
          <Button
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            size="icon"
            variant="ghost"
            onClick={handleRemoveBackgroundImage}
          >
            <MdClose className="size-4" />
          </Button>
        )}
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="flex px-2 pb-2 z-[5] items-center justify-between">
          <div>
            <Button // Add a hint for hide formatting or show formatting
              disabled={disabled}
              size={"icon"}
              variant={"editor_buttons"}
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>{" "}
            {variant === "create" && (
              <>
                <Button
                  disabled={disabled}
                  size={"icon"}
                  variant={"editor_buttons"}
                  onClick={() =>
                    document.getElementById("background-image-upload")?.click()
                  }
                >
                  <ImageIcon className="size-4" />
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundImageUpload}
                  style={{ display: "none" }}
                  id="background-image-upload"
                />{" "}
                <input
                  type="color"
                  onChange={handleBackgroundColorChange}
                  value={backgroundColor || ""}
                  className="w-8 h-8 p-0 border-none"
                  title="Set background color"
                />
              </>
            )}
          </div>

          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <Select
              value={width.toString()}
              onValueChange={(value) => setWidth(Number(value))}
            >
              <SelectTrigger className="w-[120px] bg-white border border-slate-100 rounded-[8px] shadow-sm">
                <SelectValue placeholder="Width" />
              </SelectTrigger>
              <SelectContent className="bg-white" side="bottom">
                {widthOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={height.toString()}
              onValueChange={(value) => setHeight(Number(value))}
            >
              <SelectTrigger className="w-[120px] bg-white border border-slate-100 rounded-[8px] shadow-sm">
                <SelectValue placeholder="Height" />
              </SelectTrigger>
              <SelectContent className="bg-white" side="bottom">
                {heightOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {variant === "update" ? (
              <div className="flex items-center gap-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  disabled={disabled}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={disabled || isEmpty}
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button
                disabled={disabled || isEmpty}
                onClick={handleSubmit}
                className={cn(
                  "rounded-[8px]",
                  isEmpty
                    ? "bg-white hover:bg-white text-muted-foreground"
                    : "bg-[#007a5a] hover:bg-[#007a5a]/80 cursor-pointer text-white"
                )}
              >
                <MdSend />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
        <p>
          <strong>Shift + Return </strong>to add a new line
        </p>
      </div>
    </div>
  );
};

export default Editor;
