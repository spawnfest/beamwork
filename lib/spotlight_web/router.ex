defmodule SpotlightWeb.Router do
  use SpotlightWeb, :router

  defmacro spotlight(path, opts \\ []) do
    quote bind_quoted: binding() do
      scope path, alias: false, as: false do
        import Phoenix.LiveView.Router, only: [live: 4]
        live "/", SpotlightWeb.PageLive, :index
      end
    end
  end

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {SpotlightWeb.LayoutView, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", SpotlightWeb do
    pipe_through :browser
    live "/", PageLive, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", SpotlightWeb do
  #   pipe_through :api
  # end
end
