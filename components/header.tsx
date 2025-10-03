import { Button } from "@/components/ui/button";
import { BookOpen, Github, Mail } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";

export const Header = async () => {
  const res = await fetch("https://api.github.com/repos/moeinmac/reqend");
  const data = (await res.json()) as { stargazers_count: number };
  const starts = data.stargazers_count;

  return (
    <header className="w-full bg-background/60 backdrop-blur-sm border-b border-border absolute top-0 z-50">
      <div className="mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold">R</div>
              <span className="font-semibold text-lg text-foreground hidden sm:inline-block">reQend</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size={"sm"}>
              <Link href={"/docs"} className="inline-flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Docs</span>
              </Link>
            </Button>

            <Button variant="ghost" size={"sm"}>
              <Link href={"#contact"} className="inline-flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">Contact</span>
              </Link>
            </Button>

            <Button variant="outline" asChild size={"sm"}>
              <Link href="https://github.com/moeinmac/reqend" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />

                {starts !== null && (
                  <Badge variant="secondary" className="ml-2">
                    {starts.toLocaleString()} ⭐
                  </Badge>
                )}
              </Link>
            </Button>
          </nav>

          {/* <div className="md:hidden flex items-center">
            <button aria-label="Toggle menu" onClick={() => setOpen((s) => !s)} className="p-2 rounded-md hover:bg-muted">
              {open ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div> */}
        </div>
      </div>

      {/* <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.1 }}
            className="md:hidden border-t border-border bg-background/60"
          >
            <div className="px-4 py-3 space-y-2">
              <Link href={docsUrl} onClick={() => setOpen(false)} className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted">
                <BookOpen className="w-4 h-4" />
                <span>Docs</span>
              </Link>

              <Link href={contactUrl} onClick={() => setOpen(false)} className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted">
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </Link>

              <a href={githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted">
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>

              <Link href="/contribute" onClick={() => setOpen(false)} className="block">
                <Button className="w-full">Get Involved</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </header>
  );
};
