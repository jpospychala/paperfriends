use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :website, Website.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :website, Website.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: System.get_env("POSTGRES_USER"),
  password: System.get_env("POSTGRES_PASSWORD"),
  database: System.get_env("POSTGRES_USER"),
  hostname: "postgres",
  pool: Ecto.Adapters.SQL.Sandbox
