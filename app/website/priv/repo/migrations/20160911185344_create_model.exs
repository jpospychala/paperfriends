defmodule Website.Repo.Migrations.CreateModel do
  use Ecto.Migration

  def change do
    create table(:models) do
      add :name, :string
      add :description, :string
      add :body, :map

      timestamps()
    end

  end
end
