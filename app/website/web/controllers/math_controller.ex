defmodule Website.MathController do
  use Website.Web, :controller

  def sum(conn, %{"a" => a, "b" => b}) do
    json conn, %{"sum" => String.to_integer(a) + String.to_integer(b) }
  end
end
