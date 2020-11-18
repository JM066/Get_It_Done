require("dotenv").config();
const mysql = require("mysql");

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

const con = mysql.createConnection({
  host: DB_HOST || "127.0.0.1",
  user: DB_USER || "root",
  password: DB_PASS,
  database: DB_NAME || "get_it_done",
  multipleStatements: true
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  let sql = "set foreign_key_checks = 0;";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table creation `items` was successful!");
  });
  // Create userType table
  sql = "DROP TABLE if EXISTS userType; CREATE TABLE userType(ut_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, user_type VARCHAR(40) NOT NULL); INSERT INTO userType(user_type) VALUES ('Consumer'), ('Service Provider');";
  con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table creation `userType` was successful!");
  });

      // Create serviceType table
      sql = "DROP TABLE if EXISTS serviceType; CREATE TABLE serviceType(st_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, service VARCHAR(255) NOT NULL);";
      con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Table creation `serviceType` was successful!");
      });

    // Create serviceProviders table
    sql = "DROP TABLE IF EXISTS serviceProviders; CREATE TABLE serviceProviders(sp_id INT AUTO_INCREMENT PRIMARY KEY, u_id INT NOT NULL, st_id INT NOT NULL, price INT NOT NULL, description VARCHAR(1000), availability BOOLEAN, loc_description VARCHAR(1000), loc_lat VARCHAR(500), loc_lng VARCHAR(500), loc_locality VARCHAR(500), FOREIGN KEY (u_id) REFERENCES users(u_id), FOREIGN KEY (st_id) REFERENCES serviceType(st_id));";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table creation `serviceProviders` was successful!");
    });

  // Insert Service Types
  sql = "INSERT INTO serviceType(service) VALUES ('Cleaning'),('Cooking'),('Gardening'),('Ironing'),('Plumbing');";
  con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Insert into `serviceType` was successful!");
  });

  // Create users table
  sql = "DROP TABLE IF EXISTS users; CREATE TABLE users(u_id INT AUTO_INCREMENT PRIMARY KEY, displayName VARCHAR(100) NOT NULL, email VARCHAR(200) NOT NULL, password VARCHAR(500), ut_id INT NOT NULL, verified TINYINT DEFAULT 0 NOT NULL, facebook_id VARCHAR(100) UNIQUE, google_id VARCHAR(100) UNIQUE, profile_img VARCHAR(1000), FOREIGN KEY (ut_id) REFERENCES userType(ut_id));";
  con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table creation `users` was successful!");
  });

  sql = "INSERT INTO users(displayName, email, password, ut_id, profile_img) VALUES ('Mina', 'mina.arait@gmail.com', 'minapassword123', 2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ6FkUVFp9_KQ-a9_7aZAE5USMAFY23NaTZKA&usqp=CAU');";
  con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Insert into `users` was successful!");
  });
  sql = "INSERT INTO users(displayName, email, password, ut_id, profile_img) VALUES ('Mina', 'mina.arait@gmail.com', 'minapassword123', 2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ6FkUVFp9_KQ-a9_7aZAE5USMAFY23NaTZKA&usqp=CAU');";
  con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Insert into `users` was successful!");
  });
  sql = "INSERT INTO users(displayName, email, password, ut_id, profile_img) VALUES ('Mina', 'mina.arait@gmail.com', 'minapassword123', 2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ6FkUVFp9_KQ-a9_7aZAE5USMAFY23NaTZKA&usqp=CAU');";
  con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Insert into `users` was successful!");
  });
  
  // Create orders table
    sql = "DROP TABLE IF EXISTS orders; CREATE TABLE orders(o_id INT AUTO_INCREMENT PRIMARY KEY, u_id INT NOT NULL, sp_id INT NOT NULL, order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(u_id) REFERENCES users(u_id), FOREIGN KEY (sp_id) REFERENCES serviceProviders(sp_id));";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table creation `orders` was successful!");
    });
   sql = "alter table orders add book_date date null; alter table orders add book_time time null;";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Altered `orders` table");
    });
  // sql = "DROP TABLE IF EXISTS images; CREATE TABLE images(u_id INT NOT NULL, image VARCHAR(255), FOREIGN KEY(u_id) REFERENCES users(u_id));";
  // con.query(sql, function (err, result) {
  //     if (err) throw err;
  //     console.log("Table creation `images` was successful!");
  // });

  console.log("Closing...");
  sql = "set foreign_key_checks = 1;";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table creation `items` was successful!");
  });
  con.end();
});


