const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});


const first_name = process.argv[2];

function findPeople (first_name, callback) {
  client.query(`SELECT * FROM famous_people WHERE first_name LIKE CONCAT('%', $1::text, '%')`,[first_name], callback);
};

function displayPeople (err, result) {
  if (err) {
      return console.error("error running query", err);
    }
    let index = 0
    console.log(`Found ${result.rows.length} person(s) by the name '${first_name}'`)
    result.rows.forEach(function(row) {
      index += 1
      console.log(`- ${index}: ${row.first_name} ${row.last_name}, born ${row.birthdate}`);
  })
};

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
  console.log('Searching...');

  findPeople(first_name, displayPeople);
    // client.end();
  });
