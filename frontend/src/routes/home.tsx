import { ExternalLink, Github } from "lucide-react";
import { Hero } from "@/components/hero";

const HomePage = () => (
  <div className="flex flex-col min-h-screen w-full items-center">
    <nav className="animate-fadein [--fadein-duration:500ms] opacity-0 [--fadein-delay:200ms] flex text-center align-middle w-11/12 lg:w-4/5 bg-muted my-3 py-3 px-5 rounded-md border shadow-md sticky top-3 z-50 justify-between">
      <a
        href="https://typesense.org/"
        target="_blank"
        rel="noopener noreferrer"
        id="typesenseLink"
        className="text-center text-md lg:text-xl text-red-600"
      >
        type<b>sense</b>|
      </a>
      <div className="flex gap-3 items-center">
        <a className=" flex items-center " href="https://typesense.org/docs/">
          <h1 className="text-sm lg:text-md transition duration-300 ease-in-out hover:text-red-600 cursor-pointer">
            Docs
          </h1>
          <ExternalLink className="h-3 font-light text-muted-foreground" />
        </a>
        <a
          className=" flex items-center "
          href="https://typesense.org/docs/guide/#quick-start"
        >
          <h1 className="text-sm lg:text-md transition duration-300 ease-in-out hover:text-red-600 cursor-pointer">
            Guide
          </h1>
          <ExternalLink className="h-3 font-light text-muted-foreground" />
        </a>
        <a
          href="https://github.com/typesense/typesense"
          className="hover:bg-slate-200 p-2 transition-all duration-200 ease-in-out rounded-none hover:rounded-[50%]"
        >
          <Github className="lg:h-5 lg:w-5 h-4 w-4" />
        </a>
      </div>
    </nav>
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 items-center">
      <Hero />
    </main>
  </div>
);

export default HomePage;
