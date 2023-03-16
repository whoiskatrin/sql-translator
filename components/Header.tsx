import Image from "next/image";
import Link from "next/link";
import Github from "./GitHub";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full mt-5 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex flex-col space-x-3">
        <h1 className="font-mono sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
          sqlTranslate
        </h1>
        <p>Human to SQL Translator</p>
      </Link>
      <div className="flex items-center justify-center">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border bg-gradient-to-r from-gray-50 to-gray-100 text-black px-5 py-2 text-sm shadow-md hover:bg-blue-500 bg-blue-600 font-medium transition"
          href="https://github.com/whoiskatrin/sql-translator"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>
      </div>
    </header>
  );
}
