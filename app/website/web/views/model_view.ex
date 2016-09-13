defmodule Website.ModelView do
  use Website.Web, :view

  def render("index.json", %{models: models}) do
    %{data: render_many(models, Website.ModelView, "model.json")}
  end

  def render("show.json", %{model: model}) do
    %{data: render_one(model, Website.ModelView, "model.json")}
  end

  def render("model.json", %{model: model}) do
    %{id: model.id,
      name: model.name,
      description: model.description,
      body: model.body}
  end
end
