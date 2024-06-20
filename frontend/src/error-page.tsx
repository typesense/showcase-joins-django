import { useRouteError } from "react-router-dom";
import { errorMessage } from "./lib/utils.ts";

export default function ErrorPage() {
  const error = errorMessage(useRouteError());

  return (
    <div className="min-h-screen min-w-screen flex flex-col gap-3 text-center items-center justify-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {" "}
        Oops!
      </h1>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Something went wrong.
      </h2>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-slate-500">
        {error}
      </h3>
    </div>
  );
}
