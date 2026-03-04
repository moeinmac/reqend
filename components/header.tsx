import { Button } from "@/components/ui/button";
import { BookOpen, Github, Mail, MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

export const Header = async () => {
  let res: Response;
  let stars: number | "notAvailable";
  try {
    res = await fetch("https://api.github.com/repos/moeinmac/reqend");
    const data = (await res.json()) as { stargazers_count: number };
    stars = data.stargazers_count;
  } catch (error) {
    stars = "notAvailable";
  }

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

          <nav className="md:flex items-center gap-3">
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
                <Github className={cn(stars !== "notAvailable" && "mr-2", "h-4 w-4")} />

                {stars !== "notAvailable" && (
                  <Badge variant="secondary" className="ml-2">
                    {stars.toLocaleString()} ⭐
                  </Badge>
                )}
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
