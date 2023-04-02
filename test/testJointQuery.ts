import test from 'ava'
import translateToSQL from '../src/translateToSQL'

interface TestCase {
	inputText: string;
    sql: string;
}

export function run () {
    const tableSchema = "CREATE TABLE cars (id INT, make TEXT, model TEXT, year INT, color TEXT);"
        + "CREATE TABLE customer (cus_id INT, name TEXT, sex INT, age INT);"
        + "CREATE TABLE order (order_id INT, car_id INT, cus_id INT, count INT, price DOUBLE, date DATE);";
       
    test('show me the total order count group by color of cars', t => {
        const inputText = "show me the order count group by cars color";
        const sql = "SELECT cars.color, SUM(order.count) as total_order_count FROM cars\nJOIN order ON cars.car_id = order.car_id\n GROUP BY cars.color";
        const case1: TestCase = { inputText, sql};
        const result = translateToSQL(case1.inputText, process.env.OPENAI_API_KEY, tableSchema);
        t.deepEqual(result, case1.sql);
    });
    test('show me the total order count group by color of cars and sex of customer', t => {
        const inputText = "show me the order count group by color of cars and sex of customer";
        const sql = "SELECT cars.color, customer.sex, SUM(order.count) as total_order_count\nFROM cars\nJOIN order ON cars.car_id = order.car_id\nJOIN customer ON order.cus_id = customer.cus_id\nGROUP BY cars.color, customer.sex";
        const case1: TestCase = { inputText, sql};
        const result = translateToSQL(case1.inputText, process.env.OPENAI_API_KEY, tableSchema);
        t.deepEqual(result, case1.sql);
    });

}

