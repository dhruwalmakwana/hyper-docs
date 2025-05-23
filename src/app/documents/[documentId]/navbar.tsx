"use client";

import Image from "next/image";
import Link from "next/link";
import { DocumentInput } from "./document-input";

import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  BoldIcon,
  FileIcon,
  FileJsonIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  ItalicIcon,
  PrinterIcon,
  RedoIcon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  TextIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-react";
import { BsFilePdf } from "react-icons/bs";
import { useEditorStore } from "@/store/use-editor-store";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Avatars } from "./avatars";
import { Inbox } from "./inbox";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  data: Doc<"documents">;
}

export const Navbar = ({ data }: NavbarProps) => {
  const router = useRouter();

  const { editor } = useEditorStore();

  const mutation = useMutation(api.documents.create);

  const onNewDocument = () => {
    mutation({
      title: "Untitled Document",
      initialContent: "",
    })
      .catch(() => toast.error("Something went wrong"))
      .then((id) => {
        toast.success("Document created");
        router.push(`/documents/${id}`);
      });
  };

  const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
  };

  const onDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const onSaveJSON = () => {
    if (!editor) return;

    const content = editor.getJSON();

    const blob = new Blob([JSON.stringify(content)], {
      type: "application/json",
    });

    onDownload(blob, `${data.title}.json`);
  };

  const onSaveHTML = () => {
    if (!editor) return;

    const content = editor.getHTML();
    const blob = new Blob([content], {
      type: "text/html",
    });

    onDownload(blob, `${data.title}.html`);
  };

  const onSaveText = () => {
    if (!editor) return;

    const content = editor.getText();
    const blob = new Blob([content], {
      type: "text/plain",
    });

    onDownload(blob, `${data.title}.txt`);
  };

  const [customRows, setCustomRows] = useState(2);
  const [customCols, setCustomCols] = useState(2);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const MobileLayout = () => (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1200px] bg-white/80 backdrop-blur-md shadow-xl z-50 rounded-lg px-4 py-3">
      <div className="flex flex-col w-full gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Link href={"/"}>
              <Image src="/logo.svg" alt="Logo" width={30} height={30} />
            </Link>
            <DocumentInput title={data.title} id={data._id} />
          </div>
          <div className="flex items-center gap-2">
            <Inbox />
            <UserButton />
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex-shrink-0">
            <Avatars />
          </div>
          <div className="flex-shrink-0">
            <OrganizationSwitcher
              afterCreateOrganizationUrl="/"
              afterLeaveOrganizationUrl="/"
              afterSelectOrganizationUrl="/"
              afterSelectPersonalUrl="/"
            />
          </div>
        </div>

        <div className="flex items-center justify-start w-full overflow-x-auto">
          <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                File
              </MenubarTrigger>
              <MenubarContent className="print:hidden">
                <MenubarSub>
                  <MenubarSubTrigger>
                    <FileIcon className="size-4 mr-2" />
                    Save
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem onClick={onSaveJSON}>
                      <FileJsonIcon className="size-4 mr-2" />
                      JSON
                    </MenubarItem>
                    <MenubarItem onClick={onSaveHTML}>
                      <GlobeIcon className="size-4 mr-2" />
                      HTML
                    </MenubarItem>
                    <MenubarItem onClick={() => window.print()}>
                      <BsFilePdf className="size-4 mr-2" />
                      PDF
                    </MenubarItem>
                    <MenubarItem onClick={onSaveText}>
                      <FileTextIcon className="size-4 mr-2" />
                      Text
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarItem onClick={onNewDocument}>
                  <FilePlusIcon className="size-4 m-2" />
                  New Document
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => window.print()}>
                  <PrinterIcon className="size-4 m-2" />
                  Print <MenubarShortcut>Ctrl+P</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                Edit
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                  <UndoIcon className="size-4 m-2" />
                  Undo <MenubarShortcut>Ctrl+Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
                  <RedoIcon className="size-4 m-2" />
                  Redo <MenubarShortcut>Ctrl+Y</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                Insert
              </MenubarTrigger>
              <MenubarContent>
                <MenubarSub>
                  <MenubarSubTrigger>Table</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem onClick={() => insertTable({ rows: 1, cols: 1 })}>1 x 1</MenubarItem>
                    <MenubarItem onClick={() => insertTable({ rows: 2, cols: 2 })}>2 x 2</MenubarItem>
                    <MenubarItem onClick={() => insertTable({ rows: 3, cols: 3 })}>3 x 3</MenubarItem>
                    <MenubarItem onClick={() => insertTable({ rows: 4, cols: 4 })}>4 x 4</MenubarItem>

                    <div className="border-t pt-2">
                      <div className="text-xs text-muted-foreground mb-1">Custom Size</div>
                      <div className="flex gap-2 mb-2">
                        <Input
                          type="number"
                          value={customRows}
                          onChange={(e) => setCustomRows(Number(e.target.value))}
                          min={1}
                          max={20}
                          placeholder="Rows"
                          className="w-16"
                        />
                        <Input
                          type="number"
                          value={customCols}
                          onChange={(e) => setCustomCols(Number(e.target.value))}
                          min={1}
                          max={20}
                          placeholder="Cols"
                          className="w-16"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => {
                          if (customRows < 1 || customCols < 1) {
                            toast.error("Rows and columns must be at least 1");
                            return;
                          }
                          insertTable({ rows: customRows, cols: customCols });
                        }}
                      >
                        Insert {customRows} x {customCols}
                      </Button>
                    </div>
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                Format
              </MenubarTrigger>
              <MenubarContent>
                <MenubarSub>
                  <MenubarSubTrigger>
                    <TextIcon className="size-4 mr-2" />
                    Text
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                      <BoldIcon className="size-4 mr-2" />
                      Bold <MenubarShortcut>Ctrl+B</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                      <ItalicIcon className="size-4 mr-2" />
                      Italic <MenubarShortcut>Ctrl+I</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                      <UnderlineIcon className="size-4 mr-2" />
                      Underline <MenubarShortcut>Ctrl+U</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                      <StrikethroughIcon className="size-4 mr-2" />
                      Strikethrough&nbsp;&nbsp;
                      <MenubarShortcut>Alt+S</MenubarShortcut>
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
                  <RemoveFormattingIcon className="size-4 mr-2" />
                  Remove formatting
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </nav>
  );

  const DesktopLayout = () => (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1200px] flex items-center justify-between bg-white/80 backdrop-blur-md shadow-xl z-50 rounded-full px-6 py-3">
      <div className="flex gap-2 items-center">
        <Link href={"/"}>
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
        </Link>
        <div className="flex flex-col">
          <DocumentInput title={data.title} id={data._id} />
          <div className="flex">
            <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  File
                </MenubarTrigger>
                <MenubarContent className="print:hidden">
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <FileIcon className="size-4 mr-2" />
                      Save
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={onSaveJSON}>
                        <FileJsonIcon className="size-4 mr-2" />
                        JSON
                      </MenubarItem>
                      <MenubarItem onClick={onSaveHTML}>
                        <GlobeIcon className="size-4 mr-2" />
                        HTML
                      </MenubarItem>
                      <MenubarItem onClick={() => window.print()}>
                        <BsFilePdf className="size-4 mr-2" />
                        PDF
                      </MenubarItem>
                      <MenubarItem onClick={onSaveText}>
                        <FileTextIcon className="size-4 mr-2" />
                        Text
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem onClick={onNewDocument}>
                    <FilePlusIcon className="size-4 m-2" />
                    New Document
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => window.print()}>
                    <PrinterIcon className="size-4 m-2" />
                    Print <MenubarShortcut>Ctrl+P</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Edit
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                    <UndoIcon className="size-4 m-2" />
                    Undo <MenubarShortcut>Ctrl+Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
                    <RedoIcon className="size-4 m-2" />
                    Redo <MenubarShortcut>Ctrl+Y</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Insert
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>Table</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={() => insertTable({ rows: 1, cols: 1 })}>1 x 1</MenubarItem>
                      <MenubarItem onClick={() => insertTable({ rows: 2, cols: 2 })}>2 x 2</MenubarItem>
                      <MenubarItem onClick={() => insertTable({ rows: 3, cols: 3 })}>3 x 3</MenubarItem>
                      <MenubarItem onClick={() => insertTable({ rows: 4, cols: 4 })}>4 x 4</MenubarItem>

                      <div className="border-t pt-2">
                        <div className="text-xs text-muted-foreground mb-1">Custom Size</div>
                        <div className="flex gap-2 mb-2">
                          <Input
                            type="number"
                            value={customRows}
                            onChange={(e) => setCustomRows(Number(e.target.value))}
                            min={1}
                            max={20}
                            placeholder="Rows"
                            className="w-16"
                          />
                          <Input
                            type="number"
                            value={customCols}
                            onChange={(e) => setCustomCols(Number(e.target.value))}
                            min={1}
                            max={20}
                            placeholder="Cols"
                            className="w-16"
                          />
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => {
                            if (customRows < 1 || customCols < 1) {
                              toast.error("Rows and columns must be at least 1");
                              return;
                            }
                            insertTable({ rows: customRows, cols: customCols });
                          }}
                        >
                          Insert {customRows} x {customCols}
                        </Button>
                      </div>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Format
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <TextIcon className="size-4 mr-2" />
                      Text
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                        <BoldIcon className="size-4 mr-2" />
                        Bold <MenubarShortcut>Ctrl+B</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                        <ItalicIcon className="size-4 mr-2" />
                        Italic <MenubarShortcut>Ctrl+I</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                        <UnderlineIcon className="size-4 mr-2" />
                        Underline <MenubarShortcut>Ctrl+U</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                        <StrikethroughIcon className="size-4 mr-2" />
                        Strikethrough&nbsp;&nbsp;
                        <MenubarShortcut>Alt+S</MenubarShortcut>
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
                    <RemoveFormattingIcon className="size-4 mr-2" />
                    Remove fromatting
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
      <div className="flex gap-3 items-center pl-6">
        <Avatars />
        <Inbox />
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          afterSelectPersonalUrl="/"
        />
        <UserButton />
      </div>
    </nav>);

  return (
    <>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </>);
};