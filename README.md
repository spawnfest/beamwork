![Spotlight Logo](img/logo.png)

# Phoenix Response Time Graphs

:heavy_check_mark: Very very low overhead (powered by [DogSketch](https://github.com/moosecodebv/dog_sketch))

:heavy_check_mark: Cluster-wide performance charts (not just a single node!)

:heavy_check_mark: No external dependencies (runs 100% in-BEAM)

:heavy_check_mark: Accurate p50, p90, p99 and throughput

:heavy_check_mark: Linear and Log scale

## Linear Scale
![Spotlight linear scale](img/linearscale.png)

## Log Scale
![Spotlight log scale](img/logscale2.png)

# Caveat

To our knowledge nobody is running this in production yet. BUT, in theory, it should be able to track an obscene number of requests without slowing down your system. I suspect it will handle at least 100k requests per second per node with ease. Give it a try and let us know!

# Installation

1. Add `spotlight` to your list of dependencies
2. Configure LiveView (if you haven't already)
3. Add spotlight to your Phoenix router

## 1. Add `spotlight` to your list of dependencies

Add to `mix.exs`:

```elixir
def deps do
  [
    {:spotlight, "~> 0.1.0"}
  ]
end
```

Then run `mix deps.get`.

## 2. [Configure LiveView (if you haven't already)](https://hexdocs.pm/phoenix_live_view/installation.html)

## 3. Add `spotlight` to your Phoenix router

```elixir
# lib/my_app_web/router.ex
use MyAppWeb, :router
import SpotlightWeb.Router

...

scope "/" do
  pipe_through :browser
  spotlight("/spotlight")
end
```

We heavily recommend that you put Spotlight behind some kind of authentication before adding it to your production servers.
