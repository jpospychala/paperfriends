defmodule Website.Model do
  use Website.Web, :model

  schema "models" do
    field :name, :string
    field :description, :string
    field :body, :map

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :description, :body])
    |> validate_required([:name, :description, :body])
  end
end
