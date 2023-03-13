# SQL Translator (SQL to Natural Language and Natural Language to SQL)

SQL Translator is a tool for converting natural language queries into SQL code using artificial intelligence. This project is 100% free and open source.

<img src="https://github.com/whoiskatrin/sql-translator/blob/main/ui.png" width="600" />


## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/whoiskatrin/sql-translator.git
    ```

2. Install the required packages:

    ```bash
    cd sql-translator
    npm install
    ```
3. Input your OPENAI API key in the .env file, you can get your API key [here](https://beta.openai.com/account/api-keys):


    ```bash
    OPENAI_API_KEY=$YOUR_API_KEY
    ```

4. Start the development server:

    ```bash
    npm start
    ```

## Usage

Once the development server is running, you can access the application by navigating to `http://localhost:3000` in your web browser.

Enter a natural language query in the input box and click "Translate" to generate the corresponding SQL code. The generated SQL code will be displayed in the output box.

## Contributing

Contributions to SQL Translator are welcome and encouraged! To contribute, please follow these steps:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Push your changes to your fork
5. Submit a pull request

## License

SQL Translator is released under the MIT License.
