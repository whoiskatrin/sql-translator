import ThemeButton from "./ThemeButton";
import Github from "./GitHub";
import Star from "./Star";
import Fork from "./Fork";
import { useEffect, useState } from "react";

export const Header = () => {
  const [stargazers, setStargazers] = useState<string>();
  const [forks, setForks] = useState<string>();

  useEffect(() => {
    const formatter = Intl.NumberFormat('en', {
      notation: 'compact'
    });

    fetch('https://api.github.com/repos/whoiskatrin/sql-translator')
      .then(response => response.json())
      .then(data => {
        setStargazers(formatter.format(data.stargazers_count).toLocaleLowerCase());
        setForks(formatter.format(data.forks_count).toLocaleLowerCase());
      });
  }, []);

  return (
    <>
      <ThemeButton className="absolute top-2.5 right-2.5 text-gray-500 dark:text-gray-400 focus:outline-none hover:scale-125 transition" />
      <div className="flex items-center justify-center">
        <a
          className="group"
          href="https://github.com/whoiskatrin/sql-translator"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-blue-600 text-white px-5 py-2 text-sm shadow-md group-hover:bg-blue-500 bg-blue-600 font-medium transition">
            <Github />
            <p>Star on GitHub</p>
          </div>
          <div className="flex justify-around border-2 mx-auto border-blue-600 rounded-b-xl w-4/5 text-xs -translate-y-1 pb-2 pt-2 group-hover:border-blue-500 transition">
            <div className="flex space-x-1">
              <Star className="fill-gray-700 dark:fill-gray-200 w-4 h-4 transition"/>
              <p>{stargazers}</p>
            </div>
            <div className="flex space-x-1">
              <Fork className="fill-gray-700 dark:fill-gray-200 w-4 h-4 transition"/>
              <p>{forks}</p>
            </div>
          </div>
        </a>
      </div>
    </>
  );
}
