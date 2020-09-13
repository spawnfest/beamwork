defmodule SpotlightWeb.LayoutView do
  use SpotlightWeb, :view
  @app_js_path Path.join(__DIR__, "../../../priv/static/js/app.js")
  @app_css_path Path.join(__DIR__, "../../../priv/static/css/app.css")

  @app_js File.read!(@app_js_path)
  @app_css File.read!(@app_css_path)

  if Mix.env() == :dev do
    def render("app.js", _), do: File.read!(@app_js_path)
    def render("app.css", _), do: File.read!(@app_css_path)
  else
    def render("app.js", _), do: @app_js
    def render("app.css", _), do: @app_css
  end
end
