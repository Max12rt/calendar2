const jwt = require("jsonwebtoken");

const generateJWT = (id, name) => {
  return new Promise((resolve, reject) => {
    const payload = { id, name };
    jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "24h",
      },
      (err, token) => {
        if (err) {
          console.log("JWTError", err);
          reject("ErrorTokenGenerate");
        } else { resolve(token);}
      }
    );
  });
};

module.exports = generateJWT;
