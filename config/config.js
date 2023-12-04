module.exports = {
  MONGO_URL: process.env.MONGO_URL,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  PORT: process.env.PORT,
  PERSISTANCE: process.env.MANAGER_PERSISTANCE,
  MAIL: {
    GMAIL_ADRESS: process.env.GMAIL_ADRESS,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD
  },
  LOGGER: process.env.LOGGER
}