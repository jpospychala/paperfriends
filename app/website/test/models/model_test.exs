defmodule Website.ModelTest do
  use Website.ModelCase

  alias Website.Model

  @valid_attrs %{body: "some content", description: "some content", name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Model.changeset(%Model{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Model.changeset(%Model{}, @invalid_attrs)
    refute changeset.valid?
  end
end
