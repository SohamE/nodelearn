const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

console.log(DB);
mongoose.connect(DB, {}).then((con) => {
  console.log(con.connection);
  console.log("DB connection successful");
});

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
