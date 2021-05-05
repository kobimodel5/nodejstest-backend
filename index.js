const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const mysqlConfig = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT,
};

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({ message: "This server is running successfully" });
});

// /models get/post

app.get("/models", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(`SELECT * FROM models`);

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ error: "Unexpected error has ocurred. Please try again later" });
  }
});

app.post("/models", async (req, res) => {
  if (!req.body.name || !req.body.hour_price) {
    return res.status(400).send({ error: "Incorrect data has been passed" });
  }

  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [result] = await con.execute(
      `INSERT INTO models (name, hour_price) VALUES (${mysql.escape(
        req.body.name
      )}, ${mysql.escape(req.body.hour_price)})`
    );

    if (!result.insertId) {
      return res
        .status(500)
        .send({ error: "Execution failed. Please contact admin" });
    }

    return res.send({ id: result.insertId });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ error: "Unexpected error has ocurred. Please try again later" });
  }
});

// /modelscount get //

app.get("/modelscount", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `SELECT name, COUNT (*) AS Total_models FROM models GROUP BY name `
    );

    return res.send(data);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ error: "Unexpected error has ocurred. Please try again later" });
  }
});

// /vechiles get/post //

app.get("/vechiles", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `SELECT vechiles.model_id, models.name, models.hour_price * 0.21 + models.hour_price AS hour_price FROM vechiles INNER JOIN models ON vechiles.model_id = models.id `
    );
    return res.send(data);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ error: "Unexpected error has ocurred. Please try again later" });
  }
});

app.post("/vechiles", async (req, res) => {
  if (
    !req.body.model_id ||
    !req.body.number_plate ||
    !req.body.country_location
  ) {
    return res.status(400).send({ error: "Incorrect data has been passed" });
  }
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [result] = await con.execute(
      `INSERT INTO vechiles (model_id, number_plate, country_location) VALUES (${mysql.escape(
        req.model_id
      )}, ${mysql.escape(req.body.number_plate)}), ${mysql.escape(
        req.body.country_location
      )})`
    );

    if (!result.insertId) {
      return res
        .status(500)
        .send({ error: "Execution failed. Please contact admin" });
    }
    return res.send({ id: result.insertId });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ error: "Unexpected error has ocurred. Please try again later" });
  }
});

// vechiles/:country_location //

app.get("/vechiles/lt", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `SELECT vechiles.model_id, models.name, models.hour_price * 0.21 + models.hour_price AS hour_price FROM vechiles INNER JOIN models ON vechiles.model_id = models.id WHERE country_location = 'LT'`
    );

    res.send(data);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ error: "Unexpected error has ocurred. Please try again later" });
  }
});

app.get("/vechiles/lv", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `SELECT vechiles.model_id, models.name, models.hour_price * 0.21 + models.hour_price AS hour_price FROM vechiles INNER JOIN models ON vechiles.model_id = models.id WHERE country_location = 'LV'`
    );

    res.send(data);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ error: "Unexpected error has ocurred. Please try again later" });
  }
});

app.get("/vechiles/ee", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `SELECT vechiles.model_id, models.name, models.hour_price * 0.21 + models.hour_price AS hour_price FROM vechiles INNER JOIN models ON vechiles.model_id = models.id WHERE country_location = 'EE'`
    );

    res.send(data);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ error: "Unexpected error has ocurred. Please try again later" });
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ error: "Page not found" });
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on port ${port}`));
