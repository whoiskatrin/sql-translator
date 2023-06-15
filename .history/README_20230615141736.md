<h1 align="center">SQL Translator<br>(SQL to Natural Language and Natural Language to SQL)</h1>

Welcome to the SQL and Natural Language Translator! This tool is designed to make it easy for anyone to translate SQL (Structured Query Language) commands into natural language and vice versa. SQL is a programming language used to manage and manipulate data in relational databases, and while it's a powerful tool, it can also be quite complex and difficult to understand. On the other hand, natural language is the language that we speak and write in everyday life, and it's often the preferred way to communicate for people who are not familiar with technical jargon.

With the SQL and Natural Language Translator, you don't need to be a SQL expert to understand what's going on in your database, or to write SQL queries. You can simply type in your query in natural language and get the corresponding SQL code, or type in your SQL code and get a human-readable translation.This project is 100% free and open source.

<br>
<div align="center">
    <img src="https://github.com/whoiskatrin/sql-translator/blob/main/UI.png" width="600" />
</div>

## 🌟 Features

- Dark mode
- Lowercase/uppercase toggle
- Copy to clipboard
- SQL syntax highlighting
- Schema awareness (beta)
- Query history


## 📖 How to use:

Using the SQL to Natural Language Translator is easy. Simply navigate to the tool's website and choose whether you want to translate from natural language to SQL or from SQL to natural language. Then, type in your query and hit the "translate" button. The tool will generate the corresponding code or text and display it on the screen. 
You can press the 'reverse' button to give input as Natural Language and get SQL queries in response


## 🎯 Roadmap

- [ ] Functions
- [ ] Procedures


## 🛠️ Installation

### Local Development Environment

1. Clone the repository:

    ```bash
    git clone https://github.com/whoiskatrin/sql-translator.git
    ```

2. Install the required packages:

    ```bash
    cd sql-translator
    npm install
    ```

3. Build the application:

    ```bash
    npm run build
    ```

4. Input your OPENAI API key in the .env file, you can get your API key [here](https://beta.openai.com/account/api-keys):

    ```bash
    OPENAI_API_KEY=$YOUR_API_KEY
    ```

5. Start the development server:

    ```bash
    npm start
    ```

### Docker Compose

1. Clone the repository:

    ```bash
    git clone https://github.com/whoiskatrin/sql-translator.git
    ```

2. Input your OPENAI API key in the .env.production file, you can get your API key [here](https://beta.openai.com/account/api-keys):

    ```bash
    OPENAI_API_KEY=$YOUR_API_KEY
    ```

3. Start the development server:

    ```bash
    docker-compose up
    ```

## 🖥️ Usage

Once the development server is running, you can access the application by navigating to `http://localhost:3000` in your web browser.

Enter a natural language query in the input box and click "Translate" to generate the corresponding SQL code. The generated SQL code will be displayed in the output box.

## 👥 Contributing

Contributions to SQL Translator are welcome and encouraged! To contribute, please follow these steps:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Push your changes to your fork
5. Submit a pull request

## 📜 License

SQL Translator is released under the MIT [License](LICENSE).
