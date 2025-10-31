import React, { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, RotateCcw, AlertCircle, CheckCircle2, Wand2 } from "lucide-react";

interface JsonEditorProps {
  value?: any;
  onChange?: (value: any, isValid: boolean) => void;
  placeholder?: string;
}

const defaultPlaceHolder = `{
  "key" : "value"  
}`;

const JsonEditor: React.FC<JsonEditorProps> = ({ value = {}, onChange, placeholder = defaultPlaceHolder }) => {
  const initialValue = useMemo(() => value, []);

  const [text, setText] = useState<string>(JSON.stringify(value, null, 2));
  const [isValid, setIsValid] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    validateJson(text);
  }, []);

  const validateJson = (jsonText: string) => {
    if (!jsonText.trim()) {
      setIsValid(true);
      setError("");
      onChange?.(null, true);
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      setIsValid(true);
      setError("");
      onChange?.(parsed, true);
    } catch (e: any) {
      setIsValid(false);
      const errorMessage = e.message || "Invalid JSON";
      setError(errorMessage);
      onChange?.(null, false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    validateJson(newText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Handle Tab key - insert 2 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = text.substring(0, start) + "  " + text.substring(end);
      setText(newText);

      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);

      validateJson(newText);
    }

    // Handle Enter key - auto-indent
    if (e.key === "Enter") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const lines = text.substring(0, start).split("\n");
      const currentLine = lines[lines.length - 1];

      // Calculate current indentation
      const indentMatch = currentLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : "";

      // Check if we need extra indentation (after opening brackets)
      const trimmedLine = currentLine.trim();
      let extraIndent = "";
      if (trimmedLine.endsWith("{") || trimmedLine.endsWith("[")) {
        extraIndent = "  ";
      }

      const newText = text.substring(0, start) + "\n" + currentIndent + extraIndent + text.substring(start);
      setText(newText);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + currentIndent.length + extraIndent.length;
      }, 0);

      validateJson(newText);
    }

    // Handle closing brackets - auto-dedent
    if (e.key === "}" || e.key === "]") {
      const start = textarea.selectionStart;
      const lines = text.substring(0, start).split("\n");
      const currentLine = lines[lines.length - 1];

      // If current line only has whitespace, remove 2 spaces
      if (currentLine.trim() === "") {
        const indentMatch = currentLine.match(/^(\s*)/);
        const currentIndent = indentMatch ? indentMatch[1] : "";

        if (currentIndent.length >= 2) {
          e.preventDefault();
          const lineStart = start - currentLine.length;
          const newIndent = currentIndent.substring(0, currentIndent.length - 2);
          const newText = text.substring(0, lineStart) + newIndent + e.key + text.substring(start);
          setText(newText);

          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = lineStart + newIndent.length + 1;
          }, 0);

          validateJson(newText);
        }
      }
    }
  };

  const beautifyJson = () => {
    if (!text.trim()) return;

    try {
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);
      setText(formatted);
      setIsValid(true);
      setError("");
      onChange?.(parsed, true);
    } catch (e: any) {
      // Keep current text if invalid
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const resetEditor = () => {
    const initial = JSON.stringify(initialValue, null, 2);
    setText(initial);
    setIsValid(true);
    setError("");
    onChange?.(initialValue, true);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          {isValid ? (
            <Badge variant="outline" className="bg-emerald-950 text-emerald-400 border-emerald-800">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Valid JSON
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-950 text-red-400 border-red-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              Invalid JSON
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={beautifyJson}
            disabled={!isValid}
            className="h-8 gap-2 bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Beautify JSON"
          >
            <Wand2 className="h-4 w-4" />
            Beautify
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetEditor}
            className="h-8 bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-slate-100"
            title="Reset to initial value"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 gap-2 bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-slate-100"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {!isValid && error && (
          <Alert variant="destructive" className="bg-red-950 border-red-800">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full min-h-[200px] max-h-[600px] p-4 font-mono text-sm rounded-lg border-2 transition-colors resize-y
              ${
                isValid
                  ? "border-slate-600 focus:border-blue-500 bg-slate-800 text-slate-100"
                  : "border-red-800 focus:border-red-500 bg-red-950/30 text-slate-100"
              }
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
              ${isValid ? "focus:ring-blue-500" : "focus:ring-red-500"}
              placeholder:text-slate-500
            `}
            spellCheck={false}
            style={{
              tabSize: 2,
              lineHeight: "1.6",
              whiteSpace: "pre",
            }}
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-600">
            {text.split("\n").length} lines • {text.length} chars
          </div>
        </div>

        <div className="text-xs text-slate-400 flex gap-4 flex-wrap">
          <span>
            • Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-xs text-slate-300">Tab</kbd> to indent (2 spaces)
          </span>
          <span>
            • Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-xs text-slate-300">Enter</kbd> for auto-indent
          </span>
          <span>
            • Click <strong className="text-slate-300">Beautify</strong> to format
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default JsonEditor;
