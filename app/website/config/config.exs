# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :website,
  ecto_repos: [Website.Repo]

# Configures the endpoint
config :website, Website.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "MFk3857+bRWE7M1aPJm5qCT6F/QsFQKCw8Gz0XfWYbv4pnmzgCtTs7u+AdYW+S5A",
  render_errors: [view: Website.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Website.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
