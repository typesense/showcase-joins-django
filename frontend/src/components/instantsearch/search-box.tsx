import type { SearchBoxProps } from "react-instantsearch";
import { useSearchBox } from "react-instantsearch";
import { Input } from "../ui/input";

export const SearchBox = (props: SearchBoxProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { refine, clear, isSearchStalled, ...rest } = useSearchBox(props);

  return (
    <Input
      className="my-4"
      onChange={(event) => refine(event.currentTarget.value)}
      placeholder="Search..."
      {...rest}
    />
  );
};
