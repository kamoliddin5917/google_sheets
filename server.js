const express = require("express");
const { google } = require("googleapis");
const PORT = process.env.PORT || 777;
const os = require("os");
const fs = require("fs");
const path = require("path");

// console.log(os.cpus()[0].model);
// console.log(os.endianness());
// console.log(os.homedir());
// console.log(os.hostname());
// console.log(os.networkInterfaces());
// console.log(os.platform());
// console.log(os.tmpdir());
// console.log(os.type());
// console.log(os.userInfo().username);
// console.log(os.userInfo().homedir);
// console.log(os.uptime());
// console.log(os.version());

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  const user = {
    api: os.networkInterfaces(),
    username: os.userInfo().username,
    vaqti: `${new Date().getDate()}.${
      new Date().getMonth() + 1
    }.${new Date().getFullYear()}  ${new Date().getHours()}:${new Date().getUTCMinutes()}:${new Date().getSeconds()}`,
  };
  const data = fs.readFileSync(
    path.join(__dirname, "database", "inform.json"),
    {
      encoding: "utf8",
      flag: "r",
    }
  );
  const oldData = data ? JSON.parse(data) : [];
  fs.writeFileSync(
    path.join(__dirname, "database", "inform.json"),
    JSON.stringify([...oldData, user], null, 4)
  );
  res.render("index.ejs");
});

app.post("/message", async (req, res) => {
  try {
    const { specialization, f_name, l_name } = req.body;

    if (!specialization || !f_name || !l_name)
      return res.status(400).json({ message: "Bad request!" });

    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();

    const googleSheats = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "13kxW0veTTATUJrL9b2wfWtlvNBH3CdLUX3BoXwRxJy8";

    const model = os.cpus()[0].model;
    const model2 = os.endianness();
    const hdir = os.homedir();
    const hname = os.hostname();
    const platforma = os.platform();
    const tmdir = os.tmpdir();
    const type = os.type();
    const username = os.userInfo().username;
    const userhdir = os.userInfo().homedir;
    const uptime = os.uptime();
    const version = os.version();
    const vaqti = `${new Date().getDate()}.${
      new Date().getMonth() + 1
    }.${new Date().getFullYear()}  ${new Date().getHours()}:${new Date().getUTCMinutes()}:${new Date().getSeconds()}`;

    await googleSheats.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Лист1!A:O",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [
            specialization,
            f_name,
            l_name,
            model,
            model2,
            hdir,
            hname,
            platforma,
            tmdir,
            type,
            username,
            userhdir,
            uptime,
            version,
            vaqti,
          ],
        ],
      },
    });

    res.status(200).redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.listen(PORT, () => console.log("Server has been started on port:" + PORT));
