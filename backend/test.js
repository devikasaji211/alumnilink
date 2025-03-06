const bcrypt = require("bcryptjs");

const hash = "$2b$10$QpjUeLsWz6YGcG8EXz0bI.5mCaRw1dp9xTSRN/iLKWGkVifjd1ryK";
const password = "angel123";

bcrypt.compare(password, hash, (err, result) => {
    if (err) {
        console.error("Error comparing passwords:", err);
        return;
    }
    console.log("Password matches:", result); // Should log `true` or `false`
});