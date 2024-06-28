import { ArrowRightIcon } from "lucide-react";
import { Button } from "./ui/button";
import dashboard from "@/assets/dashboard.png";
import WordRotate from "./magicui/word-rotate";
import { Link } from "react-router-dom";

export const Hero: React.FC = () => {
  return (
    <div className="xl:w-4/6 flex flex-col gap-3 lg:gap-5 mx-auto items-center mb-10">
      <h1 className="animate-fadein [--fadein-duration:600ms] opacity-0 [--fadein-delay:300ms] lg:text-7xl text-3xl font-extrabold tracking-text-black dark:text-white text-center ">
        Your one-stop shop for all things Formula 1.
      </h1>
      <h2 className="animate-fadein [--fadein-duration:600ms] opacity-0 [--fadein-delay:500ms] lg:text-2xl text-md text-center text-slate-600 dark:text-slate-200  mb-3 lg:mb-6">
        Find all the information you need to become an F1 aficionado.
      </h2>
      <div className="animate-fadein [--fadein-duration:600ms] opacity-0 [--fadein-delay:600ms]">
        <WordRotate
          className=" text-3xl lg:text-6xl font-semibold text-red-600 dark:text-white text-center"
          words={["Races", "Drivers", "Teams", "Standings"]}
          duration={1700}
        />
      </div>
      <Link
        to={"/drivers"}
        className="animate-fadein [--fadein-duration:600ms] opacity-0 [--fadein-delay:800ms] mt-6 w-full lg:w-1/6"
      >
        <Button variant={"default"} className="w-full">
          Get Started
          <ArrowRightIcon className="w-6 h-6 ml-3" />
        </Button>
      </Link>
      <img
        src={dashboard}
        alt=""
        className="animate-fadetop [--fadein-duration:600ms] opacity-0 [--fadein-delay:900ms] mt-10 shadow-2xl shadow-red-500 w-full rounded-lg"
      />
    </div>
  );
};
