const express = require("express");
const { google } = require("googleapis");
const PORT = process.env.PORT || 777;

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
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

    await googleSheats.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Лист1!A:C",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[specialization, f_name, l_name]],
      },
    });

    res.status(200).redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.listen(PORT, () => console.log("Server has been started on port:" + PORT));
