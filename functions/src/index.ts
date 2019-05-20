import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

exports.addMessage = functions.https.onRequest(async (req, res) => {
  const author = req.query.author || "";
  const message = req.query.message || "";
  const timestamp = Date.now();

  const temp = await admin
    .database()
    .ref("/messages")
    .push({ author: author, message: message, timestamp: timestamp });

  res.status(200).send("message " + message + " from " + author + " has been inserted to database");
});

exports.getMessages = functions.https.onRequest(async (req, res) => {
  const db = admin.database();
  const ref = db.ref("messages");

  try {
    await ref.once("value", function(data) {
      res.status(200);
      res.send(Object.values(data.val()));
    });
  } catch (error) {
    res.status(200).send([]);
  }
});
