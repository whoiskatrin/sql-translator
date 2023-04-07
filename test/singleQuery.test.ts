import translateToSQL from '../src/translateToSQL'

interface TestCase {
	inputText: string;
    sql: string;
}

describe("Single Query", () => {
    const tableSchema = "CREATE TABLE cars (id INT, make TEXT, model TEXT, year INT, color TEXT);"
        + "CREATE TABLE customer (cus_id INT, name TEXT, sex INT, age INT);"
        + "CREATE TABLE order (order_id INT, car_id INT, cus_id INT, number INT, price DOUBLE, date DATE);";
    it("show me all the cars that are red",async () => {
        const inputText = "show me all the cars that are red";
        const sql = "SELECT * FROM cars WHERE color = 'red'";
        const case1: TestCase = { inputText, sql};
        const result = translateToSQL(case1.inputText, process.env.OPENAI_API_KEY, tableSchema);
        expect(await result).toEqual(15);
    });
  });

/*
interface TestCase {
	inputText: string;
    sql: string;
}

export function run () {
    const tableSchema = "CREATE TABLE cars (id INT, make TEXT, model TEXT, year INT, color TEXT);"
        + "CREATE TABLE customer (cus_id INT, name TEXT, sex INT, age INT);"
        + "CREATE TABLE order (order_id INT, car_id INT, cus_id INT, number INT, price DOUBLE, date DATE);";
       
    test('show me all the cars that are red',async t => {
        const inputText = "show me all the cars that are red";
        const sql = "SELECT * FROM cars WHERE color = 'red'";
        const case1: TestCase = { inputText, sql};
        const result = translateToSQL(case1.inputText, process.env.OPENAI_API_KEY, tableSchema);
        t.deepEqual(await result, case1.sql);
    });
    test('show me the count of cars',async t => {
        const inputText = "show me the count of cars";
        const sql = "SELECT COUNT() FROM cars";
        const case1: TestCase = {inputText, sql};
        const result = translateToSQL(case1.inputText, process.env.OPENAI_API_KEY, tableSchema);
        t.deepEqual(await result, case1.sql);
    });
    test('show me the count of cars that are green',async t => {
        const inputText = "show me the count of cars that are green";
        const sql = "SELECT COUNT() FROM cars WHERE color = 'green'";
        const case1: TestCase = {inputText, sql};
        const result = translateToSQL(case1.inputText, process.env.OPENAI_API_KEY, tableSchema);
        t.deepEqual(await result, case1.sql);
    });
    test('show me the customer that age older than 20 years',async t => {
        const inputText = "show me the customer that age older than 20 years";
        const sql = "SELECT * FROM customer WHERE age>20";
        const case1: TestCase = {inputText, sql};
        const result = translateToSQL(case1.inputText, process.env.OPENAI_API_KEY, tableSchema);
        t.deepEqual(await result, case1.sql);
    });
    test('show me the total order count that date between \'2023-03-01\' AND \'2023-03-31\'',async t => {
        const inputText = "show me the total order count that date between \'2023-03-01\' AND \'2023-03-31\'";
        const sql = "SELECT sum(count) FROM order WHERE date BETWEEN '2023-03-01' AND '2023-03-31'";
        const case1: TestCase = {inputText, sql};
        const result = translateToSQL(case1.inputText, process.env.OPENAI_API_KEY, tableSchema);
        t.deepEqual(await result, case1.sql);
    });
    
}
*/

