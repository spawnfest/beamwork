defmodule SpotlightWeb.PageLive do
  use SpotlightWeb, :live_view
  alias DogSketch.SimpleDog

  @impl true
  def mount(_params, _session, socket) do
    schedule_tick()
    {:ok, assign(socket, quantile_data: formatted_time_series())}
  end

  def handle_info(:tick, socket) do
    schedule_tick()
    {:noreply, assign(socket, :quantile_data, formatted_time_series())}
  end

  defp schedule_tick() do
    Process.send_after(self(), :tick, 1000)
  end

  defp formatted_time_series() do
    data = Spotlight.RequestTimeCollector.get_merged() |> IO.inspect()

    [
      Enum.map(data, fn {ts, _} -> ts end),
      Enum.map(data, fn {_ts, dog_sketch} -> SimpleDog.quantile(dog_sketch, 0.5) |> ceil() end),
      Enum.map(data, fn {_ts, dog_sketch} -> SimpleDog.quantile(dog_sketch, 0.95) |> ceil() end),
      Enum.map(data, fn {_ts, dog_sketch} -> SimpleDog.quantile(dog_sketch, 0.99) |> ceil() end)
    ]
  end

  # @impl true
  # def handle_event("suggest", %{"q" => query}, socket) do
  #  {:noreply, assign(socket, results: search(query), query: query)}
  # end
end
