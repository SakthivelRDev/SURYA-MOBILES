/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// This function runs on Google's servers, not the browser
const { onCall } = require("firebase-functions/v2/https");

exports.createStaffAccount = onCall(async (request) => {
  // 1. Debug Logs
  console.log("createStaffAccount called.");
  console.log("Auth Context:", request.auth);
  console.log("Data:", request.data);

  // 2. Security Check: Ensure caller is logged in
  if (!request.auth) {
    console.error("Authentication failed: No auth context found.");
    throw new functions.https.HttpsError(
      "unauthenticated", 
      "Only authenticated users can create accounts."
    );
  }

  const { email, password, displayName } = request.data;
  const callerUid = request.auth.uid;

  console.log(`User ${callerUid} is attempting to create calling staff: ${email}`);

  // 3. Create the User in Firebase Auth
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    console.log("User created in Auth:", userRecord.uid);

    // 4. Add Custom Role Claims
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'staff' });
    console.log("Custom claims set.");

    // 5. Save details to Firestore
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      name: displayName,
      email: email,
      role: "staff",
      createdBy: callerUid,
      createdAt: new Date().toISOString()
    });

    console.log("User details saved to Firestore.");

    return { message: "Success! Staff created.", uid: userRecord.uid };

  } catch (error) {
    console.error("Error creating staff account:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
