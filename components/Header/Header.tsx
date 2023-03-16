import ThemeButton from "./ThemeButton";
import Github from "./GitHub";

export const Header = () => {
  return (
    <>
    <ThemeButton className="absolute top-2.5 right-2.5 text-gray-500 dark:text-gray-400 focus:outline-none hover:scale-125 transition" />
        <div className="flex items-center justify-center">
          <a
            className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-blue-600 text-white px-5 py-2 text-sm shadow-md hover:bg-blue-500 bg-blue-600 font-medium transition"
            href="https://github.com/whoiskatrin/sql-translator"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            <p>Star on GitHub</p>
          </a>
        </div></>
  );
}
